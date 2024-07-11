import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [risks, setRisks] = useState([]);
  const [filteredRisks, setFilteredRisks] = useState([]);
  const [riskCategories, setRiskCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [deleteRisk, setDeleteRisk] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStartDate, setProjectStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [projectEndDate, setProjectEndDate] = useState('');
  const [projectStatus, setProjectStatus] = useState('Not Started');
  const [projectError, setProjectError] = useState('');
  const [projectSuccess, setProjectSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRisks = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/risks', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const risks = response.data;

        const detailedRisks = await Promise.all(
          risks.map(async (risk) => {
            const detailedRiskResponse = await axios.get(`http://localhost:4000/api/risks/${risk.id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            return detailedRiskResponse.data;
          })
        );

        setRisks(detailedRisks);
        setFilteredRisks(detailedRisks);
      } catch (error) {
        setError('Error fetching risks');
        console.error('Error fetching risks:', error);
      }
    };

    const fetchRiskCategories = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/riskCategories', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setRiskCategories(response.data);
      } catch (error) {
        setError('Error fetching risk categories');
        console.error('Error fetching risk categories:', error);
      }
    };

    fetchRisks();
    fetchRiskCategories();
  }, []);

  useEffect(() => {
    let results = risks.filter(risk =>
      risk.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedCategory) {
      results = results.filter(risk => risk.RiskCategory && risk.RiskCategory.name === selectedCategory);
    }
    setFilteredRisks(results);
  }, [searchTerm, selectedCategory, risks]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/risks/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRisks(risks.filter(risk => risk.id !== id));
      setFilteredRisks(filteredRisks.filter(risk => risk.id !== id));
      setDeleteRisk(null);
    } catch (error) {
      setError('Error deleting risk');
      console.error('Error deleting risk:', error);
    }
  };

  const handleView = (id) => {
    navigate(`/riskdetails/${id}`);
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/projects', {
        description: projectDescription,
        start_date: projectStartDate,
        end_date: projectEndDate,
        status: projectStatus,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setProjectSuccess('Project added successfully');
      setTimeout(() => {
        setShowProjectModal(false);
        setProjectDescription('');
        setProjectStartDate(new Date().toISOString().split('T')[0]);
        setProjectEndDate('');
        setProjectStatus('Not Started');
      }, 2000); // Close modal after 2 seconds
    } catch (error) {
      setProjectError('Error adding project');
      console.error('Error adding project:', error);
    }
  };

  const getRiskResponseClass = (response) => {
    switch (response) {
      case 'Decrease':
        return 'bg-red-500 text-white px-2 py-1 rounded';
      case 'Transfer':
        return 'bg-yellow-500 text-white px-2 py-1 rounded';
      case 'Accept':
        return 'bg-green-500 text-white px-2 py-1 rounded';
      default:
        return '';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-4xl mb-6">
          <h1 className="text-2xl font-bold mb-4">Risks Dashboard</h1>
          <button
            className="mr-10 mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            onClick={() => navigate('/addrisk')}
          >
            Add Risk
          </button>
          <button
            className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            onClick={() => setShowProjectModal(true)}
          >
            Add Project
          </button>
          <div className="flex mb-4 space-x-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search risks by description..."
              className="w-4/5 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-1/5 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {riskCategories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Response</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRisks.map((risk, index) => (
                <tr key={risk.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{risk.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{risk.RiskCategory ? risk.RiskCategory.name : 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{risk.score}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <span className={getRiskResponseClass(risk.risk_response)}>{risk.risk_response}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {risk.User ? `${risk.User.first_name} ${risk.User.last_name}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-2" onClick={() => handleView(risk.id)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="text-green-600 hover:text-green-900 mr-2">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => setDeleteRisk(risk)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {deleteRisk && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
              <p>Are you sure you want to delete risk {deleteRisk.description}? This action is irreversible.</p>
              <div className="flex justify-end mt-4">
                <button
                  className="mr-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
                  onClick={() => setDeleteRisk(null)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                  onClick={() => handleDelete(deleteRisk.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {showProjectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Project</h2>
              <form onSubmit={handleProjectSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Description:</label>
                  <input
                    type="text"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Start Date:</label>
                  <input
                    type="date"
                    value={projectStartDate}
                    onChange={(e) => setProjectStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">End Date:</label>
                  <input
                    type="date"
                    value={projectEndDate}
                    onChange={(e) => setProjectEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Status:</label>
                  <select
                    value={projectStatus}
                    onChange={(e) => setProjectStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                {projectError && <p className="text-red-500 mb-4">{projectError}</p>}
                {projectSuccess && <p className="text-green-500 mb-4">{projectSuccess}</p>}
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="mr-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
                    onClick={() => setShowProjectModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                  >
                    Add Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
