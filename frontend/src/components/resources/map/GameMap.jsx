import React, { useState, useEffect } from 'react';
import { api } from '../../../utils/api';
import { Map as MapIcon, Crosshair } from 'lucide-react';

const GameMap = () => {
  const [players, setPlayers] = useState([]);
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersData, dronesData] = await Promise.all([
          api.get('/players'),
          api.get('/drones')
        ]);
        setPlayers(playersData);
        setDrones(dronesData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching map data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading map data...</div>
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Game Map</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time view of players and drones
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">Players ({players.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">Drones ({drones.length})</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="relative w-full" style={{ paddingBottom: '75%' }}>
          <div className="absolute inset-0 bg-gray-100 rounded-lg">
            {/* Map grid lines */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-6">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="border border-gray-200"></div>
              ))}
            </div>

            {/* Players */}
            {players.map((player) => (
              <div
                key={player.playerId}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              >
                <div className="relative group">
                  <MapIcon className="w-6 h-6 text-blue-500" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {player.playerId}
                  </div>
                </div>
              </div>
            ))}

            {/* Drones */}
            {drones.map((drone) => (
              <div
                key={drone.droneId}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
              >
                <div className="relative group">
                  <Crosshair className="w-6 h-6 text-red-500" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {drone.droneId}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Active Players</div>
          <div className="text-2xl font-bold text-blue-600">{players.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Active Drones</div>
          <div className="text-2xl font-bold text-red-600">{drones.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Entities</div>
          <div className="text-2xl font-bold text-purple-600">
            {players.length + drones.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameMap;