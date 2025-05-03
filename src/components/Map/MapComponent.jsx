import React, { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
// const API_URL = 'https://real-estate-zoning-update-tool-backend.onrender.com'

const MapComponent = ({ onParcelSelect }) => {
  const [parcels, setParcels] = useState(null);
  const [selectedParcels, setSelectedParcels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoadingHint, setShowLoadingHint] = useState(false);

  const popupRef = useRef(null);
  const popupContentRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowLoadingHint(true); // 🔥
    }, 10000); // 10 seconds
  
    return () => clearTimeout(timeout); // cleanup
  }, []);

  useEffect(() => {
    onParcelSelect(selectedParcels);
  }, [selectedParcels, onParcelSelect]);

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/parcels`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const geoJsonData = {
          type: 'FeatureCollection',
          features: data.map(parcel => ({
            type: 'Feature',
            geometry: JSON.parse(parcel[1]),
            properties: {
              id: parcel[0],
              zoningType: parcel[2],
              name: parcel[3],
              owner: parcel[4],
              address: parcel[5],
              city: parcel[6],
              zipCode: parcel[7],
              parcelNumber: parcel[8],
              useDescription: parcel[9]
            }
          }))
        };
        setParcels(geoJsonData);
      } catch (error) {
        console.error('Error fetching parcels:', error);
        setError('Failed to load parcel data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchParcels();
  }, []);

  const createPopupContent = (feature) => {
    const div = document.createElement('div');
    div.className = 'parcel-popup-content p-4 min-w-[300px]';
    div.innerHTML = `
      <h3 class="font-bold mb-2 text-lg">Parcel Details</h3>
      <div class="summary-section">
        <p><strong>ID:</strong> ${feature.properties.id}</p>
        <p><strong>Zoning Type:</strong> ${feature.properties.zoningType || 'Not set'}</p>
        <p><strong>Name:</strong> ${feature.properties.name || 'N/A'}</p>
      </div>
      <div class="details-section hidden">
        <div class="grid gap-2 mt-2">
          <p><strong>Owner:</strong> ${feature.properties.owner || 'N/A'}</p>
          <p><strong>Address:</strong> ${feature.properties.address || 'N/A'}</p>
          <p><strong>City:</strong> ${feature.properties.city || 'N/A'}</p>
          <p><strong>ZIP:</strong> ${feature.properties.zipCode || 'N/A'}</p>
          <p><strong>Parcel Number:</strong> ${feature.properties.parcelNumber || 'N/A'}</p>
          <p><strong>Use:</strong> ${feature.properties.useDescription || 'N/A'}</p>
        </div>
      </div>
      <button class="toggle-details mt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200">
        Show More Details
      </button>
    `;

    const toggleButton = div.querySelector('.toggle-details');
    const detailsSection = div.querySelector('.details-section');
    toggleButton.addEventListener('click', () => {
      const isHidden = detailsSection.classList.contains('hidden');
      detailsSection.classList.toggle('hidden');
      toggleButton.textContent = isHidden ? 'Show Less' : 'Show More Details';
    });

    return div;
  };

  const onEachFeature = useCallback((feature, layer) => {
    layer.on({
      click: (e) => {
        const parcelId = feature.properties.id;

        // Close existing popup if open
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
          popupContentRef.current = null;
        }

        const bounds = layer.getBounds();
        const center = bounds.getCenter();

        const contentNode = createPopupContent(feature);
        popupContentRef.current = contentNode;

        const popup = L.popup({
          closeButton: true,
          closeOnClick: false,
          className: 'parcel-popup',
          maxWidth: 400,
          autoPan: true,
          autoPanPadding: [50, 50]
        })
          .setContent(contentNode)
          .setLatLng(center);

        if (mapRef.current) {
          popup.openOn(mapRef.current);
          popupRef.current = popup;
        }

        setSelectedParcels(prev => {
          const newSelection = prev.includes(parcelId)
            ? prev.filter(id => id !== parcelId)
            : [...prev, parcelId];
          layer.setStyle({
            fillColor: newSelection.includes(parcelId) ? '#ff4444' : '#3388ff',
            weight: newSelection.includes(parcelId) ? 3 : 2,
          });
          return newSelection;
        });

        L.DomEvent.stopPropagation(e);
      }
    });
  }, []);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        popupContentRef.current &&
        !popupContentRef.current.contains(event.target)
      ) {
        mapRef.current.closePopup();
        popupRef.current = null;
        popupContentRef.current = null;
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const style = useCallback((feature) => {
    return {
      fillColor: selectedParcels.includes(feature.properties.id) ? '#ff4444' : '#3388ff',
      weight: selectedParcels.includes(feature.properties.id) ? 3 : 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }, [selectedParcels]);

  return (
    <div className="h-screen w-full relative">
      {loading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white bg-opacity-75">
          <div className="p-4 bg-white rounded-lg shadow-lg text-center">
            <p className="font-semibold">Loading parcel data...</p>
            {showLoadingHint && (
              <p className="text-sm text-gray-600 mt-2">
                It may take a few minutes to load the data the first time.
              </p>
            )}
          </div>
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 z-[1000] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
      <MapContainer
        center={[32.7767, -96.7970]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {parcels && (
          <GeoJSON
            key={JSON.stringify(selectedParcels)}
            data={parcels}
            onEachFeature={onEachFeature}
            style={style}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
