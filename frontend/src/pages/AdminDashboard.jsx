import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import useAdminProtection from '../hooks/useAdminProtection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faEye } from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  useAdminProtection(); // Restrict access for non-admin users
  const [users, setUsers] = useState([]);
  const [entities, setEntities] = useState([]);
  const [error, setError] = useState('');
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [newUser, setNewUser] = useState(null);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('password');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newRole, setNewRole] = useState('User');
  const [newEntity, setNewEntity] = useState('');
  const [deleteUser, setDeleteUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState('');

  useEffect(() => {
    let results = users.filter(user =>
      user.first_name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    if (selectedEntity) {
      results = results.filter(user => user.Entity && user.Entity.description === selectedEntity);
    }
    setFilteredUsers(results);
  }, [searchTerm, selectedEntity, users]);

  useEffect(() => {
    const results = users.filter(user =>
      user.first_name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        setError('Error fetching users');
        console.error('Error fetching users:', error);
      }
    };

    const fetchEntities = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/entities', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEntities(response.data);
      } catch (error) {
        setError('Error fetching entities');
        console.error('Error fetching entities:', error);
      }
    };

    fetchUsers();
    fetchEntities();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(users.filter(user => user.id !== id));
      setDeleteUser(null);
    } catch (error) {
      setError('Error deleting user');
      console.error('Error deleting user:', error);
    }
  };

  const handleUpdate = (user) => {
    setEditUser(user);
    setEditEmail(user.email);
    setEditPassword(''); 
    setEditFirstName(user.first_name);
    setEditLastName(user.last_name);
  };

  const handleView = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setViewUser(response.data);
    } catch (error) {
      setError('Error fetching user details');
      console.error('Error fetching user details:', error);
    }
  };

  const handleAddUser = () => {
    setNewUser(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4000/api/users/${editUser.id}`, {
        email: editEmail,
        password: editPassword,
        first_name: editFirstName,
        last_name: editLastName
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setUsers(users.map(user => user.id === editUser.id ? { ...user, email: editEmail, first_name: editFirstName, last_name: editLastName } : user));
      setEditUser(null);
    } catch (error) {
      setError('Error updating user');
      console.error('Error updating user:', error);
    }
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    const selectedEntity = entities.find(entity => entity.description === newEntity);
    const role_id = newRole === 'Admin' ? 1 : 2; // Assuming role_id 1 for Admin and 2 for User
    try {
      await axios.post('http://localhost:4000/api/users', {
        email: newEmail,
        password: newPassword,
        first_name: newFirstName,
        last_name: newLastName,
        entity_id: selectedEntity.id,
        role_id: role_id
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setNewUser(null);
      // Refresh user list
      const response = await axios.get('http://localhost:4000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      setError('Error creating user');
      console.error('Error creating user:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl mb-6">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <button
            className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            onClick={handleAddUser}
          >
            Add User
          </button>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex mb-4 space-x-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name..."
              className="w-4/5 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
            />
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-1/5 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Entities</option>
              {entities.map((entity) => (
                <option key={entity.id} value={entity.description}>{entity.description}</option>
              ))}
            </select>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user, index) => (
                <tr key={user.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {`${user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1).toLowerCase()} ${user.last_name.charAt(0).toUpperCase() + user.last_name.slice(1).toLowerCase()}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.Entity ? user.Entity.description : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.Role ? user.Role.name : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-2" onClick={() => handleView(user.id)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-2" onClick={() => handleUpdate(user)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => setDeleteUser(user)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {viewUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">User Details</h2>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>First Name:</strong> {viewUser.first_name}</p>
              <p><strong>Last Name:</strong> {viewUser.last_name}</p>
              <p><strong>Entity:</strong> {viewUser.Entity.description}</p>
              <p><strong>Role:</strong> {viewUser.Role.name}</p>
              <p><strong>Created At:</strong> {new Date(viewUser.createdAt).toLocaleString()}</p>
              <p><strong>Updated At:</strong> {new Date(viewUser.updatedAt).toLocaleString()}</p>
              <button
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                onClick={() => setViewUser(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {editUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Email:</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">First Name:</label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Last Name:</label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Password:</label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
                    onClick={() => setEditUser(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {newUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New User</h2>
              <form onSubmit={handleNewUserSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Email:</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">First Name:</label>
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Last Name:</label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Password:</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Role:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Entity:</label>
                  <select
                    value={newEntity}
                    onChange={(e) => setNewEntity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select an entity</option>
                    {entities.map((entity) => (
                      <option key={entity.id} value={entity.description}>{entity.description}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
                    onClick={() => setNewUser(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {deleteUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete user {deleteUser.email}? This action is irreversible.</p>
              <div className="flex justify-end mt-4">
                <button
                  className="mr-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
                  onClick={() => setDeleteUser(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                  onClick={() => handleDelete(deleteUser.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
