import pool from '../config/db.js';

const createSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const isValidImageData = (value = '') =>
  /^data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,/i.test(value);

export const getBlogs = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, slug, category, tags, excerpt, content, image_data, status, created_at, updated_at
       FROM blogs
       ORDER BY id DESC`
    );

    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch blogs.', error: error.message });
  }
};

export const getPublishedBlogs = async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, title, slug, category, tags, excerpt, content, image_data, status, created_at, updated_at
       FROM blogs
       WHERE status = 'published'
       ORDER BY created_at DESC`
    );

    return res.json(rows);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Unable to fetch published blogs.', error: error.message });
  }
};

export const getPublishedBlogBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT id, title, slug, category, tags, excerpt, content, image_data, status, created_at, updated_at
       FROM blogs
       WHERE slug = ? AND status = 'published'
       LIMIT 1`,
      [slug]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    return res.json(rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to fetch blog.', error: error.message });
  }
};

export const createBlog = async (req, res) => {
  const {
    title,
    category = '',
    tags = '',
    excerpt = '',
    content = '',
    image_data = '',
    status = 'draft'
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  if (image_data && !isValidImageData(image_data)) {
    return res.status(400).json({ message: 'Please upload a valid image file.' });
  }

  try {
    const slug = createSlug(title) || `blog-${Date.now()}`;
    const [result] = await pool.query(
      `INSERT INTO blogs (title, slug, category, tags, excerpt, content, image_data, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, category || null, tags || null, excerpt, content, image_data || null, status]
    );

    return res.status(201).json({
      message: 'Blog created successfully.',
      blogId: result.insertId
    });
  } catch (error) {
    const message =
      error.code === 'ER_DUP_ENTRY' ? 'A blog with the same title already exists.' : 'Unable to create blog.';
    return res.status(500).json({ message, error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    category = '',
    tags = '',
    excerpt = '',
    content = '',
    image_data = '',
    status = 'draft'
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required.' });
  }

  if (image_data && !isValidImageData(image_data)) {
    return res.status(400).json({ message: 'Please upload a valid image file.' });
  }

  try {
    const slug = createSlug(title) || `blog-${id}`;
    await pool.query(
      `UPDATE blogs
       SET title = ?, slug = ?, category = ?, tags = ?, excerpt = ?, content = ?, image_data = ?, status = ?
       WHERE id = ?`,
      [title, slug, category || null, tags || null, excerpt, content, image_data || null, status, id]
    );

    return res.json({ message: 'Blog updated successfully.' });
  } catch (error) {
    const message =
      error.code === 'ER_DUP_ENTRY' ? 'A blog with the same title already exists.' : 'Unable to update blog.';
    return res.status(500).json({ message, error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM blogs WHERE id = ?', [id]);
    return res.json({ message: 'Blog deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to delete blog.', error: error.message });
  }
};
