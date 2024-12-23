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
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  const columns = [
    { 
      key: 'playerId', 
      label: 'Player ID',
      filterable: true,
      filterType: 'text',
      format: (value) => (
        <div className="font-mono text-xs sm:text-sm break-all sm:break-normal">
          {value}
        </div>
      )
    },
    { 
      key: 'stats.kills', 
      label: 'Kills',
      filterable: true,
      filterType: 'number',
      format: (value) => (
        <div className="font-semibold text-gray-900">{value || 0}</div>
      )
    },
    { 
      key: 'stats.hits', 
      label: 'Hits',
      filterable: true,
      filterType: 'number',
      format: (value) => (
        <div className="font-semibold text-gray-900">{value || 0}</div>
      )
    },
    { 
      key: 'stats.droneHits', 
      label: 'Drone Hits',
      filterable: true,
      filterType: 'number',
      format: (value) => (
        <div className="font-semibold text-gray-900">{value || 0}</div>
      )
    },
    { 
      key: 'lastActive', 
      label: 'Last Active',
      filterable: true,
      filterType: 'date',
      className: 'hidden lg:table-cell',
      format: (value) => value ? (
        <div className="text-sm text-gray-600 whitespace-nowrap">
          {new Date(value).toLocaleDateString()}
        </div>
      ) : '-'
    }
  ];

  useEffect(() => {
    fetchPlayers(1);
  }, []);

  const buildQueryString = (page, filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add pagination params
    queryParams.append('page', page);
    queryParams.append('limit', pagination.limit);
    
    // Add filter params
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        // Handle nested keys (e.g., stats.kills)
        const paramName = key.includes('.') ? `${key.split('.')[0]}[${key.split('.')[1]}]` : key;
        queryParams.append(paramName, value);
      }
    });
    
    return queryParams.toString();
  };

  const fetchPlayers = async (page, filters = {}) => {
    try {
      setLoading(true);
      const queryString = buildQueryString(page, filters);
      const response = await api.get(`/players?${queryString}`);
      
      if (response && response.data) {
        setPlayers(response.data);
        setPagination(prev => ({
          ...prev,
          page: response.pagination.page,
          totalPages: response.pagination.totalPages,
          total: response.pagination.total
        }));
        setError(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchPlayers(newPage);
  };

  const handleFilter = (filters) => {
    fetchPlayers(1, filters); // Reset to first page when filtering
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
        await fetchPlayers(pagination.page); 
      } catch (err) {
        await cleanupEmptyIds();
        setError(err.message);
        console.error('Error deleting player:', err);
      }
    }
  };

  const cleanupEmptyIds = async () => {
    try {
        const response = await api.delete('/players/cleanup/empty-ids');
        console.log(`Cleaned up ${response.deletedCount} players with empty IDs`);
    } catch (error) {
        console.error('Error cleaning up empty player IDs:', error);
    }
};

  const handleFormSubmit = async (formData) => {
    try {
      const method = editingPlayer ? 'put' : 'post';
      const url = editingPlayer 
        ? `/players/${editingPlayer.playerId}`
        : `/players`;

      await api[method](url, formData);
      
      await fetchPlayers(pagination.page);
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
        <DataTable
          data={players}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          pagination={pagination}
          onPageChange={handlePageChange}
          onFilter={handleFilter}
        />
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