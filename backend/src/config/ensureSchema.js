import pool from './db.js';

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS lists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    user_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lists_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  )`,
  `CREATE TABLE IF NOT EXISTS blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    category VARCHAR(120) NULL,
    tags TEXT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    image_data LONGTEXT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`
];

const adminSeedStatement = `INSERT INTO users (name, email, password, role)
  VALUES (?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    password = VALUES(password),
    role = VALUES(role)`;

const adminSeedValues = [
  'Admin User',
  'admin@example.com',
  '$2a$10$CoGOfMYPdGwlqR6fYTDZRuxaMTJXGy5NafhN9l2Ac3zmuq9nsqrNG',
  'admin'
];

const optionalBlogColumns = [
  'ALTER TABLE blogs ADD COLUMN category VARCHAR(120) NULL AFTER slug',
  'ALTER TABLE blogs ADD COLUMN tags TEXT NULL AFTER category'
];

const ensureSchema = async () => {
  for (const statement of schemaStatements) {
    await pool.query(statement);
  }

  for (const statement of optionalBlogColumns) {
    try {
      await pool.query(statement);
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') {
        throw error;
      }
    }
  }

  await pool.query(adminSeedStatement, adminSeedValues);
};

export default ensureSchema;
