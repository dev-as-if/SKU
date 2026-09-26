param(
    [string]$Source = 'https://www.skuindia.ac.in/',
    [string]$Output = (Join-Path $PSScriptRoot '..\mirror'),
    [int]$MaxPages = 500
)

$ErrorActionPreference = 'Stop'
$sourceUri = [Uri]$Source
$queue = [Collections.Generic.Queue[Uri]]::new()
$queued = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$visited = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$failures = [Collections.Generic.List[object]]::new()
$external = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$queue.Enqueue($sourceUri)
$queued.Add($sourceUri.AbsoluteUri) | Out-Null

function Get-CanonicalUri([Uri]$uri) {
    $builder = [UriBuilder]$uri
    $builder.Scheme = 'https'
    $builder.Host = 'www.skuindia.ac.in'
    $builder.Fragment = ''
    $builder.Query = ''
    return $builder.Uri
}

function Test-SameOrigin([Uri]$uri) {
    return $uri.Host -in @('skuindia.ac.in', 'www.skuindia.ac.in')
}

function Get-LocalPath([Uri]$uri) {
    $path = [Uri]::UnescapeDataString($uri.AbsolutePath).TrimStart('/')
    if ([string]::IsNullOrWhiteSpace($path)) { return 'index.html' }
    if ($path.EndsWith('/')) { return ($path.TrimEnd('/') + '\index.html') }
    return $path
}

