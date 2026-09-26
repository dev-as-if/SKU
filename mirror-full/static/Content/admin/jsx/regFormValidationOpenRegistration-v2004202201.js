//PAGE LOAD FUNCTION START
function checkUniquAadhar(input) {
    debugger;
    //input = event.target;
    let value = $(input).val();
    $.ajax({
        url: "/admin/student/ISAadharAvailable",
        type: "POST",
        data: { aadharNumber: value },
        dataType: "json",
        success: function(resp) {
            debugger;
            if (!resp) {
                $(input).val("");
                alert("Already have a registration with this aadhaar number");
            }

        }

    });

}



function CheckValidations(e) {
    CheckNewSchemeValidation();
}

function TrackSessionChange(e) {
    var facultyId = $("#FACULTY_ID").val();
    var departmentId = $("#DEPT_ID").val();

    CheckNewSchemeValidation();
    if (facultyId && departmentId) {
        getCourseList();
    }

}

function CheckNewSchemeValidation() {

    var BaseCourse = $("#BASE_COURSE_ID").val();
    var FacultyId = $("#FACULTY_ID").val();
    var DepartmentId = $("#DEPT_ID").val();
    var CurrentSession = $("#CurrentSession").val();
    var CourseId = $("#COURSE_APPL").val();

    if ((BaseCourse == 5 && FacultyId == 2 && DepartmentId == 11 && CourseId == 1312 && CurrentSession >= 504) || (BaseCourse == 28 && FacultyId == 15 && DepartmentId == 21 && CourseId == 1315 && CurrentSession >= 504)) {

        $("#NewSchemePanelCV").attr("style", "display:block;");
        ControlVisibalityValidation("xCategoryClassificationGroup_MJR_CAT_1", true);
        ControlVisibalityValidation("xCategoryClassificationGroup_MNR_CAT_1", true);
        //ControlVisibalityValidation("xCategoryClassificationGroup_ELEC_CAT_1", true);
        GetMajorCategory();
    }
    else {

        $("#NewSchemePanelCV").attr("style", "display:none;");
        ControlVisibalityValidation("xCategoryClassificationGroup_MJR_CAT_1", false);
        ControlVisibalityValidation("xCategoryClassificationGroup_MNR_CAT_1", false);
        //ControlVisibalityValidation("xCategoryClassificationGroup_ELEC_CAT_1", false);
    }
}

function CheckNewSchemeValidationOnLoad() {

    var BaseCourse = $("#BASE_COURSE_ID").val();
    var FacultyId = $("#FACULTY_ID").val();
    var DepartmentId = $("#DEPT_ID").val();
    var CurrentSession = $("#CurrentSession").val();
    var CourseId = $("#COURSE_APPL").val();

    if ((BaseCourse == 5 && CurrentSession >= 504) || (BaseCourse == 28 && CurrentSession >= 504)) {

        $("#NewSchemePanelCV").attr("style", "display:block;");
        ControlVisibalityValidation("xCategoryClassificationGroup_MJR_CAT_1", true);
        ControlVisibalityValidation("xCategoryClassificationGroup_MNR_CAT_1", true);
        //ControlVisibalityValidation("xCategoryClassificationGroup_ELEC_CAT_1", true);

    }
    else {

        $("#NewSchemePanelCV").attr("style", "display:none;");
        ControlVisibalityValidation("xCategoryClassificationGroup_MJR_CAT_1", false);
        ControlVisibalityValidation("xCategoryClassificationGroup_MNR_CAT_1", false);
        //ControlVisibalityValidation("xCategoryClassificationGroup_ELEC_CAT_1", false);
    }
}

function ControlVisibalityValidation(control, required) {
    control = "#" + control;
    var controlX = $(control);
    if (required) {
        controlX.attr('required');;
    } else {
        controlX.removeAttr('required');
    }

}

CheckNewSchemeValidationOnLoad();


