import { useState, useEffect } from 'react';
import DataTable from '../../shared/DataTable';
import { Plus } from 'lucide-react';

const BASE_URL = 'http://localhost:3001/api';

const PlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { 
      key: 'playerId', 
      label: 'Player ID',
      format: (value) => (
        <div className="font-mono text-sm">{value}</div>
      )
    },
    { 
      key: 'walletAddress', 
      label: 'Wallet Address',
      format: (value) => value ? (
        <div className="font-mono text-sm truncate max-w-[200px]" title={value}>
          {value}
        </div>
      ) : '-'
    },
    { 
      key: 'stats.kills', 
      label: 'Kills',
      format: (value) => (
        <div className="font-semibold text-gray-900">{value || 0}</div>
      )
    },
    { 
      key: 'stats.accuracy', 
      label: 'Accuracy',
      format: (value) => (
        <div className="font-medium">
          <span className={`${
            value > 50 ? 'text-green-600' : value > 25 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {(value || 0).toFixed(1)}%
          </span>
        </div>
      )
    },
    { 
      key: 'lastActive', 
      label: 'Last Active',
      format: (value) => value ? (
        <div className="text-sm text-gray-600">
          {new Date(value).toLocaleDateString()}
        </div>
      ) : '-'
    }
  ];

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/players`);
      if (!response.ok) throw new Error('Failed to fetch players');
      const data = await response.json();
      setPlayers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (player) => {
    console.log('Edit player:', player);
  };

  const handleDelete = async (player) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        const response = await fetch(`${BASE_URL}/players/${player.playerId}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete player');
        await fetchPlayers();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting player:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading players...</div>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Players Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage player accounts and view their statistics
          </p>
        </div>
        <button
          onClick={() => console.log('Add new player')}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Player
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <DataTable
          data={players}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default PlayersList;