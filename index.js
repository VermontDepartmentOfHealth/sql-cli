#!/usr/bin/env node

// get command line args
const sql = require('mssql/msnodesqlv8')
const isEqual = require("./utilities")


// load env file
require("dotenv").config()

const { program } = require('commander');
program
///.command('compare-output', 'compare outputs of two sql statements')
    .option('-sv, --server <value>', 'server name')
    .option('-db, --database <value>', 'database name')
    .requiredOption('-s, --source <value>', 'plain text sql statement')
    .requiredOption('-t, --target <value>', 'plain text sql statement')
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

        let isNewIdentical = isTableIdentical(recordsetsSource, recordsetsTarget)


        let isNaiveIdentical = isNaiveIdentical(recordsetsSource, recordsetsTarget)

        // recordset *can* contain multiple tables
        // tables *can* contain multiple rows
        // consolidate down - if we only have a single one
        if (recordsetsSource.length = 1) recordsetsSource = recordsetsSource[0]
        if (recordsetsTarget.length = 1) recordsetsTarget = recordsetsTarget[0]

        if (recordsetsSource.length = 1) recordsetsSource = recordsetsSource[0]
        if (recordsetsTarget.length = 1) recordsetsTarget = recordsetsTarget[0]

        let isJsEqualIdentical = isEqual(recordsetsSource, recordsetsTarget)






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
function isTableIdentical(resultOne, resultTwo) {
    //Stored procedures could return multiple tables, method will assume we only get one for now
    let tableOne = resultOne[0]
    let tableTwo = resultTwo[0]

    //This might not be right, the table itself might be the first item on this array, i'll have to access a stored
    //procedure that returns more than one row to find out
    let tableOneContainsRows = Array.isArray(tableOne) && tableOne.length >= 1
    let tableTwoContainsRows = Array.isArray(tableTwo) && tableTwo.length >= 1

    //If both tables are empty we will say they are identical
    if (!tableOneContainsRows && !tableTwoContainsRows) {
        return true;
    }

    //If one table contains rows and the others does not, they are not identical
    if (tableOneContainsRows !== tableTwoContainsRows) {
        return false;
    }

    //check if both tables contain items
    //tables have same number of colums, and same column headers, (Im assuming that order of columns should matter, but maybe thats a bad assumption)
    //let numberOfColumsIntableOne = Object.keys(tableOne[0]).length

    //let numberOfColumsIntableTwo = Object.keys(tableTwo[0]).length
    let columnsAreIdentical = columnsAreIdentical(tableOne, tableTwo);


    // chekc if tables have same number of rows
    // collection of rows are identical
    // go row by row, look for collection of rows that have the same value in first column
    // from this collection find the collection of rows that have the same value in the next colummn
    // repeat this process (use recursion that looks for final column? you could also just iterate over columns




    //for speed, look for a primary key column, I think if we can say that there is a row that has unique values for 
    //each row than we can use it as a primary key, at least for this operation. 

    return true;
}

function columnsAreIdentical(tableOne, tableTwo) {
    let tableOneColumns = Object.keys(tableOne[0])
    let tableTwoColumns = Object.keys(tableTwo[0])

    // return false if counts of columns is diff
    if (tableOneColumns.length !== tableTwoColumns.length) { return false; }

    // check if every column in tbl 1 exists in tbl 2
    let allColumnsInTblOneExistInTbl2 = tableOneColumns.every(function(prop) {
        return tableTwoColumns.indexOf(prop) >= 0;
    });

    return allColumnsInTblOneExistInTbl2;
}


function isNaiveIdentical(value, other) {
    return JSON.stringify(value, 0, 0) === JSON.stringify(other, 0, 0)
}