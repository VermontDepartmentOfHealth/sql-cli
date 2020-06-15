# SQL CLI

A set of command line utilities for MS SQL Server

## Install

```
npm install @ads-vdh/sqlutil -g
```

## Usage (Examples)


```bash
sqlutil -s \"SELECT 2 AS Age\" -t \"SELECT 2 AS Age\" -sv ServerName -db dbName
sqlutil -s \"EXEC dbo.GetClient 17\" -t \"EXEC dbo.GetClient 17 -sv ServerName -db dbName
```

## Env File (Optional)

Optionally add an env file to specify server name and database name with the following structure:

```ini
SQL_CLI_SERVER=YourServerName
SQL_CLI_DATABASE=YourDatabaseName
```


