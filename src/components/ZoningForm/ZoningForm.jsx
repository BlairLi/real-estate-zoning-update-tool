import React, { useState } from 'react';
import Notification from '../common/Notification';

const ZONING_TYPES = [
  'Residential',
  'Commercial',
  'Industrial'
];

const ZoningForm = ({ selectedParcels, onSubmit }) => {
  const [zoningType, setZoningType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!zoningType || selectedParcels.length === 0) {
      setNotification({
        type: 'error',
        message: 'Please select both parcels and a zoning type'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(selectedParcels, zoningType);
      setNotification({
        type: 'success',
        message: `Successfully updated ${selectedParcels.length} parcel(s) to ${zoningType} zoning`
      });
      setZoningType('');
    } catch (error) {
      console.error('Error updating zoning:', error);
      setNotification({
        type: 'error',
        message: 'Failed to update zoning. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Update Zoning Type</h2>
      
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected Parcels: {selectedParcels.length}
          </label>
          {selectedParcels.length > 0 ? (
            <div className="text-sm text-gray-500 mb-2">
              Selected IDs: {selectedParcels.slice(0, 3).join(', ')}
              {selectedParcels.length > 3 && ` and ${selectedParcels.length - 3} more`}
            </div>
          ) : (
            <div className="text-sm text-gray-500 mb-2">
              Click on parcels on the map to select them
            </div>
          )}
          <select
            value={zoningType}
            onChange={(e) => setZoningType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Zoning Type</option>
            {ZONING_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !zoningType || selectedParcels.length === 0}
          className={`w-full py-2 px-4 rounded-md text-white transition-colors duration-200 ${
            isSubmitting || !zoningType || selectedParcels.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </span>
          ) : (
            'Update Zoning'
          )}
        </button>
      </form>
    </div>
  );
};

export default ZoningForm; 