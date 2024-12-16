import { useState, useEffect } from 'react';
import DataTable from '../../shared/DataTable';
import { Plus } from 'lucide-react';
import { api } from '../../../utils/api';  

const AchievementsList = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { key: 'playerId', label: 'Player ID' },
    { 
      key: 'type', 
      label: 'Type',
      format: (value) => value?.charAt(0).toUpperCase() + value?.slice(1) || 'N/A'
    },
    { 
      key: 'milestone', 
      label: 'Milestone',
      format: (value) => value?.toLocaleString() || '0'
    },
    { 
      key: 'unlockedAt', 
      label: 'Unlocked At',
      format: (value) => value ? new Date(value).toLocaleString() : 'N/A'
    },
    { 
      key: 'nftTokenId', 
      label: 'NFT Token ID',
      format: (value) => value || 'Not Minted'
    }
  ];

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const data = await api.get(`/achievements`);
      setAchievements(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (achievement) => {
    console.log('Edit achievement:', achievement);
    // TODO: Implement edit functionality
  };

  const handleDelete = async (achievement) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await api.delete(`/achievements/${achievement._id}`);
        await fetchAchievements(); // Refresh the list
      } catch (err) {
        setError(err.message);
        console.error('Error deleting achievement:', err);
      }
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      kills: 'bg-red-100 text-red-800',
      hits: 'bg-blue-100 text-blue-800',
      survivalTime: 'bg-green-100 text-green-800',
      accuracy: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const renderTypeCell = (type) => (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
      {type?.charAt(0).toUpperCase() + type?.slice(1)}
    </span>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading achievements...</div>
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Achievements Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage player achievements and NFT rewards
          </p>
        </div>
        <button
          onClick={() => console.log('Add new achievement')}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Add Achievement
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Achievements</div>
          <div className="text-2xl font-bold">{achievements.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">NFTs Minted</div>
          <div className="text-2xl font-bold">
            {achievements.filter(a => a.nftTokenId).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Players with Achievements</div>
          <div className="text-2xl font-bold">
            {new Set(achievements.map(a => a.playerId)).size}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Latest Achievement</div>
          <div className="text-2xl font-bold">
            {achievements.length > 0 
              ? new Date(Math.max(...achievements.map(a => new Date(a.unlockedAt)))).toLocaleDateString()
              : 'N/A'
            }
          </div>
        </div>
      </div>
      
      <DataTable
        data={achievements}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AchievementsList;