import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import useAuthProtection from '../hooks/useAuthProtection';

const Profile = () => {
  useAuthProtection();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const userData = response.data;
        setUser(userData);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
      } catch (error) {
        setError('Unable to fetch user profile');
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:4000/api/profile', { password, first_name: firstName, last_name: lastName }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccess('Profile updated successfully');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000); 
    } catch (error) {
      setError('Unable to update profile');
      console.error('Error updating profile:', error);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Profile</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                value={user.email}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Entity:</label>
              <input
                type="text"
                value={user.Entity ? user.Entity.description : 'N/A'}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                readOnly
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Role:</label>
              <input
                type="text"
                value={user.Role ? user.Role.name : 'N/A'}
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                readOnly
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
