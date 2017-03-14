/*global $*/

var students = [];
var deletedStudents = [];
var nextId = 0;

$(document).ready(function () {
  
  $.ajax({
    type: 'GET',
    url: 'https://cs3660-tysonwhite.c9users.io/api/v1/students.json',
    dataType: 'json',
    success: function(studentsList) {
      
      let studentIdList = studentsList;
      let idCount = studentIdList.length;
      nextId = 1 + (1 * studentsList[idCount - 1]); //multiplying by 1 is just to coerce it from a string to number
      
      const MAX = 10;
      let countStudents = 0;
      let finishedStudents = 0;
      
      for (let i = 0; i < MAX; i++) {
        
        if (!studentIdList[i]) break;
        countStudents++;
        
        $.ajax({
          type: 'GET',
          url: `https://cs3660-tysonwhite.c9users.io/api/v1/students/${studentIdList[i]}.json`,
          dataType: 'json',
          success: function(student) {
            student = JSON.parse(student);
            student["id"] = `${studentIdList[i]}`;
            student = standardizeStudent(student);
            
            students.push(student);
            finishedStudents++;
            
            if (finishedStudents === countStudents) {
              renderTable();
              renderTiles();
              defaultView();
            }
          }// end success function
        });// end student ajax
      }// end for loop
    }// end success function
  });// end list ajax
  
  // Changes view from Tiles to Tables
  $('#tableBtn').click(function() {
    
    $('.main-view').each(function() {
        $(this).toggle();
        Cookies.set('view', 'table');
    });
    
    $(this).prop('disabled', true);
    $('#tileBtn').prop('disabled', false);
    
  }); //End #tableBtn.click
  
  // Changes view from Tables to Tiles
  $('#tileBtn').click(function() {
    
    $('.main-view').each(function() {
        $(this).toggle();
        Cookies.set('view', 'tile');
    });
    
    $(this).prop('disabled', true);
    $('#tableBtn').prop('disabled', false);
    
  }); //End #tileBtn.click
  
  // This does the sorting and the modals
  $('.table-head').click(function() {
    
    $('#sort-modal').modal({backdrop: 'static', keyboard: false});
    setTimeout(function() { $('#sort-modal').modal("hide"); }, 500);
    
    let sortingColumnSpan = $(this).find('span');
    let SORTED = 'glyphicon-menu-down';
    let REVERSED = 'glyphicon-menu-up';
    
    if (sortingColumnSpan.hasClass(SORTED)) {
      removeGlyphicons();
      sortStudentData(students, $(this).attr('id'))
      students.reverse();
      sortingColumnSpan.addClass(REVERSED);
      
      Cookies.set('column', `${$(this).attr('id')}`);
      Cookies.set('sort', 'reversed');
    }
    else if (sortingColumnSpan.hasClass(REVERSED)) {
      removeGlyphicons();
      sortStudentData(students, $(this).attr('id'))
      sortingColumnSpan.addClass(SORTED);
      
      Cookies.set('column', `${$(this).attr('id')}`);
      Cookies.set('sort', 'normal');
    }
    else {
      removeGlyphicons();
      sortStudentData(students, $(this).attr('id'))
      sortingColumnSpan.addClass(SORTED);
      
      Cookies.set('column', `${$(this).attr('id')}`);
      Cookies.set('sort', 'normal');
    }
    
    renderTable();
    
  }); //End .table-head.click
  
  $('#addStudentBtn').click(function() {
    $('#add-modal').modal({backdrop: 'static', keyboard: false})
      .one('click', '#confirmAddBtn', function() {
        
        let newStudent = {};
        newStudent['fname'] = $('#fNameAdd').val();
        newStudent['lname'] = $('#lNameAdd').val();
        newStudent['startDate'] = $('#dateAdd').val();
        newStudent['street'] = $('#streetAdd').val();
        newStudent['city'] = $('#cityAdd').val();
        newStudent['state'] = $('#stateAdd').val();
        newStudent['zip'] = $('#zipAdd').val();
        newStudent['phone'] = $('#phoneAdd').val();
        newStudent['year'] = 1 * $('#yearAdd').val();
        newStudent['id'] = `${('0000' + nextId).slice(-4)}`;
        
        // console.log(`Creating student: ${JSON.stringify(newStudent, null, 3)}`);
        
        CreateStudentAjax(newStudent);
        
      });
      
  }); // End #addStudentBtn.click
  
  $('#restoreBtn').click(function() {
    
    $('#restore-modal').modal({backdrop: 'static', keyboard: false})
      .one('click', '#confirmRestoreBtn', function() {
        
        if (deletedStudents[0]) {
          
          let deletedStu = deletedStudents.pop();
          
          students.push(deletedStu);
          renderTable();
          
          UpdateStudentAjax(deletedStu);
          
        }
        
      });
  }); // End #restoreBtn.click
  
  // Handles the different modals for the api calls ex: Delete, Edit
  $(document).ajaxStop(function() {
    
    // Must use event delegation because these elements are dynamically created
    // Delete Button click
    $('#studentRows').on('click', '#deleteBtn', function() {
      
      let studentsId = $(this).parent().parent().parent().attr('id');
      
      $('#delete-modal').modal({backdrop: 'static', keyboard: false})
        .one('click', '#confirmDeleteBtn', function() {
        
          DeleteStudentAjax(studentsId);
          
          console.log(`Student ${studentsId} has been deleted.`);
          
        });
      
    }); // End Delete Button
    
    // Edit button click
    $('#studentRows').on('click', '#editBtn', function() {
      
      let studentsId = $(this).parent().parent().parent().attr('id');
      let editStudent = {};
      let studentIndex = -1;
      
      for (let k = 0; k < nextId; k++) {
        if (students[k]) {
          if (students[k].id === studentsId) {
            editStudent = students[k];
            studentIndex = k;
            break;
          }
        }
      }
      
      // Populate Modal
          $('#edit-modal .modal-body #fNameForm').val(editStudent.fname);
          $('#edit-modal .modal-body #lNameForm').val(editStudent.lname);
          $('#edit-modal .modal-body #dateForm').val(editStudent.startDate);
          $('#edit-modal .modal-body #streetForm').val(editStudent.street);
          $('#edit-modal .modal-body #cityForm').val(editStudent.city);
          $('#edit-modal .modal-body #stateForm').val(editStudent.state);
          $('#edit-modal .modal-body #zipForm').val(editStudent.zip);
          $('#edit-modal .modal-body #phoneForm').val(editStudent.phone);
          $('#edit-modal .modal-body #yearForm').val(editStudent.year);
      
      $('#edit-modal').modal({backdrop: 'static', keyboard: false})
        .one('click', '#confirmEditBtn', function() {
          
          let newStudent = {};
          newStudent['fname'] = $('#fNameForm').val();
          newStudent['lname'] = $('#lNameForm').val();
          newStudent['startDate'] = $('#dateForm').val();
          newStudent['street'] = $('#streetForm').val();
          newStudent['city'] = $('#cityForm').val();
          newStudent['state'] = $('#stateForm').val();
          newStudent['zip'] = $('#zipForm').val();
          newStudent['phone'] = $('#phoneForm').val();
          newStudent['year'] = 1 * $('#yearForm').val();
          newStudent['id'] = studentsId;
          
          UpdateStudentAjax(newStudent);
          // console.log(JSON.stringify(newStudent, null, 3));
          
        });
    }); // End Edit Button
    
  }); // End Delete, Edit button clicks
  
  // Remove all glyphicons
  function removeGlyphicons() {
    $('.glyphicon-menu-down').removeClass('glyphicon-menu-down');
    $('.glyphicon-menu-up').removeClass('glyphicon-menu-up');
  }
  
  // Read the cookies and set the view accordingly
  function defaultView() {
    if (Cookies.get('view') == 'tile') {
      $('.main-view').toggle();
      $('#tableBtn').prop('disabled', false);
      $('#tileBtn').prop('disabled', true);
    }
    
    // Sorting cookies
    let column = Cookies.get('column');
    let sort = Cookies.get('sort');
    let SORTED = 'glyphicon-menu-down';
    let REVERSED = 'glyphicon-menu-up';
    
    let sortingColumnSpan = $(`#${column}`).find('span');
    
    sortStudentData(students, column);
    sortingColumnSpan.addClass(SORTED);
    
    if (sort === 'reversed') {
      removeGlyphicons();
      students.reverse();
      sortingColumnSpan.addClass(REVERSED);
    }
    
    renderTable();
  }

}); //End $(document).ready


