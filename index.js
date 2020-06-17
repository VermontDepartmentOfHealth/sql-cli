#!/usr/bin/env node

// get command line args
const sql = require('mssql/msnodesqlv8')

// load env file
require("dotenv").config()

const { program } = require('commander');
program
///.command('compare-output', 'compare outputs of two sql statements')
    .option('-sv, --server <value>', 'server name')
    .option('-db, --database <value>', 'database name')
    .option('-s, --source <value>', 'plain text sql statement')
    .option('-t, --target <value>', 'plain text sql statement')
    .parse(process.argv);


main()

async function main() {
    try {

        let serverName = program.server ? program.server : process.env.SQL_CLI_SERVER;
        let databaseName = program.database ? program.database : process.env.SQL_CLI_DATABASE;

        if (!serverName) {
            console.log("Server Name not found, either pass `--server` argument or set SQL_CLI_SERVER environment variable ")
            return;
        }
        if (!databaseName) {
            console.log("Database Name not found, either pass `--database` argument or set SQL_CLI_DATABASE environment variable ")
            return;
        }


        // config for your database
        let config = {
            driver: "msnodesqlv8",
            server: serverName,
            database: databaseName,
            options: {
                trustedConnection: true
            }
        };

        // connect to db
        await sql.connect(config)

        // query
        let resultSource = await sql.query(program.source)
        let resultTarget = await sql.query(program.target)

        let recordsetsSource = resultSource.recordsets.map(r => [...r])
        let recordsetsTarget = resultTarget.recordsets.map(r => [...r])

        let isIdentical = isNaiveIdentical(recordsetsSource, recordsetsTarget)

        let isNewIdentical = isTableIdentical(recordsetsSource, recordsetsTarget)

        console.log('source query: ', program.source)
        console.log('target query: ', program.target)
        console.log('source result: ', recordsetsSource)
        console.log('target result: ', recordsetsTarget)
        console.log('is identical: ', isIdentical)




    } catch (err) {
        console.log(err)
    }
}
//let isIdentical = 
//"Are tables identical?"" can be simpler than "Are objects identical?"
function isTableIdentical(resultOne,resultTwo){
    //Stored procedures could return multiple tables, method will assume we only get one for now
    tableOne = resultOne[0]
    tableTwo = resultTwo[0]

    //This might not be right, the table itselft might be the first item on this array, i'll have to access a storeed
    //procedure that returns more than one row to find out
    let tableOneContainsRows = Array.isArray(tableOne) && tableOne.length >= 1
    let tableTwoContainsRows = Array.isArray(tableTwo) && tableTwo.length >= 1

    //If both tables are empty we will say they are identical
    if(!tableOneContainsRows && !tableTwoContainsRows){
        return true;
    }

    //If one table contains rows and the others does not, they are not identical
    if(tableOneContainsRows !== tableTwoContainsRows){
        return false;
    } 

    //check if both tables contain items
    //tables have same number of colums, and same column headers, (Im assuming that order of columns should matter, but maybe thats a bad assumption)
    //let numberOfColumsIntableOne = Object.keys(tableOne[0]).length

    //let numberOfColumsIntableTwo = Object.keys(tableTwo[0]).length
    let columnsAreIdentical = columnsAreIdenitical(tableOne,tableTwo);

    // let tableOneColumns = Object.keys(tableOne[0])
    // let tableTwoColumns = Object.keys(tableTwo[0])

    // if(tableOneColumns.length === tableTwoColumns.length){
    //     return tableOneColumns.every(function(prop){
    //         return tableTwoColumns.indexOf(prop) >= 0;
    //     });
    // }
    //tables have same number of rows
    //collection of rows are identical
    //go row by row, look for collection of rows that have the same value in first column
    //from this collection find the collection of rows that have the same value in the next colummn
    //repeat this process (use recursion that looks for final column? you could also just iterate over columns
    //
    
    
    
    //for speed, look for a primary key column, I think if we can say that there is a row that has unique values for 
    //each row than we can use it as a primary key, at least for this operation. 

    return true;
}

function columnsAreIdenitical(tableOne, tableTwo){
    let tableOneColumns = Object.keys(tableOne[0])
    let tableTwoColumns = Object.keys(tableTwo[0])

    if(tableOneColumns.length === tableTwoColumns.length){
        return tableOneColumns.every(function(prop){
            return tableTwoColumns.indexOf(prop) >= 0;
        });
    }
    return false;
}


function isNaiveIdentical(value, other) {
    return JSON.stringify(value, 0, 0) === JSON.stringify(other, 0, 0)
}

//TODO: https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/
function isEqual(value, other) {

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
            } else {
                if (item1 !== item2) return false;
            }

        }
    };

    // Compare properties
    if (type === '[object Array]') {
        for (var i = 0; i < valueLen; i++) {
            if (compare(value[i], other[i]) === false) return false;
        }
    } else {
        for (var key in value) {
            if (value.hasOwnProperty(key)) {
                if (compare(value[key], other[key]) === false) return false;
            }
        }
    }

    // If nothing failed, return true
    return true;

};