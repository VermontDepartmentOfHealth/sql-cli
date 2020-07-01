module.exports = isEqual

//In order to sort multi property objects, we need the keys in the same order, it doesn't matter what order they
//are in, only that they are in a conistent order. This method will also sort child objects
function sortObjectKeys(object) {
    var sortedMap = new Map(),
        keys = Object.keys(object)

    // sort all keys
    keys = keys.sort((a, b) => a.localeCompare(b))


    keys.forEach(function(key) {
        // handle complex json objects (not likely to exist for SQL table)
        let exists = object[key]
        let isObj = typeof object[key] == 'object'
        let isNotArr = !(object[key] instanceof Array)
        let isActuallyObject = isObj && isNotArr // all arrays are typeof object, but we want to rule out that this is an array

        if (exists && isActuallyObject) {
            // if we got an obj, recurse back through it
            sortedMap[key] = sortObjectKeys(object[key]);

        } else {
            // everything else, just assign value immediately
            sortedMap[key] = object[key];
        }
    });

    return sortedMap;
}

//used to sort multi property objects, the result of this sort can change based on the order of keys in
//object, its purpose is to provide a sort that is the same across objects that have the same keys in the same order
function compareMultiPropObj(varA, varB) {
    //for each property in object a, if it is less than the same property in var b return -1 if more return 1
    for (var prop in varA) {
        var valFromA = varA[prop]
        var valFromB = varB[prop]
        if (valFromA > valFromB) {
            return 1;
        } else if (valFromA < valFromB) {
            return -1;
        }
    }
    //if they are all the same return 0
    return 0;
}

//most of this code is from https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/
function isEqual(value, other) {

    var itemsAreArrays = Array.isArray(value) && Array.isArray(other)

    //The order of items in an array doesn't matter in terms of matching.
    //if the array is of objects, we need to sort keys, so we can then sort the objects
    //by all keys if needed and then match each item by position in the sorted array
    if (itemsAreArrays) {
        var tableOne = value;
        var tableTwo = other;
        var tableOneWithSortedKeys = []
        tableOne.forEach(row => {
            tableOneWithSortedKeys.push(sortObjectKeys(row))
        });

        var tableTwoWithSortedKeys = []
        tableTwo.forEach(row => {
            tableTwoWithSortedKeys.push(sortObjectKeys(row))
        });

        //now sort the arrays by first key then second etc.
        tableOne.sort(compareMultiPropObj)
        tableTwo.sort(compareMultiPropObj)

        //items are now sorted by all keys and can be compared positionally
        value = tableOne;
        other = tableTwo
    }

    // Get the value type
    var type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    var compare = function(item1, item2) {

        // Get the object type
        var itemType = Object.prototype.toString.call(item1);

        // If an object or array, compare recursively
        if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
            if (!isEqual(item1, item2)) return false;
        }

        // Otherwise, do a simple comparison
        else {

            // If the two items are not the same type, return false
            if (itemType !== Object.prototype.toString.call(item2)) return false;

            // Else if it's a function, convert to a string and compare
            // Otherwise, just compare, this section is not needed for sql results but could be useful in the future
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else if (itemType === '[object Date]') {
                if (item1.getTime() !== item2.getTime()) return false;
            } else {
                if (item1 !== item2) return false;
            }

        }
    };

    // Compare properties
    if (type === '[object Array]') {
        value = value.sort();
        other = other.sort();
        // checks each row by row by position - rows have been sorted by column, columns were sorted first
        //each row should match, Get number of columns, for each array, for each column
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) {
                return false;
            }
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) {
                    return false;
                }
            }
        }
    }

    // If nothing failed, return true
    return true;

};