// ---------------------- This will add a student id key/value pair to each student ----------------------------

var fs = require('fs');
var count = 0;

var students = JSON.parse(fs.readFileSync('students.json', 'utf8'));

students = students.map(addId);
students = JSON.stringify(students);

fs.writeFileSync('students.json', students, 'utf8');

console.log('Task has been completed.');

// ----------------------- Functions used --------------------------------------

// Add student id to the object
function addId(student) {
    student['id'] = lpad(count, 4);
    count++;
    return student;
}

// Formatting for the id
function lpad(value, padding) {
    var zeroes = new Array(padding+1).join("0");
    return (zeroes + value).slice(-padding);
}