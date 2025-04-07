require("dotenv").config();
const os = require("os");
const path = require("path");

module.exports = {
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DUMP_FILE: process.env.DUMP_FILE,
    DOWNLOADS_PATH: process.env.DUMP_FILE,
    DBEAVER_CONFIG_PATH: path.join(
        process.env.APPDATA,
        "DBeaverData",
        "workspace6",
        "General",
        ".dbeaver",
        "data-sources.json"
    )
};
