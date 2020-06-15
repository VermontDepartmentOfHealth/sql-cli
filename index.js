// get command line args
const sql = require('mssql/msnodesqlv8')

// load env file
require("dotenv").config()

const { program } = require('commander');
program
///.command('compare-output', 'compare outputs of two sql statements')
    .requiredOption('-sv, --server <value>', 'server name')
    .requiredOption('-db, --database <value>', 'database name')
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

        console.log('source query: ', program.source)
        console.log('target query: ', program.target)
        console.log('source result: ', recordsetsSource)
        console.log('target result: ', recordsetsTarget)
        console.log('is identical: ', isIdentical)




    } catch (err) {
        console.log(err)
    }
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