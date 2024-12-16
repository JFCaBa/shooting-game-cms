import { useState, useEffect } from 'react';
import DataTable from '../../shared/DataTable';
import { Plus } from 'lucide-react';
import PlayerForm from './components/PlayerForm';
import { api } from '../../../utils/api';  


const PlayersList = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);

  const columns = [
    { 
      key: 'playerId', 
      label: 'Player ID',
      format: (value) => (
        <div className="font-mono text-xs sm:text-sm break-all sm:break-normal">
          {value}
        </div>
      )
    },
    { 
      key: 'stats.kills', 
      label: 'Kills',
      format: (value) => (
        <div className="font-semibold text-gray-900">{value || 0}</div>
      )
    },
    { 
      key: 'stats.hits', 
      label: 'Hits',
      format: (value) => (
        <div className="font-semibold text-gray-900">{value || 0}</div>
      )
    },
    { 
      key: 'stats.droneHits', 
      label: 'Drone Hits',
      format: (value) => (
        <div className="font-semibold text-gray-900">{value || 0}</div>
      )
    },
    { 
      key: 'lastActive', 
      label: 'Last Active',
      className: 'hidden lg:table-cell',
      format: (value) => value ? (
        <div className="text-sm text-gray-600 whitespace-nowrap">
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
      const data = await api.get('/players');
      if (data) {
        setPlayers(data);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (player) => {
    setEditingPlayer(player);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingPlayer(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPlayer(null);
  };

  const handleDelete = async (player) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      try {
        await api.delete(`/players/${player.playerId}`);
        await fetchPlayers(); 
      } catch (err) {
        setError(err.message);
        console.error('Error deleting player:', err);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const method = editingPlayer ? 'PUT' : 'POST';
      const url = editingPlayer 
        ? `/api/players/${editingPlayer.playerId}`
        : `/api/players`;

      const response = await api.get(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to save player');
      
      await fetchPlayers(); // Refresh the list
      setIsFormOpen(false);
      setEditingPlayer(null);
    } catch (err) {
      setError(err.message);
      console.error('Error saving player:', err);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Players Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage player accounts and view their statistics
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Player
        </button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            data={players}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {isFormOpen && (
        <PlayerForm
          player={editingPlayer}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
};

export default PlayersList;