import { useState, useEffect } from 'react';
import DataTable from '../../shared/DataTable';
import { Plus } from 'lucide-react';
import { api } from '../../../utils/api';  

const BASE_URL = 'http://localhost:3001/api';

const RewardsList = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { key: 'playerId', label: 'Player ID' },
    { 
      key: 'rewardType', 
      label: 'Type',
      format: (value) => {
        const types = {
          HIT: 'Hit Reward',
          KILL: 'Kill Reward',
          AD_WATCH: 'Ad Watch',
          DAILY_LOGIN: 'Daily Login',
          ACHIEVEMENT: 'Achievement'
        };
        return types[value] || value;
      }
    },
    { 
      key: 'amount', 
      label: 'Amount',
      format: (value) => value?.toLocaleString() || '0'
    },
    { 
      key: 'timestamp', 
      label: 'Timestamp',
      format: (value) => value ? new Date(value).toLocaleString() : 'N/A'
    }
  ];

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const data = await api.get(`/rewards`);
      setRewards(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching rewards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (reward) => {
    console.log('Edit reward:', reward);
  };

  const handleDelete = async (reward) => {
    if (window.confirm('Are you sure you want to delete this reward record?')) {
      try {
        await api.delete(`/rewards/${reward._id}`);
        await fetchRewards();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting reward:', err);
      }
    }
  };

  const calculateStats = () => {
    if (!rewards.length) return { total: 0, byType: {}, average: 0 };
    
    const byType = rewards.reduce((acc, reward) => {
      acc[reward.rewardType] = (acc[reward.rewardType] || 0) + reward.amount;
      return acc;
    }, {});

    const total = rewards.reduce((sum, reward) => sum + reward.amount, 0);

    return {
      total,
      byType,
      average: total / rewards.length
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading rewards...</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Rewards History</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track and manage player reward distributions
          </p>
        </div>
        <button
          onClick={() => console.log('Add new reward')}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Add Reward
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Rewards Given</div>
          <div className="text-2xl font-bold">{rewards.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Amount</div>
          <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Average Reward</div>
          <div className="text-2xl font-bold">{stats.average.toFixed(2)}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Unique Players</div>
          <div className="text-2xl font-bold">
            {new Set(rewards.map(r => r.playerId)).size}
          </div>
        </div>
      </div>
      
      <DataTable
        data={rewards}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default RewardsList;