function GetMajorCategory() {
    debugger;
    var CourseId = $("#COURSE_APPL").val();
    if (CourseId) {

        $.ajax
            ({
                url: "/AjaxDropDownBind/GetMajorCategoryForNewScheme",
                type: "POST",
                data: { "CourseId": CourseId },
                success: function (result) {
                    $("#xCategoryClassificationGroup_MJR_CAT_1").html('<option selected value="">--- Select Major Category ---</option>');
                    $.each(result,
                        function (i, minorCategoryList) {
                            $("#xCategoryClassificationGroup_MJR_CAT_1").append($("<option></option>").val(minorCategoryList.NSCID).html(minorCategoryList.CATEGORY));
                        });
                },
                error: function () {
                    alert("Whoa! Something went wrong..");
                }
            });


    } else {
        alert("Please select Course first");
        return;
    }
}

function GetMinorCategory() {
    debugger;
    var MajorCategory = $("#xCategoryClassificationGroup_MJR_CAT_1").val();
    var CourseId = $("#COURSE_APPL").val();

    if (MajorCategory) {

        $.ajax
            ({
                url: "/AjaxDropDownBind/GetMinorCategoryForNewScheme",
                type: "POST",
                //dataType: 'application/json',
                //contentType: 'application/json',
                data: { "MajorCategory": MajorCategory, "CourseId": CourseId },
                //data: { "facultyID": facultyId },
                success: function (result) {
                    $("#xCategoryClassificationGroup_MNR_CAT_1").html('<option selected value="">--- Select Minor Category ---</option>');
                    $.each(result,
                        function (i, minorCategoryList) {
                            $("#xCategoryClassificationGroup_MNR_CAT_1").append($("<option></option>").val(minorCategoryList.NSCID).html(minorCategoryList.CATEGORY));
                        });
                    $("#DEPT_ID").prop("disabled", false);
                },
                error: function () {
                    alert("Whoa! Something went wrong..");
                }
            });


    } else {
        alert("Please select Major Category first");
        return;
    }
}

function GetElectiveCategory() {
    debugger;
    var MajorCategory = $("#xCategoryClassificationGroup_MJR_CAT_1").val();
    var MinorCategory = $("#xCategoryClassificationGroup_MNR_CAT_1").val();
    var CourseId = $("#COURSE_APPL").val();

    if (MinorCategory) {

        $.ajax
            ({
                url: "/AjaxDropDownBind/GetElectiveCategoryForNewScheme",
                type: "POST",
                //dataType: 'application/json',
                //contentType: 'application/json',
                data: {
                    "MajorCategory": MajorCategory, "MinorCategory": MinorCategory, "CourseId": CourseId
                },
                //data: { "facultyID": facultyId },
                success: function (result) {
                    $("#xCategoryClassificationGroup_ELEC_CAT_1").html('<option selected value="">--- Select Elective Category ---</option>');
                    $.each(result,
                        function (i, data) {
                            $("#xCategoryClassificationGroup_ELEC_CAT_1").append($("<option></option>").val(data.NSCID).html(data.CATEGORY));
                        });
                    $("#DEPT_ID").prop("disabled", false);
                },
                error: function () {
                    alert("Whoa! Something went wrong..");
                }
            });


    } else {
        alert("Please select Minor Category");
        return;
    }
}

$("#MOBILE").blur(function() {
    var text = $(this);
    $.ajax({
        url: "/registration/chekMobileNumberRegistered",
        data: { "mobile": text.val() },
        success: function(result) {
            if (result) {

                alert(" phone number alredy Exist");
                text.val("");
            }
        }
    });
});

$("#ADHAR_NO").blur(function() {
    var text = $(this);
    $.ajax({
        url: "/registration/CheckAadharRegistered",
        data: { "Aadhar": text.val() },
        success: function(result) {
            if (result) {

                alert(" aadhar number alredy Exist");
                text.val("");
            }
        }
    });
});


