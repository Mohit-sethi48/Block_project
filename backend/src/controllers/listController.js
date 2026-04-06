import pool from '../config/db.js';

export const getLists = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT lists.id, lists.title, lists.description, lists.status, lists.user_id, lists.created_at,
              users.name AS user_name
       FROM lists
       LEFT JOIN users ON users.id = lists.user_id
       ORDER BY lists.id DESC`
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch lists.', error: error.message });
  }
};

export const createList = async (req, res) => {
  const { title, description = '', status = 'active', user_id } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO lists (title, description, status, user_id) VALUES (?, ?, ?, ?)',
      [title, description, status, user_id || null]
    );

    return res.status(201).json({
      message: 'List created successfully.',
      listId: result.insertId
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to create list.', error: error.message });
  }
};

export const updateList = async (req, res) => {
  const { id } = req.params;
  const { title, description = '', status = 'active', user_id } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required.' });
  }

  try {
    await pool.query(
      'UPDATE lists SET title = ?, description = ?, status = ?, user_id = ? WHERE id = ?',
      [title, description, status, user_id || null, id]
    );

    return res.json({ message: 'List updated successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update list.', error: error.message });
  }
};

export const deleteList = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM lists WHERE id = ?', [id]);
    return res.json({ message: 'List deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete list.', error: error.message });
  }
};
