import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useDashboardRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const checkAdmin = async () => {
        try {
          const response = await axios.get('http://localhost:4000/api/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.data.Role.name === 'Admin') {
            navigate('/admin-dashboard');
          }
        } catch (error) {
          console.error('Error checking admin role:', error);
          localStorage.removeItem('token');
          navigate('/login');
        }
      };
      checkAdmin();
    } else {
      navigate('/login');
    }
  }, [navigate]);
};

export default useDashboardRedirect;