function GetFaculty(e) {

    var chkBaseCourse = $("#BASE_COURSE_ID").val();

    if (chkBaseCourse != "7" && chkBaseCourse != "39") {
		$("#BASE_COURSE_ID").val("");
		alert(
			"Registration is not allowed online. Please contact the university for registration!"
		);
		return;
	}

    if ($("#DEGREE_TYPE_ID").val() == "5") {
        $("#Net_Exam_Block").removeClass("hide");
    } else {
        $("#Net_Exam_Block").addClass("hide");

    }
    debugger;
    validateQualifyExam("HightSchoolrow", false, false);
    validateQualifyExam("IntermidiateRow", false, false);
    validateQualifyExam("GraduationRow", false, false);
    validateQualifyExam("pgRow", false, false);
    if ($("#DEGREE_TYPE_ID").val() === "1" || $("#DEGREE_TYPE_ID").val() === "8") {
        //UG
        debugger;
        validateQualifyExam("HightSchoolrow", true, true);
        validateQualifyExam("IntermidiateRow", true, true);
    } else if ($("#DEGREE_TYPE_ID").val() === "2") {
        //PG
        debugger;
        validateQualifyExam("HightSchoolrow", true, true);
        validateQualifyExam("IntermidiateRow", true, true);
        validateQualifyExam("GraduationRow", true, true);
    } else if ($("#DEGREE_TYPE_ID").val() === "3") {
        //Diploma
        validateQualifyExam("HightSchoolrow", true, true);
        validateQualifyExam("IntermidiateRow", true, false);
    } else if ($("#DEGREE_TYPE_ID").val() === "4") {
        //Certificate
        validateQualifyExam("HightSchoolrow", true, true);
        validateQualifyExam("IntermidiateRow", true, false);
    } else if ($("#DEGREE_TYPE_ID").val() === "5" ||
        $("#DEGREE_TYPE_ID").val() === "7") {
        //5=Phd
        //6=PG Diploma
        //7=M. Phil
        //8=Dual Degree
        validateQualifyExam("HightSchoolrow", true, true);
        validateQualifyExam("IntermidiateRow", true, true);
        validateQualifyExam("GraduationRow", true, true);
        validateQualifyExam("pgRow", true, true);
    } else if ($("#DEGREE_TYPE_ID").val() === "6") {
        debugger;
        validateQualifyExam("HightSchoolrow", true, true);
        validateQualifyExam("IntermidiateRow", true, true);
        validateQualifyExam("GraduationRow", true, true);
    }

    //$("#modal_small").toggle();
    var degree = $("#DEGREE_TYPE_ID").val();
    var facultyId = $("#FACULTY_ID").val();
    var BaseCourse = $("#BASE_COURSE_ID").val();
    //var courseId = $("#DEGREE_TYPE_ID").val();
    //var Department = $("#DEPT_ID").val();
    if (BaseCourse) {
        //$("#modal_small").modal();
        $.ajax
        ({
            url: "/AjaxDropDownBind/GetAllFacultyForBaseCourse",
            type: "POST",
            //datatype: 'application/json',
            //contentType: 'application/json',
            data: { "CourseBaseId": BaseCourse },
            success: function(result) {
                $("#FACULTY_ID").html("<option selected value=\"\">Select Faculty</option>");
                $.each(result,
                    function(i, depart) {
                        $("#FACULTY_ID")
                            .append($("<option></option>").val(depart.FACULTY_ID).html(depart.FCX_TITTLE));
                    });
                $("#DEPT_ID").html("");
                $("#COURSE_APPL").html("");
            },
            error: function() {
                alert("Whoa! Something went wrong..");
            }
        });
        //$("#modal_small").toggle();
    }

    CheckNewSchemeValidation();
}

