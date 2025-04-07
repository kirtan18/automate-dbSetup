# Create Automate postgres database

Make sure you have installed all of the following prerequisites on your machine:
- Node(v23.11.0) - [Download & Install Node.js](https://nodejs.org/en/download)
- PostgreSQL - [Download & Install PostgreSQL](https://www.postgresql.org/download/)
- pgAdmin - [Download & Install pgAdmin](https://www.pgadmin.org/download/)
- DBeaver - [Download & Install DBeaver](https://dbeaver.io/download/)

## Environment Variables
To run this project, you will need to add the environment variables which is listed in .env.example file to your .env file.
### Example
- DB_NAME=CLONE_DATABASE
- DB_USER=postgres
- DB_HOST=localhost
- DB_PORT=3333
- DB_PASSWORD=88888
- DUMP_FILE=(Downloaded Dump file path)

## Run Script Locally
Clone the project
```sh
$ git clone https://github.com/kirtan18/automate-dbSetup.git

OR

Download Zip Folder
```
Go to the project directory
```sh
$ cd automate-dbSetup-main
```
Install dependencies
```sh
$ npm install
```
Run the script
```sh
$ node ./dbSetup.js
```
