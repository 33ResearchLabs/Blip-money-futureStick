const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sr-33labs-secret-key-2026';
const JWT_EXPIRY = '7d';
const dataDir = path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'auth.db'));
db.pragma('journal_mode = WAL');

db.exec(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'viewer',
  created_at INTEGER DEFAULT (unixepoch()),
  last_login INTEGER
)`);

// Seed default admin
const existing = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@33labs.io');
if (!existing) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)')
    .run('admin@33labs.io', hash, 'Admin', 'admin');
}

function register(email, password, name, role = 'viewer') {
  const hash = bcrypt.hashSync(password, 10);
  try {
    const info = db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)')
      .run(email, hash, name, role);
    return { ok: true, user: { id: info.lastInsertRowid, email, name, role } };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function login(email, password) {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return { ok: false, error: 'Invalid credentials' };
  db.prepare('UPDATE users SET last_login = unixepoch() WHERE id = ?').run(user.id);
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  return { ok: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function getUsers() {
  return db.prepare('SELECT id, email, name, role, created_at, last_login FROM users').all();
}

function deleteUser(id) {
  return db.prepare('DELETE FROM users WHERE id = ?').run(id);
}

function updateRole(id, role) {
  return db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
}

module.exports = { register, login, verifyToken, getUsers, deleteUser, updateRole };