function GetDepartment() {
    debugger;
    var degree = $("#DEGREE_TYPE_ID").val();
    var facultyId = $("#FACULTY_ID").val();
    var BaseCourse = $("#BASE_COURSE_ID").val();

    if (BaseCourse) {
        if (facultyId) {
            $.ajax
            ({
                url: "/AjaxDropDownBind/GetDepartmentsOfFacultyAndBaseCourseId",
                type: "POST",
                //dataType: 'application/json',
                //contentType: 'application/json',
                data: { "Facultyid": facultyId, "CourseBaseId": BaseCourse },
                //data: { "facultyID": facultyId },
                success: function(result) {
                    $("#DEPT_ID").html('<option selected value="">Select Department</option>');
                    $.each(result,
                        function(i, depart) {
                            $("#DEPT_ID").append($("<option></option>").val(depart.DPT_ID).html(depart.DPT_NAME));
                        });
                    $("#DEPT_ID").prop("disabled", false);
                },
                error: function() {
                    alert("Whoa! Something went wrong..");
                }
            });

        }
    } else {
        alert("select Degree First");
        clearCourse();
        return;
    }
    CheckNewSchemeValidation(); 
}

function GetBaseCourses() {
    debugger;
    var degree = $("#DEGREE_TYPE_ID").val();
    //FOR PHD VALIDATION
     if (degree != "5") {
		 $("#DEGREE_TYPE_ID").val("");
		 alert(
			 "This registration is not allowed online. Please contact the university for registration!"
		 );
		 return;
	 }
    if (degree) {

        $.ajax
        ({
            url: "/AjaxDropDownBind/GetCourseBaseName",
            type: "POST",
            //dataType: 'application/json',
            //contentType: 'application/json',
            data: { "id": degree },
            //data: { "facultyID": facultyId },
            success: function(result) {
                $("#BASE_COURSE_ID").html('<option selected value="">Select Applying Course</option>');
                $.each(result,
                    function(i, Course) {
                        $("#BASE_COURSE_ID").append($("<option></option>").val(Course.CNID).html(Course.COURSE_NAME));
                    });
                $("#BASE_COURSE_ID").prop("disabled", false);
            },
            error: function() {
                alert("Whoa! Something went wrong..");
            }
        });


    } else {
        alert("select Degree First");
        clearCourse();
        return;
    }
}

function getCourseList() {
    debugger;
    var facultyId = $("#FACULTY_ID").val();
    var degree = $("#DEGREE_TYPE_ID").val();
    var departmentId = $("#DEPT_ID").val();
    var BaseCourse = $("#BASE_COURSE_ID").val();
    if (!degree) {
        alert("select Degree First");
        clearCourse();
        return;
    } else if (!facultyId) {
        alert("select Faculty First");
        clearCourse();
        return;
    }
    if (!BaseCourse) {
        alert("select Course Type First");
        clearCourse();
        return;
    }

    if (departmentId) {
        //$("#modal_small").modal();
        $.ajax
        ({
            url: "/AjaxDropDownBind/GetCourseOfDepartmentAndBaseCourseId",
            type: "POST",

            data: {
                CourseBaseId: BaseCourse,
                Deparmentid: departmentId,
                //faculty: facultyId,
                //Degree: degree
            },
            success: function(result) {
                $("#COURSE_APPL").html("<option selected value=\"\">Select Course</option>");
                $.each(result,
                    function(i, course) {
                        debugger;
                        if (course.DEGREE_TYPE_ID == degree) {
                            $("#COURSE_APPL").append($("<option></option>").val(course.CRX_ID).html(course.CB_NAME));
                        }
                    });
            },
            error: function() {
                alert("Whoa! Something went wrong..");
            }
        });

    }
    CheckNewSchemeValidation();
}

