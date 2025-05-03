import React, { useState, useCallback } from 'react';
import MapComponent from './components/Map/MapComponent';
import ZoningForm from './components/ZoningForm/ZoningForm';

function App() {
  const [selectedParcels, setSelectedParcels] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

  const handleParcelSelect = useCallback((parcels) => {
    setSelectedParcels(parcels);
  }, []);

  const handleZoningUpdate = async (parcelIds, zoningType) => {
    try {
      // Ensure all IDs are numbers
      const numericParcelIds = parcelIds.map(id => {
        const numId = Number(id);
        if (isNaN(numId)) {
          throw new Error(`Invalid parcel ID: ${id}`);
        }
        return numId;
      });
      
      const response = await fetch(`${API_URL}/api/parcels/update-zoning`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parcelIds: numericParcelIds,
          zoningType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update zoning');
      }

      // Show success message
      alert(data.message || 'Successfully updated zoning');
      
      // Refresh the map data
      window.location.reload();
    } catch (error) {
      console.error('Error updating zoning:', error);
      alert(error.message || 'Failed to update zoning. Please try again.');
      throw error;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-3/4">
        <MapComponent onParcelSelect={handleParcelSelect} />
      </div>
      <div className="w-1/4 p-4 bg-gray-100">
        <ZoningForm
          selectedParcels={selectedParcels}
          onSubmit={handleZoningUpdate}
        />
      </div>
    </div>
  );
}

export default App; 