// ---------------------------- Display Functions to be used ----------------------------

  // Display table
  function renderTable() {
      // Display the students in the table
      let studentRows = [];
      
      for (let student of students) {
        studentRows.push(`
              <tr id="${student.id}">
                <td>${student.displayName}</td>
                <td>${student.startDate}</td>
                <td>${student.street}</td>
                <td>${student.city}</td>
                <td>${student.state}</td>
                <td>${student.zip}</td>
                <td>${student.phone}</td>
                <td>${student.displayYear}</td>
                <td class="text-center hover-btn">
                  <div class="btn-group">
                    <button type="button" class="btn btn-warning glyphicon glyphicon-edit" 
                      id="editBtn" title="Edit Student Info">
                    </button> 
                    <button type="button" class="btn btn-danger glyphicon glyphicon-trash" 
                      id="deleteBtn" title="Delete Student">
                    </button>
                  </div>
                </td>
              </tr>
        `);
      }
      $('#studentRows').html(studentRows.join(''));
      
  }// End renderTable()
  
  // Display tiles
  function renderTiles() {
      // Display the students in the tiles
      let studentRows = [];
      
      for (let student of students) {
          studentRows.push(`
              <div class="col-sm-3">
                <div class="panel panel-default">
                  <div class="panel-heading">
                    <h3 class="panel-title">${student.fname} ${student.lname}</h3>
                  </div>
                  <div class="panel-body">
                    <b>Start Date:</b>
                    <br>
                    ${student.startDate}
                    <br><br>
                    <b>Address:</b>
                    <br>
                    ${student.street}
                    <br>
                    ${student.city}, ${student.state} ${student.zip}
                    <br><br>
                    <b>Phone:</b>
                    <br>
                    ${student.phone}
                    <br><br>
                    <b>Year:</b>
                    <br>
                    ${student.displayYear}
                  </div>
                </div>
                
              </div>
          `);
      }
      $('#studentTiles').html(studentRows.join(''));
      
  }// End renderTiles()


