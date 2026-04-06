import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = {
  title: '',
  description: '',
  status: 'active',
  user_id: ''
};

const ListsPage = () => {
  const [lists, setLists] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadData = async () => {
    const [listsResponse, usersResponse] = await Promise.all([api.get('/lists'), api.get('/users')]);
    setLists(listsResponse.data);
    setUsers(usersResponse.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      if (editingId) {
        await api.put(`/lists/${editingId}`, formData);
        setMessage('List updated successfully.');
      } else {
        await api.post('/lists', formData);
        setMessage('List created successfully.');
      }

      setFormData(initialForm);
      setEditingId(null);
      loadData();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save list.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description || '',
      status: item.status,
      user_id: item.user_id || ''
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/lists/${id}`);
    setMessage('List deleted successfully.');
    if (editingId === id) {
      setEditingId(null);
      setFormData(initialForm);
    }
    loadData();
  };

  return (
    <section className="page-grid">
      <div className="panel">
        <div className="section-heading">
          <div>
            <p className="brand-kicker">Lists</p>
            <h2>{editingId ? 'Edit List Item' : 'Create List Item'}</h2>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>Title</span>
            <input name="title" value={formData.title} onChange={handleChange} />
          </label>
          <label>
            <span>Description</span>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </label>
          <label>
            <span>Status</span>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label>
            <span>Assign User</span>
            <select name="user_id" value={formData.user_id} onChange={handleChange}>
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
          {message ? <p className="success-text">{message}</p> : null}
          <button type="submit">{editingId ? 'Update List' : 'Create List'}</button>
        </form>
      </div>

      <div className="panel">
        <div className="section-heading">
          <div>
            <p className="brand-kicker">Records</p>
            <h2>List Data</h2>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>User</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lists.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.status}</td>
                  <td>{item.user_name || '-'}</td>
                  <td className="actions">
                    <button className="secondary-button" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button className="danger-button" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ListsPage;
