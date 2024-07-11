import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAdminProtection = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.Role.name !== 'Admin') {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking admin role:', error);
        navigate('/login');
      }
    };

    checkAdmin();
  }, [navigate]);
};

export default useAdminProtection;