function getCourseLisForOpenRegistration() {
    debugger;
    var facultyId = $("#FACULTY_ID").val();
    var degree = $("#DEGREE_TYPE_ID").val();
    var departmentId = $("#DEPT_ID").val();
    var BaseCourse = $("#BASE_COURSE_ID").val();
    if (!degree) {
        alert("select Degree First");
        clearCourse();
        return;
    } else if (!facultyId) {
        alert("select Faculty First");
        clearCourse();
        return;
    }
    if (!BaseCourse) {
        alert("select Course Type First");
        clearCourse();
        return;
    }


    if (departmentId) {

        //$("#modal_small").modal();
        $.ajax
        ({
            url: "/AjaxDropDownBind/GetCourseOfDepartmentAndBaseCourseIdOpenStudent",
            type: "POST",

            data: {
                CourseBaseId: BaseCourse,
                Deparmentid: departmentId,
                //faculty: facultyId,
                //Degree: degree
            },
            success: function(result) {
                $("#COURSE_APPL").html("<option selected value=\"\">Select Course</option>");
                $.each(result,
                    function(i, course) {
                        debugger;
                        if (course.DEGREE_TYPE_ID == degree) {
                            $("#COURSE_APPL").append($("<option></option>").val(course.CRX_ID).html(course.CB_NAME));
                        }
                    });
            },
            error: function() {
                alert("Whoa! Something went wrong..");
            }
        });

    }
    CheckNewSchemeValidation();
}

function checkCourseSelected() {
    if ($("#COURSE_APPL").val() === "68") {
        //UG
        debugger;
        validateQualifyExam("GraduationRow", true, false);
        validateQualifyExam("pgRow", true, false);
    }

    if ($("#COURSE_APPL").val() === "181") {
        $("#COURSE_APPL").val("");
        alert(
            "This Department registration is not allowed from online  contact to university for registration !!!");
        return;
    }

    CheckValidations();
}

/*$("#register_form").parsley();*/

//PAGE LOAD FUNCTION END

//PAGE ACTION FUNCTIONS

function validateQualifyExam(control, show, required) {
    control = "#" + control + " :input";
    var controlX = $(control);

    if (show) {
        controlX.slice(0, 5).prop("disabled", false);
        if (required) {
            controlX.slice(0, 6).prop("required", true);
        } else {
            controlX.prop("required", false);
        }
    } else {
        controlX.prop("disabled", true);
        controlX.prop("required", false);
    }
}

if ($("#tandc").prop("checked") === true) {
    $("#btnsbmt").attr("disabled", false);
}

$("#tandc").click(function() {
    $("#btnsbmt").attr("disabled", !this.checked);
});

$("#COURSE_APPL").change(function() {
    if ($("#COURSE_APPL").val() === "181" ||
        $("#COURSE_APPL").val() === "183" ||
        $("#COURSE_APPL").val() === "328" ||
        $("#COURSE_APPL").val() === "1234") {

        //$("#GraduationRow").find("input").slice(0, 4).prop("disabled", false);
        //$("#pgRow").find("input").slice(0, 5).prop("disabled", false).attr("required", false);

        validateQualifyExam("GraduationRow", true, false);
        validateQualifyExam("pgRow", true, false);
    }
});

/*$("#countryDDl").change(function() {
    var country = $("#countryDDl").val();

    $("#StateDDl").html("");
    $("#DistrictDDl").html("");
    $("#StateDDl").attr("disabled", false);
    $("#DistrictDDl").attr("disabled", false);
    $("#StateDDl").attr("required", false);
    $("#DistrictDDl").attr("required", false);

    if (country !== "1") {
        $("#StateDDl").attr("disabled", true);
        $("#DistrictDDl").attr("disabled", true);
    } else {
        $("#StateDDl").attr("required", true);
        $("#DistrictDDl").attr("required", true);
        $.ajax
        ({
            url: "/registration/GetstatesByCountryId/" + $("#countryDDl").val(),
            type: "POST",

            success: function(result) {
                $("#StateDDl").html("<option>Select state</option>");
                $.each(result,
                    function(i, state) {
                        $("#StateDDl").append($("<option></option>").val(state.STATE_ID).html(state.STATE));
                    });
            },
            error: function() {
                $("#StateDDl").html("<option></option>");
            }
        });
    }
});*/


