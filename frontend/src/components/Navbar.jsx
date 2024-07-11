import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignInAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleRedirect = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      <div className="flex items-center cursor-pointer" onClick={handleRedirect}>
        <img src="/logo.png" alt="Logo" className="h-12 w-24 mr-2" />
        <button className="text-white text-xl">Risk Management App</button>
      </div>
      <div>
        {isAuthenticated ? (
          <>
            <button
              className="text-white mx-2"
              onClick={() => navigate('/profile')}
            >
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              Profile
            </button>
            <button
              className="text-white mx-2"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Logout
            </button>
          </>
        ) : (
          <button
            className="text-white"
            onClick={() => navigate('/login')}
          >
            <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
