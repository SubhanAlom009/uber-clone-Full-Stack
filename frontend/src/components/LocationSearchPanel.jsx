import React from 'react';

function LocationSearchPanel({ pickupSuggestions, destinationSuggestions, onSuggestionClick }) {
  return (
    <div>
      <ul className="flex flex-col text-base space-y-3">
        {pickupSuggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onSuggestionClick(suggestion.description, "pickup");
            }}
            className="flex font-semibold items-center border-b-2 border-gray-300 active:border-gray-600 p-2 gap-2"
          >
            <i className="ri-map-pin-line text-xl text-gray-600"></i>
            <p>{suggestion.description}</p>
          </li>
        ))}
      </ul>
      
      <ul className="flex flex-col text-base space-y-3">
        {destinationSuggestions.map((suggestion, index) => (
          <li
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              onSuggestionClick(suggestion.description, "destination");
            }}
            className="flex font-semibold items-center border-b-2 border-gray-300 active:border-gray-600 p-2 gap-2"
          >
            <i className="ri-map-pin-line text-xl text-gray-600"></i>
            <p>{suggestion.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LocationSearchPanel;
