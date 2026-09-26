const fs = require('fs');
const path = require('path');

const output = path.join(__dirname, '..', 'mirror-full', 'static', 'results', 'SKU266920325-result.pdf');
const lines = [
  'Shri Krishna University - Statement of Marks',
  'Enrollment No.: SKU266920325    Date of Birth: 15-02-2002',
  '',
  'Paper Code | Paper Name                         | Max | Obt',
  'CC 1       | Gender, School & Equality          | 100 | 69',
  'CC 2       | Educational Technology & ICT        | 100 | 68',
  'CC 3       | Creating an Inclusive School        | 100 | 79',
  'CC 4       | Environmental Education             | 100 | 78',
  'EPC 3      | Understanding the Self              |  50 | 47',
  'EPC 4      | Understanding of ICT                 |  50 | 41',
  '',
  'TOTAL: 382 / 500'
];

if (fs.existsSync(output) && !process.env.FORCE_GENERATE_RESULT_PDF) {
  console.log(`Preserved existing ${output}`);
  process.exit(0);
}

const stream = ['BT', '/F1 12 Tf', '72 760 Td', ...lines.flatMap((line, index) => [index ? '0 -22 Td' : '', `(${escapePdf(line)}) Tj`]).filter(Boolean), 'ET'].join('\n');
const objects = [
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  `<< /Length ${Buffer.byteLength(stream, 'latin1')} >>\nstream\n${stream}\nendstream`
];

let pdf = '%PDF-1.4\n';
const offsets = [0];
objects.forEach((object, index) => { offsets[index + 1] = Buffer.byteLength(pdf, 'latin1'); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
const xref = Buffer.byteLength(pdf, 'latin1');
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.slice(1).map(offset => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, Buffer.from(pdf, 'latin1'));
console.log(`Generated ${output}`);

function escapePdf(value) { return value.replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)'); }