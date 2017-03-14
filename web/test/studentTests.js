//unit tests

describe("compareNumbers(a, b)", function() { //suite
    
    it("should return 0 if the two numbers are the same", function() { //spec
        expect(compareTwoNumbers(0, 0)).toBe(0); //expectation
        expect(compareTwoNumbers(1, 1)).toBe(0);
        expect(compareTwoNumbers(-1, -1)).toBe(0);
        expect(compareTwoNumbers(0.1, .1)).toBe(0);
        expect(compareTwoNumbers(10000001, 10000001)).toBe(0);
        expect(compareTwoNumbers(23.5, 23.5)).toBe(0);
    });

    it("and should return positive number if first number is bigger", function() {
        expect(compareTwoNumbers(1, 0)).toBeGreaterThan(0);
        expect(compareTwoNumbers(1.0, .5)).toBeGreaterThan(0);
        expect(compareTwoNumbers(-1, -4)).toBeGreaterThan(0);
        expect(compareTwoNumbers(0.1, 0.0)).toBeGreaterThan(0);
        expect(compareTwoNumbers(10000001, 10000000)).toBeGreaterThan(0);
        expect(compareTwoNumbers(23.51, 23.5)).toBeGreaterThan(0);
    });

    it("and should return negative number if first number is smaller", function() {
        expect(compareTwoNumbers(0, 1)).toBeLessThan(0);
        expect(compareTwoNumbers(.5, 1.0)).toBeLessThan(0);
        expect(compareTwoNumbers(-4, -1)).toBeLessThan(0);
        expect(compareTwoNumbers(0.0, 0.1)).toBeLessThan(0);
        expect(compareTwoNumbers(10000000, 10000001)).toBeLessThan(0);
        expect(compareTwoNumbers(23.5, 23.51)).toBeLessThan(0);
    });
});

describe("compareStrings(a, b)", function() {
    
    it("should return 0 if the two strings are the same", function() {
        expect(compareTwoStrings("John", "john")).toBe(0);
        expect(compareTwoStrings("Albert", "Albert")).toBe(0);
        expect(compareTwoStrings("zayne", "Zayne")).toBe(0);
        expect(compareTwoStrings("jessica", "jessica")).toBe(0);
        expect(compareTwoStrings("tyson", "Tyson")).toBe(0);
        expect(compareTwoStrings("Man", "Man")).toBe(0);
    });

    it("and should return positive number if first string should come after", function() {
        expect(compareTwoStrings("John", "Albert")).toBeGreaterThan(0);
        expect(compareTwoStrings("Bob", "allison")).toBeGreaterThan(0);
        expect(compareTwoStrings("derek", "cade")).toBeGreaterThan(0);
        expect(compareTwoStrings("Zayne", "Tyson")).toBeGreaterThan(0);
        expect(compareTwoStrings("Carter", "billy")).toBeGreaterThan(0);
        expect(compareTwoStrings("Jones", "Jessica")).toBeGreaterThan(0);
    });

    it("and should return negative number if first string should come first", function() {
        expect(compareTwoStrings("Albert", "allison")).toBeLessThan(0);
        expect(compareTwoStrings("bob", "John")).toBeLessThan(0);
        expect(compareTwoStrings("derek", "duncan")).toBeLessThan(0);
        expect(compareTwoStrings("carter", "Tyson")).toBeLessThan(0);
        expect(compareTwoStrings("megan", "molly")).toBeLessThan(0);
        expect(compareTwoStrings("jeff", "peter")).toBeLessThan(0);
    });
});

describe("compareDates(a, b)", function() {
   
    it("should return 0 if the two dates are the same", function() {
        expect(compareTwoDates(new Date("11/12/2015"), new Date("11/12/2015"))).toBe(0);
        expect(compareTwoDates(new Date("11/12/2015"), new Date("11/12/15"))).toBe(0);
        expect(compareTwoDates(new Date("11/12/15"), new Date("11/12/2015"))).toBe(0);
        expect(compareTwoDates(new Date("11/01/15"), new Date("11/01/2015"))).toBe(0);
        expect(compareTwoDates(new Date("11/01/15"), new Date("11/1/15"))).toBe(0);
        expect(compareTwoDates(new Date("5/12/15"), new Date("05/12/15"))).toBe(0);
   })
   
    it("and should return positive number if first date should come after", function() {
        expect(compareTwoDates(new Date("11/13/2015"), new Date("11/12/2015"))).toBeGreaterThan(0);
        expect(compareTwoDates(new Date("11/13/2015"), new Date("11/12/15"))).toBeGreaterThan(0);
        expect(compareTwoDates(new Date("11/13/15"), new Date("11/12/2015"))).toBeGreaterThan(0);
        expect(compareTwoDates(new Date("11/03/2015"), new Date("11/02/15"))).toBeGreaterThan(0);
        expect(compareTwoDates(new Date("11/3/2015"), new Date("11/2/2015"))).toBeGreaterThan(0);
        expect(compareTwoDates(new Date("11/03/15"), new Date("11/2/2015"))).toBeGreaterThan(0);
    });
    
    it("and should return negative number if first date should come first", function() {
        expect(compareTwoDates(new Date("11/11/2015"), new Date("11/12/2015"))).toBeLessThan(0);
        expect(compareTwoDates(new Date("11/11/2015"), new Date("11/12/15"))).toBeLessThan(0);
        expect(compareTwoDates(new Date("11/11/15"), new Date("11/12/2015"))).toBeLessThan(0);
        expect(compareTwoDates(new Date("11/01/15"), new Date("11/2/2015"))).toBeLessThan(0);
        expect(compareTwoDates(new Date("11/1/2015"), new Date("11/02/15"))).toBeLessThan(0);
        expect(compareTwoDates(new Date("11/01/15"), new Date("11/2/15"))).toBeLessThan(0);
    });
})

// Doesn't need one for the freshman, sophomore, junior, senior. I standardize it and create a new field in the student object for it
