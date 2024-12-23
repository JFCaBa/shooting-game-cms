import { useState, useEffect, useCallback } from 'react';
import DataTable from '../../shared/DataTable';
import { Plus, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { api } from '../../../utils/api';
import GeoObjectForm from './GeoObjectForm';
import { buildQueryString } from '../../../utils/queryUtils';

const GeoObjectsList = () => {
  const [geoObjects, setGeoObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGeoObject, setEditingGeoObject] = useState(null);    
  const [autoRefresh, setAutoRefresh] = useState(true); 

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'type', 
      label: 'Type',
      format: (value) => value.charAt(0).toUpperCase() + value.slice(1)
    },
    { 
      key: 'coordinate.latitude', 
      label: 'Latitude',
      format: (value) => value?.toFixed(6) || 'N/A'
    },
    { 
      key: 'coordinate.longitude', 
      label: 'Longitude',
      format: (value) => value?.toFixed(6) || 'N/A'
    },
    { 
      key: 'coordinate.altitude', 
      label: 'Altitude',
      format: (value) => value?.toFixed(2) || 'N/A'
    },
    { 
      key: 'metadata.reward', 
      label: 'Reward',
      format: (value) => value || 'N/A'
    },
    {
      key: 'metadata.spawnedAt',
      label: 'Spawned At',
      format: (value) => value ? new Date(value).toLocaleString() : 'N/A'
    }
  ];

  useEffect(() => {
    fetchGeoObjects(pagination.page);
  }, [pagination.page]);
  
  const handlePageChange = (newPage) => {
    fetchGeoObjects(newPage);
  };

  

  const fetchGeoObjects = useCallback(async (page, filters = {}) => {
    try {
      setLoading(true);
      const queryString = buildQueryString(page, filters);
      const response = await api.get(`/geo-objects?${queryString}`);
      
      if (response && response.data) {
        setGeoObjects(response.data);
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
      console.error('Error fetching geo objects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGeoObjects(pagination.page);
  }, [pagination.page, fetchGeoObjects]);

  // Auto refresh setup
  useEffect(() => {
    let intervalId;

    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchGeoObjects(pagination.page);
      }, 60000); // Refresh every minute
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, pagination.page, fetchGeoObjects]);

  const handleAdd = () => {
    setEditingGeoObject(null);
    setIsFormOpen(true);
  };
  
  const handleEdit = (geoObject) => {
    setEditingGeoObject(geoObject);
    setIsFormOpen(true);
  };
  
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingGeoObject(null);
  };
  
  const handleFormSubmit = async (formData) => {
    try {
      if (editingGeoObject) {
        await api.put(`/geo-objects/${formData.id}`, formData);
      } else {
        await api.post('/geo-objects', formData);
      }
      await fetchGeoObjects();
      setIsFormOpen(false);
      setEditingGeoObject(null);
    } catch (err) {
      setError(err.message);
      console.error('Error saving geo object:', err);
    }
  };

  const handleDelete = async (geoObject) => {
    if (window.confirm('Are you sure you want to delete this geo object?')) {
      try {
        await api.delete(`/geo-objects/${geoObject.id}`);
        await fetchGeoObjects();
      } catch (err) {
        setError(err.message);
        console.error('Error deleting geo object:', err);
      }
    }
  };

  const refreshControl = (
    <div className="flex items-center gap-2 ml-4">
      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={autoRefresh}
          onChange={(e) => setAutoRefresh(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        Auto-refresh
      </label>
      <button
        onClick={() => fetchGeoObjects(pagination.page)}
        className="p-2 text-gray-600 hover:text-gray-900"
        title="Manual refresh"
      >
        <RefreshCw size={16} />
      </button>
    </div>
  );

  const calculateStats = () => {
    return {
      total: pagination.total,
      byType: geoObjects.reduce((acc, obj) => {
        acc[obj.type] = (acc[obj.type] || 0) + 1;
        return acc;
      }, {}),
      activeObjects: geoObjects.filter(obj => 
        new Date(obj.createdAt).getTime() + 3600000 > Date.now()
      ).length
    };
  };

  if (loading && pagination.page === 1) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading geo objects...</div>
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

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Geo Objects</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage game world objects and their locations
            </p>
          </div>
          {refreshControl} {/* Add the refresh controls here */}
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          Add Object
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Objects</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Active Objects</div>
          <div className="text-2xl font-bold">{stats.activeObjects}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Weapons</div>
          <div className="text-2xl font-bold">{stats.byType.weapon || 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Targets</div>
          <div className="text-2xl font-bold">{stats.byType.target || 0}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          data={geoObjects}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {((pagination.page - 1) * pagination.limit) + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.total}</span>{' '}
                results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
      {isFormOpen && (
            <GeoObjectForm
                geoObject={editingGeoObject}
                onSubmit={handleFormSubmit}
                onClose={handleFormClose}
            />
        )}
    </div>
  );
};

export default GeoObjectsList;