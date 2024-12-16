import React, { useState, useEffect } from 'react';
import DataTable from '../../shared/DataTable';
import { Plus } from 'lucide-react';
import { api } from '../../../utils/api';
import DroneConfigForm from './components/DroneConfigurationForm';

const DronesList = () => {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfig, setShowConfig] = useState(false);

  const columns = [
    { key: 'droneId', label: 'Drone ID' },
    { key: 'playerId', label: 'Player ID' },
  ];

  useEffect(() => {
    fetchDrones();
  }, []);

  const fetchDrones = async () => {
    try {
      const data = await api.get('/drones');
      setDrones(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching drones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (drone) => {
    console.log('Edit drone:', drone);
  };

  const handleDelete = async (drone) => {
    if (window.confirm('Are you sure you want to delete this drone?')) {
      try {
        await api.delete(`/drones/${drone.droneId}`);
        await fetchDrones();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting drone:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading drones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Drones Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage drones, their positions, and spawning configuration
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showConfig ? 'Hide Configuration' : 'Show Configuration'}
          </button>
          <button
            onClick={() => console.log('Add new drone')}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Drone
          </button>
        </div>
      </div>

      {showConfig && (
        <div className="mb-8">
          <DroneConfigForm />
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Active Drones</h3>
          <p className="mt-1 text-sm text-gray-500">
            List of all active drones and their current positions
          </p>
        </div>
        <div className="overflow-x-auto">
          <DataTable
            data={drones}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default DronesList;