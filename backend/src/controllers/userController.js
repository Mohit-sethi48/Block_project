import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

export const getUsers = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY id DESC'
    );
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch users.', error: error.message });
  }
};

export const createUser = async (req, res) => {
  const { name, email, password, role = 'admin' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    return res.status(201).json({
      message: 'User created successfully.',
      userId: result.insertId
    });
  } catch (error) {
    const message =
      error.code === 'ER_DUP_ENTRY' ? 'Email already exists.' : 'Unable to create user.';
    return res.status(500).json({ message, error: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ message: 'Name, email and role are required.' });
  }

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
        [name, email, hashedPassword, role, id]
      );
    } else {
      await pool.query('UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?', [
        name,
        email,
        role,
        id
      ]);
    }

    return res.json({ message: 'User updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update user.', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete user.', error: error.message });
  }
};
