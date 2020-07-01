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
            requestTimeout: 99999999,
            options: {
                trustedConnection: true
            }
        };

        // connect to db
        let cnn = await sql.connect(config)

        // query
        let resultSource = await sql.query(program.source)
        let resultTarget = await sql.query(program.target)

        // close connection
        await cnn.close()

        let recordsetsSource = resultSource.recordsets.map(r => [...r])
        let recordsetsTarget = resultTarget.recordsets.map(r => [...r])

        // recordset *can* contain multiple tables
        // tables *can* contain multiple rows
        // consolidate down - if we only have a single one
        if (recordsetsSource.length === 1) recordsetsSource = recordsetsSource[0]
        if (recordsetsTarget.length === 1) recordsetsTarget = recordsetsTarget[0]

        let isIdentical = isEqual(recordsetsSource, recordsetsTarget)

        console.log('source query: ', program.source)
        console.log('target query: ', program.target)
        console.log('source result: ', recordsetsSource)
        console.log('target result: ', recordsetsTarget)
        console.log('is identical: ', isIdentical)

        return;
    } catch (err) {
        console.log(err)
    }
}