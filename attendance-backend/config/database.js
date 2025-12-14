const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = process.env.DB_PATH || './database.sqlite';
let db;

function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error connecting to SQLite database:', err);
        reject(err);
      } else {
        console.log('Connected to SQLite database');
        loadSchema().then(() => {
          loadSeedData().then(resolve).catch(reject);
        }).catch(reject);
      }
    });
  });
}

function loadSchema() {
  return new Promise((resolve, reject) => {
    const schemaPath = path.join(__dirname, '../schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8');
      const statements = schema.split(';').filter(stmt => stmt.trim());
      
      let completed = 0;
      const total = statements.length;
      
      statements.forEach((statement) => {
        if (statement.trim()) {
          db.run(statement, (err) => {
            if (err) {
              console.error('Error executing schema statement:', err);
              reject(err);
              return;
            }
            completed++;
            
            if (completed === total) {
              console.log('Database schema initialized');
              resolve();
            }
          });
        } else {
          completed++;
          if (completed === total) {
            console.log('Database schema initialized');
            resolve();
          }
        }
      });
    } else {
      resolve();
    }
  });
}

function loadSeedData() {
  return new Promise((resolve) => {
    const seedPath = path.join(__dirname, '../seed.sql');
    if (fs.existsSync(seedPath)) {
      const seedData = fs.readFileSync(seedPath, 'utf8');
      const statements = seedData.split(';').filter(stmt => stmt.trim());
      
      statements.forEach(statement => {
        if (statement.trim()) {
          db.run(statement, (err) => {
            if (err && !err.message.includes('UNIQUE constraint failed')) {
              console.error('Error executing seed statement:', err);
            }
          });
        }
      });
      console.log('Seed data loaded');
    }
    resolve();
  });
}

function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = {
  initializeDatabase,
  dbRun,
  dbGet,
  dbAll
};