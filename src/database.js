const sqlite3 = require('sqlite3')
const { open } = require('sqlite')
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'database.db');

async function openDb () {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  })
}

module.exports = { openDb };