function Save-Bytes([string]$relativePath, [byte[]]$bytes) {
    $target = Join-Path $Output ('static\' + $relativePath.TrimStart('/'))
    $parent = Split-Path $target -Parent
    New-Item -ItemType Directory -Force -Path $parent | Out-Null
    [IO.File]::WriteAllBytes($target, $bytes)
}

function Resolve-FoundUrl([string]$value, [Uri]$baseUri) {
    if ([string]::IsNullOrWhiteSpace($value) -or $value.StartsWith('#') -or $value.StartsWith('data:') -or $value.StartsWith('javascript:') -or $value.StartsWith('mailto:') -or $value.StartsWith('tel:')) { return $null }
    try {
        $resolved = [Uri]::new($baseUri, ($value -split ',')[0].Trim())
        if (Test-SameOrigin $resolved) { return Get-CanonicalUri $resolved }
        return $resolved
    } catch { return $null }
}

function Add-Discovered([Uri]$uri, [Uri]$baseUri) {
    if ($null -eq $uri) { return }
    if ($uri.AbsolutePath -match '^/admin(?:/|$)' -or $uri.AbsolutePath -match '/(login|logout)(?:/|$)') { return }
    if (-not (Test-SameOrigin $uri)) { $external.Add($uri.AbsoluteUri) | Out-Null; return }
    $key = $uri.AbsoluteUri
    $extension = [IO.Path]::GetExtension($uri.AbsolutePath).ToLowerInvariant()
    $isPage = [string]::IsNullOrEmpty($extension) -or $extension -in @('.html', '.htm', '.aspx', '.php')
    if ($isPage -and -not $queued.Contains($key) -and $queued.Count -lt $MaxPages) {
        $queue.Enqueue($uri)
        $queued.Add($key) | Out-Null
    }
}

function Save-Resource([Uri]$uri) {
    try {
        $response = Invoke-WebRequest -Uri $uri -UseBasicParsing -UserAgent 'SKU-local-clone/1.0 (+public mirror)'
        if ($response.StatusCode -lt 200 -or $response.StatusCode -ge 300) { throw "HTTP $($response.StatusCode)" }
        $length = 0L
        [long]::TryParse($response.Headers['Content-Length'], [ref]$length) | Out-Null
        if ($length -gt 20MB) { throw "Skipped response larger than 20 MB ($length bytes)" }
        $relative = Get-LocalPath $uri
        $bytes = $response.Content
        if ($bytes -is [string]) { $bytes = [Text.Encoding]::UTF8.GetBytes($bytes) }
        Save-Bytes $relative $bytes
    } catch {
        $failures.Add([PSCustomObject]@{ url = $uri.AbsoluteUri; error = $_.Exception.Message })
    }
}

function Get-FoundValues([string]$text) {
    $pattern = '(?:href|src|data-src|data-srcset|poster)\s*=\s*["'']([^"'']+)["'']'
    return [regex]::Matches($text, $pattern, [Text.RegularExpressions.RegexOptions]::IgnoreCase) | ForEach-Object { $_.Groups[1].Value }
}

New-Item -ItemType Directory -Force -Path (Join-Path $Output 'pages') | Out-Null
New-Item -ItemType Directory -Force -Path (Join-Path $Output 'static') | Out-Null

while ($queue.Count -gt 0) {
    $pageUri = $queue.Dequeue()
    if (-not $visited.Add($pageUri.AbsoluteUri)) { continue }
    try {
        $response = Invoke-WebRequest -Uri $pageUri -UseBasicParsing -UserAgent 'SKU-local-clone/1.0 (+public mirror)'
        if ($pageUri.AbsolutePath -match '^/admin(?:/|$)' -or $pageUri.AbsolutePath -match '/(login|logout)(?:/|$)') { continue }
        $length = 0L
        [long]::TryParse($response.Headers['Content-Length'], [ref]$length) | Out-Null
        if ($length -gt 20MB) { throw "Skipped response larger than 20 MB ($length bytes)" }
        $bytes = $response.Content
        if ($bytes -is [string]) { $bytes = [Text.Encoding]::UTF8.GetBytes($bytes) }
        $contentType = $response.Headers['Content-Type']
        $relative = Get-LocalPath $pageUri
        if ($contentType -match 'html' -or $relative -match '\.html$') {
            $target = Join-Path $Output ('pages\' + $relative)
            New-Item -ItemType Directory -Force -Path (Split-Path $target -Parent) | Out-Null
            [IO.File]::WriteAllBytes($target, $bytes)
            $text = [Text.Encoding]::UTF8.GetString($bytes)
            foreach ($value in (Get-FoundValues $text)) {
                $foundUri = Resolve-FoundUrl $value $pageUri
                if ($null -eq $foundUri) { continue }
                if (Test-SameOrigin $foundUri) {
                    $extension = [IO.Path]::GetExtension($foundUri.AbsolutePath).ToLowerInvariant()
                    if ([string]::IsNullOrEmpty($extension) -or $extension -in @('.html', '.htm', '.aspx', '.php')) { Add-Discovered $foundUri $pageUri }
                    else { Save-Resource $foundUri }
                } else { $external.Add($foundUri.AbsoluteUri) | Out-Null }
            }
        } else {
            Save-Bytes $relative $bytes
        }
        Write-Host ("[{0}/{1}] {2}" -f $visited.Count, $queued.Count, $pageUri.AbsoluteUri)
    } catch {
        $failures.Add([PSCustomObject]@{ url = $pageUri.AbsoluteUri; error = $_.Exception.Message })
        Write-Warning ("Failed $($pageUri.AbsoluteUri): $($_.Exception.Message)")
    }
}

$manifest = [ordered]@{
    source = $Source
    crawledAt = (Get-Date).ToUniversalTime().ToString('o')
    pagesDiscovered = $queued.Count
    pagesCloned = ($visited | Where-Object { $_ }).Count - $failures.Count
    imagesDownloaded = (Get-ChildItem (Join-Path $Output 'static') -Recurse -File -Include *.png,*.jpg,*.jpeg,*.gif,*.webp,*.svg | Measure-Object).Count
    documentsDownloaded = (Get-ChildItem (Join-Path $Output 'static') -Recurse -File -Include *.pdf,*.doc,*.docx,*.xls,*.xlsx | Measure-Object).Count
    videosDownloaded = (Get-ChildItem (Join-Path $Output 'static') -Recurse -File -Include *.mp4,*.webm,*.ogg | Measure-Object).Count
    externalLinks = @($external | Sort-Object)
    failedResources = @($failures)
    skippedRestrictedResources = @()
}
$manifest | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $Output '..\clone-manifest.json') -Encoding UTF8
Write-Host "Mirror complete: $($manifest.pagesCloned) pages, $($manifest.imagesDownloaded) images, $($failures.Count) failures"