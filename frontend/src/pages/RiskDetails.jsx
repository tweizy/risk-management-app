import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import useAuthProtection from '../hooks/useAuthProtection';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const RiskDetails = () => {
  useAuthProtection();
  const { id } = useParams();
  const [risk, setRisk] = useState(null);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [actionDescription, setActionDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pending');
  const [users, setUsers] = useState([]);
  const [mitigationError, setMitigationError] = useState('');
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationDate, setEvaluationDate] = useState(new Date().toISOString().split('T')[0]);
  const [probability, setProbability] = useState(1);
  const [impact, setImpact] = useState(1);
  const [score, setScore] = useState(probability * impact);
  const [comments, setComments] = useState('');
  const [evaluationError, setEvaluationError] = useState('');
  const [evaluationSuccess, setEvaluationSuccess] = useState('');

  useEffect(() => {
    const fetchRiskDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/risks/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data) {
          setRisk(response.data);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setNotFound(true);
        } else {
          setError('Error fetching risk details.');
          console.error('Error fetching risk details:', error);
        }
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/users', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchRiskDetails();
    fetchUsers();
  }, [id]);

  const handleAddMitigation = async () => {
    try {
      await axios.post('http://localhost:4000/api/mitigationActions', {
        risk_id: id,
        action_description: actionDescription,
        assigned_to: assignedTo,
        due_date: dueDate,
        status,
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setShowModal(false);
      // Fetch the updated risk details after adding the mitigation action
      const response = await axios.get(`http://localhost:4000/api/risks/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setRisk(response.data);
    } catch (error) {
      setMitigationError('Error adding mitigation action');
      console.error('Error adding mitigation action:', error);
    }
  };

  useEffect(() => {
    setScore(probability * impact);
  }, [probability, impact]);

  const handleAddEvaluation = async () => {
    try {
      await axios.post('http://localhost:4000/api/risk-evaluations', {
        risk_id: id,
        evaluation_date: evaluationDate,
        probability,
        impact,
        score,
        comments
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      setEvaluationSuccess('Risk evaluation added successfully');
      setTimeout(() => {
        setShowEvaluationModal(false);
        setEvaluationSuccess('');
      }, 1000);
    } catch (error) {
      setEvaluationError('Error adding risk evaluation');
      console.error('Error adding risk evaluation:', error);
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

  const generateReport = () => {
    if (!risk) return;

    const doc = new jsPDF();

    doc.text('Risk Report', 20, 10);
    doc.autoTable({
      head: [['Field', 'Value']],
      body: [
        ['Description', risk.description],
        ['Probability', risk.probability],
        ['Impact', risk.impact],
        ['Score', risk.score],
        ['Risk Response', risk.risk_response],
        ['Response Strategy', risk.response_strategy],
        ['Expected Result', risk.expected_result],
        ['Status', risk.status],
        ['Note', risk.note],
        ['Category', risk.RiskCategory ? risk.RiskCategory.name : 'N/A'],
        ['Triggering Event', risk.Event ? risk.Event.description : 'N/A'],
        ['Triggering Event Date', risk.Event ? new Date(risk.Event.event_date).toLocaleString() : 'N/A'],
        ['User', risk.User ? `${risk.User.first_name} ${risk.User.last_name} (${risk.User.email})` : 'N/A'],
        ['Project', risk.Project ? risk.Project.description : 'N/A'],
        ['Created At', new Date(risk.createdAt).toLocaleString()],
        ['Updated At', new Date(risk.updatedAt).toLocaleString()],
      ]
    });

    doc.addPage();

    // Mitigations section
    doc.text('Mitigation Actions', 20, 10);
    if (risk.MitigationActions.length > 0) {
      const mitigations = risk.MitigationActions.map(action => [
        action.action_description,
        action.assigned_to ? `${action.User.first_name} ${action.User.last_name} (${action.User.email})` : 'N/A',
        action.due_date ? new Date(action.due_date).toLocaleDateString() : 'N/A',
        action.status,
        action.completed_at ? new Date(action.completed_at).toLocaleString() : 'N/A',
        new Date(action.created_at).toLocaleString()
      ]);
      doc.autoTable({
        head: [['Description', 'Assigned To', 'Due Date', 'Status', 'Completed At', 'Created At']],
        body: mitigations
      });
    } else {
      doc.text('No mitigation actions available.', 20, 20);
    }

    doc.addPage();

    // Risk Evaluations section
    doc.text('Risk Evaluations', 20, 10);
    if (risk.RiskEvaluations.length > 0) {
      const evaluations = risk.RiskEvaluations.map(evaluation => [
        evaluation.probability,
        evaluation.impact,
        evaluation.score,
        evaluation.user_id ? `${evaluation.User.first_name} ${evaluation.User.last_name} (${evaluation.User.email})` : 'N/A',
        evaluation.comments,
        new Date(evaluation.created_at).toLocaleString()
      ]);
      doc.autoTable({
        head: [['Probability', 'Impact', 'Score', 'User', 'Comments', 'Evaluation Date']],
        body: evaluations
      });
    } else {
      doc.text('No risk evaluations available.', 20, 20);
    }

    doc.save(`Risk_Report_${id}.pdf`);
  };

  if (notFound) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl text-center">
            <h1 className="text-2xl font-bold mb-6">Risk does not exist</h1>
            <Link to="/" className="text-blue-500 underline">Go back to Home</Link>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p>{error}</p>
        </div>
      </>
    );
  }

  if (!risk) {
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
      <div className="min-h-screen flex flex-col bg-gray-100 p-4">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Risk Details</h1>
          <button
            className="mr-10 mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            onClick={generateReport}
          >
            Generate Report
          </button>
          <button
            className="mr-10 mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
            onClick={() => setShowModal(true)}
          >
            Add Mitigation Action
          </button>
          <button
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            onClick={() => setShowEvaluationModal(true)}
          >
            Add Risk Evaluation
          </button>
          <div className="w-full bg-gray-50 p-4 rounded shadow-sm mb-4">
            <h2 className="text-xl font-semibold mb-4">Risk Information</h2>
            <div className="grid grid-cols-1 gap-4 bg-white divide-y divide-gray-200">
              <div className="grid grid-cols-3 gap-4 p-4">
                <div className="text-sm font-medium text-gray-900">
                  <strong>Description:</strong> {risk.description}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  <strong>Category:</strong> {risk.RiskCategory.name}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  <strong>Status:</strong> {risk.status}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4">
                <div className="text-sm font-medium text-gray-900">
                  <strong>Probability:</strong> {risk.probability}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  <strong>Impact:</strong> {risk.impact}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  <strong>Score:</strong> {risk.score}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4">
                <div className="text-sm font-medium text-gray-900">
                  <strong>Risk Response:</strong> 
                  <span className={getRiskResponseClass(risk.risk_response)}>{risk.risk_response}</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  <strong>Response Strategy:</strong> {risk.response_strategy}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  <strong>Expected Result:</strong> {risk.expected_result}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4">
                <div className="text-sm font-medium text-gray-900">
                  <strong>User:</strong> {risk.User.first_name} {risk.User.last_name}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  <strong>User Entity:</strong> {risk.User.Entity.description} ({risk.User.Entity.type})
                </div>
                <div className="text-sm font-medium text-gray-900">
                  <strong>Project:</strong> {risk.Project.description}
                </div>
              </div>
              <div className="grid grid-cols-1 p-4">
                <div className="text-sm font-medium text-gray-900">
                  <strong>Note:</strong> {risk.note}
                </div>
              </div>
              <div className="grid grid-cols-1 p-4">
                <div className="text-sm font-medium text-gray-900">
                  <strong>Attachments:</strong>
                  <ul>
                    {risk.Attachments.map((attachment) => (
                      <li key={attachment.id}>{attachment.file_path}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>


          <div className="bg-gray-50 p-4 rounded shadow-sm mb-4">
            <h2 className="text-xl font-semibold mb-4">Mitigation Actions</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed At</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {risk.MitigationActions.map((action, index) => (
                    <tr key={action.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{action.action_description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {action.User ? `${action.User.first_name} ${action.User.last_name}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(action.due_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{action.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{action.completed_at ? new Date(action.completed_at).toLocaleString() : 'Not completed'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Risk Evaluations</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evaluation Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {risk.RiskEvaluations.map((evaluation, index) => (
                    <tr key={evaluation.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{new Date(evaluation.evaluation_date).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{evaluation.probability}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{evaluation.impact}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{evaluation.score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{evaluation.comments}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {evaluation.User ? `${evaluation.User.first_name} ${evaluation.User.last_name}` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Mitigation Action</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddMitigation();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700">Description:</label>
                <input
                  type="text"
                  value={actionDescription}
                  onChange={(e) => setActionDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Assign To:</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a user</option>
                  {users.filter(user => user.Role.name !== 'Admin').map((user) => (
                    <option key={user.id} value={user.id}>{user.first_name} {user.last_name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Due Date:</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Status:</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                </select>
              </div>
              {mitigationError && <p className="text-red-500 mb-4">{mitigationError}</p>}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

{showEvaluationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Risk Evaluation</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddEvaluation();
              }}
            >
              <div className="mb-4">
                <label className="block text-gray-700">Evaluation Date:</label>
                <input
                  type="date"
                  value={evaluationDate}
                  onChange={(e) => setEvaluationDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Probability:</label>
                <select
                  value={probability}
                  onChange={(e) => setProbability(parseInt(e.target.value))}
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
                  onChange={(e) => setImpact(parseInt(e.target.value))}
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
                  value={score}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Comments:</label>
                <input
                  type="text"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {evaluationError && <p className="text-red-500 mb-4">{evaluationError}</p>}
              {evaluationSuccess && <p className="text-green-500 mb-4">{evaluationSuccess}</p>}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-300"
                  onClick={() => setShowEvaluationModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                >
                  Add Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RiskDetails;
