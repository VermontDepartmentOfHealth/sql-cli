module.exports = isEqual
var _ = require('underscore');
 
function sortObjectKeys(object){
  var sortedObj = {},
    keys = _.keys(object);
  
    keys = _.sortBy(keys, function(key){
      return key;
    });
  
    _.each(keys, function(key) {
      if(typeof object[key] == 'object' && !(object[key] instanceof Array)){
              sortedObj[key] = sortObjectKeys(object[key]);
      } else {
          sortedObj[key] = object[key];
      }
    });
  
    return sortedObj;
  }

function compareMultiPropObj(varA,varB){
  //first compare first value
  //for each property in object a, if it is less than the same property in var b return -1 if more return 1, if they are all the same return 0
  for (var prop in varA){
    var firstVal = varA[prop]
    var firstValFromOther = varB[prop]
    if (firstVal > firstValFromOther) {
      return 1;     
    } else if (firstVal < firstValFromOther) {
      return -1;
    }
  }
  return 0;
}

//TODO: https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/
function isEqual(value, other) {

  var theyAreArrays = Array.isArray(value) && Array.isArray(other)
  var theyAreArraysOfMultiPropObjs = Object.keys(value).length > 1 && Object.keys(other).length > 1

if(theyAreArrays && theyAreArraysOfMultiPropObjs){
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
            // Otherwise, just compare
            if (itemType === '[object Function]') {
                if (item1.toString() !== item2.toString()) return false;
            } else if (itemType === '[object Date]') {
                if (item1.getTime() !== item2.getTime()) return false;
            }  else {
              if (item1 !== item2) return false;
          }

        }
    };

    // Compare properties
    if (type === '[object Array]') {
        value = value.sort();
        other = other.sort();
        // checks earh row by row by position - rows have been sorted by column, columns were sorted first
        //each row should match
        //Get number of columns
        //For each array 
        //for each column, 
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) {
              return false;
            }
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false){
                  return false;
                } 
            }
        }
    }

    // If nothing failed, return true
    return true;

};