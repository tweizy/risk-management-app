import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl text-center">
          <h1 className="text-2xl font-bold mb-6">404 - Page Not Found</h1>
          <Link to="/" className="text-blue-500 underline">Go back to Home</Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