// ---------------------------- Reformat data from JSON ---------------------------------

// Performs all adjustments to the student
function standardizeStudent(student) {
  student = standardizeYear(student);
  student = standardizeDate(student);
  student = displayNameFormat(student);
  
  return student;
} // End standardizeStudent()

// Adds a new key/value pair for the school year
function standardizeYear(student) {
  if (student.year === 1 || student.year === '1') {
    student["displayYear"] = "Freshman";
    return student;
  }
  if (student.year === 2 || student.year === '2') {
    student["displayYear"] = "Sophomore";
    return student;
  }
  if (student.year === 3 || student.year === '3') {
    student["displayYear"] = "Junior";
    return student;
  }
  if (student.year === 4 || student.year === '4') {
    student["displayYear"] = "Senior";
    return student;
  }
  
  student["displayYear"] = "Invalid";     // Was not a valid school year
  return student;
  
} // End standardizeYear()

// Adds a new key/value pair to make it easier to sort dates
function standardizeDate(student) {
  student["sortableDate"] = new Date(student.startDate);
  return student;
} // End standardizeDate()

// Adds a new key/value pair to make it easy to display the student name
function displayNameFormat(student) {
  student['displayName'] = `${student.fname} ${student.lname}`;
  return student;
} // End displayNameFormat()


// ---------------------------- AJAX FUNCTIONS ------------------------------------------

// POST - Create
function CreateStudentAjax(student) {
  $.ajax({
    type: 'POST',
    url: 'https://cs3660-tysonwhite.c9users.io/api/v1/students',
    data: student,
    dataType: 'text',
    success: function(response) {
      
      if (response === "Success") {
        
        student = standardizeStudent(student);
        
        students.push(student);
        
        console.log("Student added");
        nextId++;
        renderTable();
      }
      else console.log("Student not added");
    }
  });
}

// GET - Read
function ReadStudentAjax(id) {
  $.ajax({
    type: 'GET',
    url: `https://cs3660-tysonwhite.c9users.io/api/v1/students/${id}.json`,
    dataType: 'json',
    success: function(student) {
      // Stuff to do when successful
    }
  });
}

// PUT - Update
function UpdateStudentAjax(student) {
  $.ajax({
    type: 'PUT',
    url: `https://cs3660-tysonwhite.c9users.io/api/v1/students/${student.id}.json`,
    data: student,
    dataType: 'json',
    success: function(returnStudent) {
      
      // console.log(JSON.stringify(returnStudent, null, 3));
      
      returnStudent = JSON.parse(returnStudent);
      returnStudent = standardizeStudent(returnStudent);
      
      for (let k = 0; k < nextId; k++) {
        if (students[k]) {
          if (students[k].id === student.id) {
            students[k] = returnStudent;
            break;
          }
        }
      }
      
      renderTable();
    }
  });
}

// DELETE
function DeleteStudentAjax(id) {
  $.ajax({
    type: 'DELETE',
    url: `https://cs3660-tysonwhite.c9users.io/api/v1/students/${id}.json`,
    dataType: 'text', 
    success: function(response) {
      
      if (response === "Deleted") {
        let newStudents = [];
        
        // for (let n = 0; n < students.length; n++) {
        for (let student of students) {
          if (student.id !== id) {
            newStudents.push(student);
          }
          else {
            deletedStudents.push(student);
          }
        }
        
        students = newStudents;
        renderTable();
        
      }
      
    }
  });
}

// GET - List
function GetListStudentsAjax() {
  $.ajax({
    type: 'GET',
    url: 'https://cs3660-tysonwhite.c9users.io/api/v1/students.json',
    dataType: 'json',
    success: function(studentsList) {
      return JSON.parse(studentsList);
    }
  });
}