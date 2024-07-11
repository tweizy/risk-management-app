import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useAuthProtection from '../hooks/useAuthProtection';

const AddRisk = () => {
  useAuthProtection();
  const [description, setDescription] = useState('');
  const [probability, setProbability] = useState(1);
  const [impact, setImpact] = useState(1);
  const [riskResponse, setRiskResponse] = useState('Decrease');
  const [responseStrategy, setResponseStrategy] = useState('');
  const [expectedResult, setExpectedResult] = useState('');
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [projectId, setProjectId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectsAndCategories = async () => {
      try {
        const projectResponse = await axios.get('http://localhost:4000/api/projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProjects(projectResponse.data);

        const categoryResponse = await axios.get('http://localhost:4000/api/riskCategories', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setCategories(categoryResponse.data);
      } catch (error) {
        setError('Error fetching projects or categories');
        console.error('Error fetching projects or categories:', error);
      }
    };

    fetchProjectsAndCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/risks', {
        description,
        probability,
        impact,
        risk_response: riskResponse,
        response_strategy: responseStrategy,
        expected_result: expectedResult,
        status,
        note,
        project_id: projectId,
        category_id: newCategory ? null : categoryId,
        new_category: newCategory || null,
        event_description: eventDescription,
        event_date: eventDate
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccess('Risk added successfully');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000); // Redirect to dashboard after 2 seconds
    } catch (error) {
      setError('Error adding risk');
      console.error('Error adding risk:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Add Risk</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Probability:</label>
              <select
                value={probability}
                onChange={(e) => setProbability(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Impact:</label>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Score:</label>
              <input
                type="text"
                value={probability * impact}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Risk Response:</label>
              <select
                value={riskResponse}
                onChange={(e) => setRiskResponse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Decrease">Decrease</option>
                <option value="Transfer">Transfer</option>
                <option value="Accept">Accept</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Response Strategy:</label>
              <input
                type="text"
                value={responseStrategy}
                onChange={(e) => setResponseStrategy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Expected Result:</label>
              <input
                type="text"
                value={expectedResult}
                onChange={(e) => setExpectedResult(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Status:</label>
              <input
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Note:</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Project:</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.description}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Category:</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={!newCategory}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              <label className="block text-gray-700 mt-2">Or create a new category:</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New category name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Triggering Event Description:</label>
              <input
                type="text"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Triggering Event Date:</label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
            >
              Add Risk
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddRisk;
