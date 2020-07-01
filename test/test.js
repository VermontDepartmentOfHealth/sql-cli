var assert = require('assert');
// get command line args
const sql = require('mssql/msnodesqlv8')
const isEqual = require("../utilities")

describe('isEqual', function() {


    it("doest match against primitives that aren't arrays or objects", function() {
        // arrange
        const isEqual = require("../utilities")
        let source = 1
        let target = 1
        let expected = false

        // act
        let actual = isEqual(source, target)

        // asset
        assert.equal(actual, expected);
    });


    it("returns true against identical simple objects", function() {
        // arrange
        const isEqual = require("../utilities")
        let source = { a: 1, b: "cat" }
        let target = { a: 1, b: "cat" }
        let expected = true

        // act
        let actual = isEqual(source, target)

        // asset
        assert.equal(actual, expected);
    });


    it("returns false against diff simple objects", function() {
        // arrange
        const isEqual = require("../utilities")
        let source = { a: 1, b: "cat" }
        let target = { a: 2, b: "cat" }
        let expected = false

        // act
        let actual = isEqual(source, target)

        // asset
        assert.equal(actual, expected);
    });


    it("returns true against identical array of strings", function() {
        // arrange
        const isEqual = require("../utilities")
        let source = ["a", "b", "c"]
        let target = ["a", "b", "c"]
        let expected = true

        // act
        let actual = isEqual(source, target)

        // asset
        assert.equal(actual, expected);
    });

    it("returns true against identical array of objects", function() {
        // arrange
        const isEqual = require("../utilities")
        let source = [{ a: 1 }, { a: 2 }]
        let target = [{ a: 1 }, { a: 2 }]
        let expected = true

        // act
        let actual = isEqual(source, target)

        // asset
        assert.equal(actual, expected);
    });


    it("returns true when columns are in different order", function() {
        // arrange
        const isEqual = require("../utilities")
        let source = { a: 1, b: 2 }
        let target = { b: 2, a: 1 }
        let expected = true

        // act
        let actual = isEqual(source, target)

        // asset
        assert.equal(actual, expected);
    });


    it("returns true when position in array is non deterministic", function() {
        // arrange
        const isEqual = require("../utilities")
        let source = ["a", "b", "c"]
        let target = ["a", "c", "b"]
        let expected = true

        // act
        let actual = isEqual(source, target)

        // asset
        assert.equal(actual, expected);
    });


    it("returns true when matching multi property objects", function() {
        // arrange
        const isEqual = require("../utilities")
        let source = [{ a: 1, b:2 }, { a: 2 }]
        let target = [{ a: 2 }, { a: 1, b:2  }]
        let expected = true

        // act
        let actual = isEqual(source, target)

        // asset
        assert.equal(actual, expected);
    });

    
    it("returns false when matching differing multi property objects", function() {
        // arrange
        const isEqual = require("../utilities")
        let source = [{ a: 1, b:2 }, { a: 2 }]
        let target = [{ a: 2 }, { a: 2, b:2  }]
        let expected = false

        // act
        let actual = isEqual(source, target)

        // asset
        assert.equal(actual, expected);
    });


    it("Returns true when objects match but properties are in different orders", function() {
            // arrange
        const isEqual = require("../utilities")
        let source = [{ a: 1, b:2 }, { a: 2 }]
        let target = [{ a: 2 }, { b:2, a: 1  }]
        let expected = true
    
            // act
        let actual = isEqual(source, target)
    
            // asset
        assert.equal(actual, expected);
    });

        // todo - get passing
    it("returns true when position in array is non deterministic", function() {
            // arrange
        const isEqual = require("../utilities")
        let source = [{ a: 1 }, { a: 2 }]
        let target = [{ a: 2 }, { a: 1 }]
        let expected = true
    
            // act
        let actual = isEqual(source, target)
    
            // asset
        assert.equal(actual, expected);
    });


    // todo - get failing
    it("returns false when arrays have diff lengths", function() {
        // arrange
        const isEqual = require("../utilities")
        let source = [{ a: 1 }, { a: 2 }]
        let target = [{ a: 2 }, { a: 1 }, { a: 1 }]
        let expected = false

        // act
        let actual = isEqual(source, target)

        // asset
        assert.equal(actual, expected);
    });




});