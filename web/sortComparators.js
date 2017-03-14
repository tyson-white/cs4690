// --------------------------- SORTING STUFF -------------------------------------

function sortStudentData(studentArrObj, sortBy) {

    studentArrObj.sort(function(studentA, studentB) {
        return compareAndSortHelper(studentA[sortBy], studentB[sortBy]);
    });

}

// HELPER for numeric comparisons
function compareAndSortHelper(stu1, stu2) {

  // if strings
  if ((typeof stu1 === "string") && (typeof stu2 === "string")) {
      return compareTwoStrings(stu1, stu2);
  }

  // if numbers
  if ((typeof stu1 === "number") && (typeof stu2 === "number")) {
      return compareTwoNumbers(stu1, stu2);
  }
  
  // if date
  if ((stu1 instanceof Date) && (stu2 instanceof Date)) {
    return compareTwoDates(stu1, stu2);
  }
}

// HELPER for string comparisons
function compareTwoStrings(string1, string2) {

  let firstWord = string1.toLowerCase();
  let secondWord = string2.toLowerCase();

  if (firstWord < secondWord) return -1;
  if (firstWord > secondWord) return 1;

  return 0;       // names must be equal
}

// Compares to date objects
function compareTwoDates(date1, date2) {
  
  return date1 - date2;
}

// Compares to numbers
function compareTwoNumbers(num1, num2) {
  
  return num1 - num2;
}