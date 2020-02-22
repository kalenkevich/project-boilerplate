// This config file is related to working with migrations
const settings = require("./config/settings/default.ts");

module.exports = {
  type: "postgres",
  migrations: ["migrations/*.ts"],
  url: process.env.ENVIRONMENT ? process.env.DATABASE_URL : settings.databaseUrl,
  cli: {
    "migrationsDir": "migrations"
  },
  database: "nanolife"
};