function getStateList() {
    debugger;
    var country = $("#countryDDl").val();

    $("#StateDDl").html("");
    $("#DistrictDDl").html("");
    $("#StateDDl").attr("disabled", false);
    $("#DistrictDDl").attr("disabled", false);
    $("#StateDDl").attr("required", false);
    $("#DistrictDDl").attr("required", false);

    if (country !== "1") {
        $("#StateDDl").attr("disabled", true);
        $("#DistrictDDl").attr("disabled", true);
    } else {
        $("#StateDDl").attr("required", true);
        $("#DistrictDDl").attr("required", true);
        $.ajax
        ({
            url: "/registration/GetstatesByCountryId/" + $("#countryDDl").val(),
            type: "POST",

            success: function (result) {
                $("#StateDDl").html("<option>Select state</option>");
                $.each(result,
                    function (i, state) {
                        $("#StateDDl").append($("<option></option>").val(state.STATE_ID).html(state.STATE));
                    });
            },
            error: function () {
                $("#StateDDl").html("<option></option>");
            }
        });
    }
}


$("#StateDDl").change(function() {
    debugger;
    checkScholarshipEligibility();
    $.ajax
    ({
        url: "/registration/GetDistrictListByStateId/" + $("#StateDDl").val(),
        type: "POST",

        success: function(result) {
            $("#DistrictDDl").html("<option>Select District</option>");
            $.each(result,
                function(i, district) {
                    $("#DistrictDDl").append($("<option></option>").val(district.DISTRICT_ID).html(district.DISTRICT));
                });
        },
        error: function() {
            $("#DistrictDDl").html("<option></option>");
        }
    });
});


function getDistrictList() {
    debugger;
    checkScholarshipEligibility();
    $.ajax
    ({
        url: "/registration/GetDistrictListByStateId/" + $("#StateDDl").val(),
        type: "POST",

        success: function (result) {
            $("#DistrictDDl").html("<option>Select District</option>");
            $.each(result,
                function (i, district) {
                    $("#DistrictDDl").append($("<option></option>").val(district.DISTRICT_ID).html(district.DISTRICT));
                });
        },
        error: function () {
            $("#DistrictDDl").html("<option></option>");
        }
    });
}


function checkScholarshipEligibility() {
    if ($("#StateDDl").val() === "23" && ($("#categoryDDL").val() !== "General" && $("#categoryDDL").val() !== "")) {
        $("#ISEligible_ForScholar").attr("disabled", false);
        $("#ISEligible_ForScholar").closest("div").removeClass("disabled");
    } else {
        $("#ISEligible_ForScholar").prop("checked", false);
        $("#ISEligible_ForScholar").attr("disabled", true);
        $("#ISEligible_ForScholar").closest("div").addClass("disabled");
        $("#ISEligible_ForScholar").closest("span").removeClass("checked");
    }
}

$("#ISEligible_ForScholar").change(function() {
    if ($(this).is(":checked")) {
        $("#domicilecertificate").attr("required", true);
        $("#CAST").attr("required", true);
        $("#INCOME").attr("required", true);
    } else {
        $("#CAST").attr("required", false);
        $("#INCOME").attr("required", false);
        $("#domicilecertificate").attr("required", false);
    }
});

$("#categoryDDL").change(function() {
    checkScholarshipEligibility();
});

//COMMON FUNCTIONS

$(".yearddr").change(function() {
    //debugger;
    var ddr = $(this);
    var ddrval = parseInt(ddr.val());
    var currentrow = $(this).closest("tr").attr("id");
    var prevalue = parseInt($(this).closest("tr").prev("tr").find(".yearddr:first").val());
    var Nextval = parseInt($(this).closest("tr").next("tr").find(".yearddr:first").val());

    if (ddrval <= prevalue) {
        ddr.val("");
        alert("Year is between Next and Previous classes");
    } else {
        if (ddrval >= Nextval) {
            ddr.val("");
            alert("Year is between Next and Previous classes");
        }
    }
});

