import { useEffect, useState } from 'react';
import api from '../services/api';

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'admin'
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadUsers = async () => {
    const response = await api.get('/users');
    setUsers(response.data);
  };

  useEffect(() => {
    loadUsers();
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
        await api.put(`/users/${editingId}`, formData);
        setMessage('User updated successfully.');
      } else {
        await api.post('/users', formData);
        setMessage('User created successfully.');
      }

      setFormData(initialForm);
      setEditingId(null);
      loadUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to save user.');
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role
    });
  };

  const handleDelete = async (id) => {
    await api.delete(`/users/${id}`);
    setMessage('User deleted successfully.');
    if (editingId === id) {
      setEditingId(null);
      setFormData(initialForm);
    }
    loadUsers();
  };

  return (
    <section className="page-grid">
      <div className="panel">
        <div className="section-heading">
          <div>
            <p className="brand-kicker">Users</p>
            <h2>{editingId ? 'Edit User' : 'Create User'}</h2>
          </div>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            <span>Name</span>
            <input name="name" value={formData.name} onChange={handleChange} />
          </label>
          <label>
            <span>Email</span>
            <input name="email" type="email" value={formData.email} onChange={handleChange} />
          </label>
          <label>
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={editingId ? 'Leave blank to keep current password' : 'Enter password'}
            />
          </label>
          <label>
            <span>Role</span>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </label>
          {message ? <p className="success-text">{message}</p> : null}
          <button type="submit">{editingId ? 'Update User' : 'Create User'}</button>
        </form>
      </div>

      <div className="panel">
        <div className="section-heading">
          <div>
            <p className="brand-kicker">Directory</p>
            <h2>User List</h2>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="actions">
                    <button className="secondary-button" onClick={() => handleEdit(user)}>
                      Edit
                    </button>
                    <button className="danger-button" onClick={() => handleDelete(user.id)}>
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

export default UsersPage;
