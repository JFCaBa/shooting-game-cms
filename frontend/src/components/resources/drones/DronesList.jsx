import { useState, useEffect } from 'react';
import DataTable from '../../shared/DataTable';
import { Plus } from 'lucide-react';

const BASE_URL = 'http://localhost:3001/api';

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
      const response = await fetch(`${BASE_URL}/drones`);
      if (!response.ok) throw new Error('Failed to fetch drones');
      const data = await response.json();
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
        const response = await fetch(`${BASE_URL}/drones/${drone.droneId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete drone');
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Drones Management</h1>
        <button
          onClick={() => console.log('Add new drone')}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Add Drone
        </button>
      </div>
      
      <DataTable
        data={drones}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DronesList;