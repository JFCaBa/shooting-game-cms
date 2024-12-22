import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow, MarkerClusterer, Icon } from '@react-google-maps/api';
import { api } from '../../../utils/api';
import { Loader } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '600px'
};

const defaultCenter = {
  lat: 0,
  lng: 0
};

const GameMap = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [map, setMap] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/players');
      if (response && response.data) {
        setPlayers(response.data);
        setError(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching players:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 5000);
    return () => clearInterval(interval);
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && players.length > 0 && !mapLoaded) {
      const bounds = new window.google.maps.LatLngBounds();
      players
        .filter(player => player.location?.latitude && player.location?.longitude)
        .forEach(player => {
          bounds.extend({
            lat: player.location.latitude,
            lng: player.location.longitude
          });
        });
      map.fitBounds(bounds);
      setMapLoaded(true);
    }
  }, [map, players, mapLoaded]);

  if (loading && !map) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="ml-2 text-gray-600">Loading map...</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Players Map</h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time geographical view of players
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600">
            Active Players ({players.filter(p => p.location?.latitude && p.location?.longitude).length})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total Players</div>
          <div className="text-2xl font-bold text-blue-600">{players.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Located Players</div>
          <div className="text-2xl font-bold text-green-600">
            {players.filter(p => p.location?.latitude && p.location?.longitude).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Unlocated Players</div>
          <div className="text-2xl font-bold text-gray-600">
            {players.filter(p => !p.location?.latitude || !p.location?.longitude).length}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={2}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              styles: [
                {
                  featureType: 'poi',
                  elementType: 'labels',
                  stylers: [{ visibility: 'off' }]
                }
              ]
            }}
          >
            <MarkerClusterer>
              {(clusterer) =>
                players
                  .filter(player => player.location?.latitude && player.location?.longitude)
                  .map(player => (
                    <Marker
                      key={player.playerId}
                      position={{
                        lat: player.location.latitude,
                        lng: player.location.longitude
                      }}
                      onClick={() => setSelectedPlayer(player)}
                      clusterer={clusterer}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: '#4285F4',
                        fillOpacity: 1,
                        strokeColor: 'white',
                        strokeWeight: 2,
                      }}
                    />
                  ))
              }
            </MarkerClusterer>
            
            {selectedPlayer && (
              <InfoWindow
                position={{
                  lat: selectedPlayer.location.latitude,
                  lng: selectedPlayer.location.longitude
                }}
                onCloseClick={() => setSelectedPlayer(null)}
              >
                <div className="p-2">
                  <h3 className="font-bold">{selectedPlayer.playerId}</h3>
                  <p className="text-sm">
                    Last active: {new Date(selectedPlayer.lastActive).toLocaleString()}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
};

export default GameMap;