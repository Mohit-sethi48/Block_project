import { useEffect, useState } from 'react';
import api from '../services/api';

const categoryOptions = ['Technology', 'Design', 'Development', 'Marketing', 'Business'];
const tagOptions = ['react', 'node', 'mysql', 'ui', 'ux', 'api', 'startup', 'growth'];

const initialForm = {
  title: '',
  category: '',
  tags: '',
  excerpt: '',
  content: '',
  status: 'draft',
  image_data: ''
};

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadBlogs = async () => {
    const response = await api.get('/blogs');
    setBlogs(response.data);
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag) => {
    const nextTags = selectedTags.includes(tag)
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag];

    setFormData((prev) => ({ ...prev, tags: nextTags.join(', ') }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setFormData((prev) => ({ ...prev, image_data: '' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image_data: reader.result || '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      if (editingId) {
        await api.put(`/blogs/${editingId}`, formData);
        setMessage('Blog updated successfully.');
      } else {
        await api.post('/blogs', formData);
        setMessage('Blog created successfully.');
      }

      setFormData(initialForm);
      setEditingId(null);
      loadBlogs();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save blog.');
    }
  };

  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setFormData({
      title: blog.title,
      category: blog.category || '',
      tags: blog.tags || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      status: blog.status,
      image_data: blog.image_data || ''
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/blogs/${id}`);
    setMessage('Blog deleted successfully.');
    if (editingId === id) {
      setEditingId(null);
      setFormData(initialForm);
    }
    loadBlogs();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData(initialForm);
    setMessage('');
  };

  const selectedTags = formData.tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <section className="page-grid blogs-grid">
      <div className="panel">
        <div className="section-heading">
          <div>
            <p className="brand-kicker">Blogs</p>
            <h2>{editingId ? 'Edit Blog' : 'Create Blog'}</h2>
          </div>
          {editingId ? (
            <button className="secondary-button" type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          ) : null}
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>Blog Title</span>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter blog title"
            />
          </label>
          <label>
            <span>Category</span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Tags</span>
            <div className="tag-selector" role="group" aria-label="Select blog tags">
              {tagOptions.map((option) => {
                const isActive = selectedTags.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    className={isActive ? 'tag-selector-chip is-active' : 'tag-selector-chip'}
                    onClick={() => handleTagToggle(option)}
                  >
                    #{option}
                  </button>
                );
              })}
            </div>
          </label>
          {selectedTags.length ? (
            <div className="blog-card-taxonomy">
              {selectedTags.map((tag) => (
                <span className="blog-tag-pill" key={tag}>
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
          <label>
            <span>Selected Tags</span>
            <input name="tags" value={formData.tags} readOnly placeholder="Selected tags will appear here" />
          </label>
          <label>
            <span>Short Description</span>
            <textarea
              name="excerpt"
              rows="3"
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Small summary for blog card"
            />
          </label>
          <label>
            <span>Content</span>
            <textarea
              name="content"
              rows="8"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write full blog content here"
            />
          </label>
          <label>
            <span>Status</span>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label>
            <span>Blog Image</span>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          {formData.image_data ? (
            <div className="image-preview-wrap">
              <img className="image-preview" src={formData.image_data} alt="Blog preview" />
            </div>
          ) : null}
          {message ? <p className="success-text">{message}</p> : null}
          <button type="submit">{editingId ? 'Update Blog' : 'Create Blog'}</button>
        </form>
      </div>

      <div className="panel">
        <div className="section-heading">
          <div>
            <p className="brand-kicker">Content Library</p>
            <h2>Blog List</h2>
          </div>
        </div>

        <div className="blog-list">
          {blogs.map((blog) => (
            <article className="blog-card" key={blog.id}>
              {blog.image_data ? (
                <img className="blog-card-image" src={blog.image_data} alt={blog.title} />
              ) : (
                <div className="blog-card-image blog-card-placeholder">No Image</div>
              )}
              <div className="blog-card-body">
                <div className="blog-card-header">
                  <div>
                    <h3>{blog.title}</h3>
                    <p className="muted-text">{blog.status}</p>
                  </div>
                  <div className="actions">
                    <button className="secondary-button" onClick={() => handleEdit(blog)}>
                      Edit
                    </button>
                    <button className="danger-button" onClick={() => handleDelete(blog.id)}>
                      Delete
                    </button>
                  </div>
                </div>
                {blog.category || blog.tags ? (
                  <div className="blog-card-taxonomy">
                    {blog.category ? <span className="blog-category-pill">{blog.category}</span> : null}
                    {blog.tags
                      ? blog.tags.split(',').map((tag) => {
                          const trimmedTag = tag.trim();

                          if (!trimmedTag) {
                            return null;
                          }

                          return (
                            <span className="blog-tag-pill" key={`${blog.id}-${trimmedTag}`}>
                              #{trimmedTag}
                            </span>
                          );
                        })
                      : null}
                  </div>
                ) : null}
                <p>{blog.excerpt || 'No short description added.'}</p>
              </div>
            </article>
          ))}
          {!blogs.length ? <p className="muted-text">Abhi tak koi blog create nahi hua.</p> : null}
        </div>
      </div>
    </section>
  );
};

export default BlogsPage;
