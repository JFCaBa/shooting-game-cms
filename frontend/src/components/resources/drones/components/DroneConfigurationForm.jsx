import React, { useState, useEffect } from 'react';
import { api } from '../../../../utils/api';
import { Settings } from 'lucide-react';

const DroneConfigForm = () => {
  const [config, setConfig] = useState({
    xMin: -5,
    xMax: 5,
    yMin: 1.5,
    yMax: 3,
    zMin: -8,
    zMax: -3
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await api.get('/drone-config');
      setConfig(data);
      setError(null);
    } catch (err) {
      setError('Failed to load configuration');
      console.error('Error loading drone config:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await api.put('/drone-config', config);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update configuration');
      console.error('Error updating drone config:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading configuration...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-2xl mx-auto">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6" />
          <h2 className="text-xl font-semibold text-gray-900">Drone Position Configuration</h2>
        </div>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4">
              Configuration updated successfully!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">X-Axis Range</h3>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Minimum X
                </label>
                <input
                  type="number"
                  name="xMin"
                  value={config.xMin}
                  onChange={handleChange}
                  step="0.1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Maximum X
                </label>
                <input
                  type="number"
                  name="xMax"
                  value={config.xMax}
                  onChange={handleChange}
                  step="0.1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Y-Axis Range</h3>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Minimum Y
                </label>
                <input
                  type="number"
                  name="yMin"
                  value={config.yMin}
                  onChange={handleChange}
                  step="0.1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">
                  Maximum Y
                </label>
                <input
                  type="number"
                  name="yMax"
                  value={config.yMax}
                  onChange={handleChange}
                  step="0.1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <h3 className="font-medium text-gray-700">Z-Axis Range</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Minimum Z
                  </label>
                  <input
                    type="number"
                    name="zMin"
                    value={config.zMin}
                    onChange={handleChange}
                    step="0.1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">
                    Maximum Z
                  </label>
                  <input
                    type="number"
                    name="zMax"
                    value={config.zMax}
                    onChange={handleChange}
                    step="0.1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DroneConfigForm;