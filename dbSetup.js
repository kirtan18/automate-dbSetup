const { execSync } = require("child_process");
const fs = require("fs");
const { DB_NAME, DB_USER, DB_HOST, DB_PORT, DB_PASSWORD, DOWNLOADS_PATH, DBEAVER_CONFIG_PATH } = require("./config");

// Shared env with password for PostgreSQL commands
const envOptions = {
    env: {
        ...process.env,
        PGPASSWORD: DB_PASSWORD
    }
};

// Function to create the database
function createDatabase() {
    try {
        console.log(`Creating database: ${DB_NAME}...`);
        const result = execSync(
            `psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}';"`,
            { ...envOptions, encoding: "utf8" }
        );

        if (result.trim() === "1") {
            throw new Error(`Database "${DB_NAME}" already exists. Aborting!`);
        }

        execSync(`psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -c "CREATE DATABASE ${DB_NAME};"`, {
            ...envOptions,
            stdio: "inherit",
        });

        console.log(`Created database: ${DB_NAME}.`);
    } catch (error) {
        console.error(error.message);
        process.exit(1); // Stop script execution
    }
}

// Function to restore the database from dump file
function restoreDatabase() {
    if (!fs.existsSync(DOWNLOADS_PATH)) {
        console.error(`Dump file not found: ${DOWNLOADS_PATH}`);
        process.exit(1);
    }
    try {
        console.log(`Restoring database from ${DOWNLOADS_PATH}...`);
        execSync(`pg_restore -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME} < ${DOWNLOADS_PATH}`, {
            ...envOptions,
            stdio: "inherit",
        });
        console.log("Database restored successfully.");
    } catch (error) {
        console.error(`⚠️ Error restoring database: ${error.message}`);
    }
}


function findDBeaverPath() {
    const possiblePaths = [
        "C:\\Program Files\\DBeaver\\dbeaver.exe",
        "C:\\Program Files (x86)\\DBeaver\\dbeaver.exe",
        `${process.env.USERPROFILE}\\AppData\\Local\\DBeaver\\dbeaver.exe`
    ];

    for (const path of possiblePaths) {
        console.log(`Checking: ${path}`);
        if (fs.existsSync(path)) {
            console.log(`✅ DBeaver found at: ${path}`);
            return path;
        }
    }
    console.log("⚠️ DBeaver not found in known locations.");
    return null;
}

// Function to restart DBeaver
function restartDBeaver() {
    try {
        console.log("Restarting DBeaver...");
        
        // Kill the DBeaver process if running
        execSync("taskkill /F /IM dbeaver.exe", { stdio: "ignore" });
        
        // Get DBeaver path automatically
        let dbeaverPath = findDBeaverPath();

        if (!dbeaverPath) {
            console.error("⚠️ Error: Could not find DBeaver path.");
            return;
        }
        
        console.log(`✅ Found DBeaver at: ${dbeaverPath}`);

        setTimeout(() => {
            execSync(`start "" "${dbeaverPath}"`, { stdio: "ignore" });
            console.log("DBeaver restarted successfully.");
        }, 2000);
        
    } catch (error) {
        console.error("⚠️ Error restarting DBeaver:", error.message);
    }
}

// Function to add the database to DBeaver
function addDatabaseToDBeaver() {

    if (!fs.existsSync(DBEAVER_CONFIG_PATH)) {
        console.log("DBeaver configuration file not found.");
        return;
    }

    let configRaw = fs.readFileSync(DBEAVER_CONFIG_PATH, "utf8");

    // ✅ Parse JSON
    let config;
    try {
        config = JSON.parse(configRaw);
    } catch (err) {
        console.error("❌ Error parsing JSON:", err);
        process.exit(1);
    }

    const key = `postgres-jdbc-${DB_NAME}`;
    config.connections = config.connections || {};
    config.connections[key] = {
        provider: "postgresql",
        driver: "postgres-jdbc",
        name: DB_NAME,
        'save-password': true,
        configuration: {
            host: DB_HOST,
            port: `${DB_PORT}`,
            database: DB_NAME,
            user: DB_USER,
            password: DB_PASSWORD,
            url: `jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}`,
            configurationType: "MANUAL",
            home: "postgresql-x64-16",
            type: "dev",
            'auth-model': "native"
        }
    };

    fs.writeFileSync(DBEAVER_CONFIG_PATH, JSON.stringify(config, null, 4));

    console.log(`Database ${DB_NAME} added to DBeaver. Restart DBeaver to see changes.`);
    restartDBeaver();
}

// Execute functions in order
createDatabase();
restoreDatabase();
addDatabaseToDBeaver();