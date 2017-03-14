var fs = require("fs");

var studentsArray = JSON.parse(fs.readFileSync('students.json', 'utf8'));

createFiles(studentsArray);


// ---------------------- Functions Used ---------------------------

function createFiles(students) {
    
    var count = 0;
    
    students.map(function(student) {
        var id = student.id;
        delete student.id;
        
        student = JSON.stringify(student, null, 3);
        
        fs.writeFileSync(`${id}.json`, student, 'utf8');
        
    });
}