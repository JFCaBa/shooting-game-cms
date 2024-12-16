import { useState, useEffect } from 'react';
import DataTable from '../../shared/DataTable';
import { Plus } from 'lucide-react';
import { api } from '../../../utils/api';  

const TokenBalancesList = () => {
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const columns = [
    { key: 'playerId', label: 'Player ID' },
    { 
      key: 'pendingBalance', 
      label: 'Pending Balance',
      format: (value) => value?.toLocaleString() || '0'
    },
    { 
      key: 'mintedBalance', 
      label: 'Minted Balance',
      format: (value) => value?.toLocaleString() || '0'
    }
  ];

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const data = await api.get(`/token-balances`)
      setBalances(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching token balances:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (balance) => {
    console.log('Edit balance:', balance);
  };

  const handleDelete = async (balance) => {
    if (window.confirm('Are you sure you want to delete this token balance record?')) {
      try {
        await api.delete(`/token-balances/${balance.playerId}`);
        await fetchBalances();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting token balance:', err);
      }
    }
  };

  const calculateStats = () => {
    return balances.reduce((stats, balance) => ({
      totalPending: stats.totalPending + (balance.pendingBalance || 0),
      totalMinted: stats.totalMinted + (balance.mintedBalance || 0),
      activeAccounts: stats.activeAccounts + (balance.pendingBalance > 0 || balance.mintedBalance > 0 ? 1 : 0),
      avgBalance: (stats.totalPending + stats.totalMinted) / (balances.length || 1)
    }), {
      totalPending: 0,
      totalMinted: 0,
      activeAccounts: 0,
      avgBalance: 0
    });
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading token balances...</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Token Balances</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage player token balances and minting status
          </p>
        </div>
        <button
          onClick={() => console.log('Add new balance')}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Add Balance
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Pending</div>
          <div className="text-2xl font-bold text-orange-600">
            {stats.totalPending.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Minted</div>
          <div className="text-2xl font-bold text-green-600">
            {stats.totalMinted.toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Active Accounts</div>
          <div className="text-2xl font-bold text-blue-600">
            {stats.activeAccounts}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Average Balance</div>
          <div className="text-2xl font-bold text-purple-600">
            {stats.avgBalance.toFixed(2)}
          </div>
        </div>
      </div>
      
      <DataTable
        data={balances}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TokenBalancesList;