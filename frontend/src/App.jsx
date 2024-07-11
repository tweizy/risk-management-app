import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import RiskDetails from './pages/RiskDetails';
import AdminDashboard from './pages/AdminDashboard';
import AddRisk from './pages/AddRisk';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/riskdetails/:id" element={<RiskDetails />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/add-user" element={<div className="min-h-screen flex items-center justify-center bg-gray-100"><h1 className="text-2xl font-bold">Add User Page</h1></div>} />
        <Route path="/addrisk" element={<AddRisk />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
