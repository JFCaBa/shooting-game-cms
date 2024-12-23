import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { api } from '../../../utils/api';
import { v4 as uuidv4 } from 'uuid';

const GeoObjectForm = ({ geoObject = null, onSubmit, onClose }) => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [locationError, setLocationError] = useState('');
  const [formData, setFormData] = useState({
    id: uuidv4(),
    type: 'weapon',
    coordinate: {
      latitude: 0,
      longitude: 0,
      altitude: 0
    },
    metadata: {
      reward: 0,
      spawnedAt: new Date().toISOString()
    }
  });

  useEffect(() => {
    if (geoObject) {
      setFormData(geoObject);
    }
    fetchPlayers();
  }, [geoObject]);

  const fetchPlayers = async () => {
    try {
      const response = await api.get('/players');
      if (response?.data) {
        setPlayers(response.data);
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            coordinate: {
              ...prev.coordinate,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              altitude: 0 // Set default altitude to 0
            }
          }));
          setLocationError('');
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError(
            error.code === 1 ? 'Please allow location access to auto-fill coordinates.' :
            error.code === 2 ? 'Unable to determine location.' :
            'Location request timed out.'
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'playerId') {
      setSelectedPlayer(value);
      if (value) {
        const selectedPlayer = players.find(player => player.playerId === value);
        if (selectedPlayer?.location) {
          setFormData(prev => ({
            ...prev,
            coordinate: {
              latitude: selectedPlayer.location.latitude || 0,
              longitude: selectedPlayer.location.longitude || 0,
              altitude: 0 // Set default altitude to 0
            }
          }));
        }
      }
    } else if (name.startsWith('coordinate.')) {
      const coordinateKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        coordinate: {
          ...prev.coordinate,
          [coordinateKey]: parseFloat(value) || 0
        }
      }));
    } else if (name.startsWith('metadata.')) {
      const metadataKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataKey]: metadataKey === 'reward' ? (parseFloat(value) || 0) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdGeoObject = await onSubmit(formData);

      if (selectedPlayer && createdGeoObject) {
        await api.post('/geo-objects/assign', {
          geoObjectId: createdGeoObject.id,
          playerId: selectedPlayer
        });
      }

      onClose();
    } catch (error) {
      console.error('Error submitting geo object:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {geoObject ? 'Edit Geo Object' : 'Add Geo Object'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {locationError && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-1">
                  <p className="text-sm text-yellow-700">{locationError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="weapon">Weapon</option>
                <option value="target">Target</option>
                <option value="powerup">Powerup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Assign to Player
              </label>
              <select
                name="playerId"
                value={selectedPlayer}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select a player</option>
                {players.map(player => (
                  <option key={player.playerId} value={player.playerId}>
                    {player.playerId}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Coordinates */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Coordinates</h3>
              {!geoObject && (
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Use Current Location
                </button>
              )}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="coordinate.latitude"
                  value={formData.coordinate.latitude}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="coordinate.longitude"
                  value={formData.coordinate.longitude}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Altitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="coordinate.altitude"
                  value={formData.coordinate.altitude}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Metadata</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reward
                </label>
                <input
                  type="number"
                  step="any"
                  name="metadata.reward"
                  value={formData.metadata.reward}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Spawned At
                </label>
                <input
                  type="datetime-local"
                  name="metadata.spawnedAt"
                  value={formData.metadata.spawnedAt.slice(0, 16)}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {geoObject ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GeoObjectForm;