$(".openFile100kb").on("change",
    function(evt) {
        //console.log(this.files[0].size / 1024);
        if ((this.files[0].size) / 1024 > 100) {
            //this.files.reset();
            alert("file size should be less than 100 kb");
            //console.log(this.files[0].size);
            this.value = "";
        } else {
            if (this.files[0].type.match("image/jpeg")) {
            } else {
                //console.log(this.type);
                alert("file should be in jpg");
                this.value = "";
            }
        }
    });

$(".openFile1000kb").on("change",
    function(evt) {
        //console.log(this.files[0].size / 1024);
        if ((this.files[0].size) / 1024 > 1000) {
            //this.files.reset();
            alert("file size should be less than 1000 kb");
            //console.log(this.files[0].size);
            this.value = "";
        } else {
            if (this.files[0].type.match("image/jpeg")) {
            } else {
                //console.log(this.type);
                alert("file should be in jpg");
                this.value = "";
            }
        }
    });

$(".maxmark").keyup(function() {
    //debugger;
    var clicked = $(this);
    $(clicked).closest("div.row").find(".obtmark").attr("disabled", false);
});

$(".obtmark").keyup(function(e) {
    var ctr = $(this);
    debugger;
    if (
        parseInt($(ctr).val()) > parseInt($(ctr).closest("div.row").find(".maxmark").val())) {
        $(ctr).val("");
        $(ctr).closest("div.row").find(".percentmark").val("");
        $(ctr).closest("div.row").find(".percentmark").attr("disabled", true);
        e.preventDefault();
    } else {
        $(ctr).closest("div.row").find(".percentmark")
            .val(parseFloat(parseFloat(($(ctr).val() /
                parseFloat($(ctr).closest("div.row").find(".maxmark").val()) *
                100))).toFixed(2));
    }
});

$(".obtmark").on("input",
    function(e) {
    });

$(".Numeric").keydown(function(e) {
    var keyPressed;
    if (!e) {
        e = window.event;
    }
    if (e.keyCode) keyPressed = e.keyCode;
    else if (e.which) keyPressed = e.which;
    var hasDecimalPoint = (($(this).val().split(".").length - 1) > 0);
    if (keyPressed == 46 ||
        keyPressed == 8 ||
        ((keyPressed == 190 || keyPressed == 110) && (!hasDecimalPoint && !e.shiftKey)) ||
        keyPressed == 9 ||
        keyPressed == 27 ||
        keyPressed == 13 ||
        // Allow: Ctrl+A
        (keyPressed == 65 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (keyPressed >= 35 && keyPressed <= 39)) {
        // let it happen, don't do anything
        return;
    } else {
        // Ensure that it is a number and stop the keypress
        if (e.shiftKey || (keyPressed < 48 || keyPressed > 57) && (keyPressed < 96 || keyPressed > 105)) {
            e.preventDefault();
        }
    }
});

//DATE OF BIRTH INPUT MASK START
{
    $("#DOB").mask("99/99/9999");

    var input = document.querySelectorAll(".js-date")[0];

    var dateInputMask = function dateInputMask(elm) {
        elm.addEventListener("keypress",
            function(e) {
                if (e.keyCode < 47 || e.keyCode > 57) {
                    e.preventDefault();
                }

                var len = elm.value.length;

                // If we're at a particular place, let the user type the slash
                // i.e., 12/12/1212
                if (len !== 1 || len !== 3) {
                    if (e.keyCode == 47) {
                        e.preventDefault();
                    }
                }

                // If they don't add the slash, do it for them...
                if (len === 2) {
                    elm.value += "/";
                }

                // If they don't add the slash, do it for them...
                if (len === 5) {
                    elm.value += "/";
                }
            });
    };

    dateInputMask(input);
}
//DATE OF BIRTH INPUT MASK END

function CheckMxMarks(ctr) {
    debugger;
    if ($(ctr).val() <= 1) {
    }
}

$(".openFileBlock").on("click",
    function (evt) {
        alert("Please contact university for submission of certificate");
        /*document.getElementById("TRANSFER").disabled = "true"; */
    });