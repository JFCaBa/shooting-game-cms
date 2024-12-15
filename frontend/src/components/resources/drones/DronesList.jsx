import { useState, useEffect } from 'react';
import DataTable from '../../shared/DataTable';
import { Plus } from 'lucide-react';
import { api } from '../../../utils/api';

const DronesList = () => {
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { key: 'droneId', label: 'Drone ID' },
    { key: 'playerId', label: 'Player ID' },
    {
      key: 'position.x',
      label: 'Position X',
      format: (value) => value?.toFixed(2) || '0.00'
    },
    {
      key: 'position.y',
      label: 'Position Y',
      format: (value) => value?.toFixed(2) || '0.00'
    },
    {
      key: 'position.z',
      label: 'Position Z',
      format: (value) => value?.toFixed(2) || '0.00'
    },
    {
      key: 'createdAt',
      label: 'Created At',
      format: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
    }
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
    // TODO: Implement edit functionality
  };

  const handleDelete = async (drone) => {
    if (window.confirm('Are you sure you want to delete this drone?')) {
      try {
        await api.delete(`/drones/${drone.droneId}`);
        await fetchDrones(); // Refresh the list
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
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Drones Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage drones and their positions
          </p>
        </div>
        <button
          onClick={() => console.log('Add new drone')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Drone
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
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