import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AdressComponenets = ({ setLatitude, setLongitude }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const boxRef = useRef(null);
 
  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      try {
        const res = await axios.get(`http://localhost:3000/location/suggestions?query=${value}`);
        setSuggestions(res.data);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (item) => {
    setLatitude(item.lat)
    setLongitude(item.lon)
    setQuery(item.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };


  // Close suggestions if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={boxRef}>
      <label htmlFor="">Adress</label>
      <input
        className="w-full p-3 border rounded-lg mb-3"
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Enter address"
      />

      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          border: '1px solid #ccc',
          maxHeight: '200px',
          overflowY: 'auto',
          position: 'absolute',
          width: '100%',
          backgroundColor: 'white',
          zIndex: 10,
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}>
          {suggestions.map((item, index) => (
            <div
                key={index}
                onClick={() => handleSelect(item)}
                style={{
                padding: '10px',
                borderBottom: '1px solid #eee',
                cursor: 'pointer',
                color: '#000', // <-- ADD THIS
                backgroundColor: '#fff', // optional for clarity
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            >
                {item.display_name}
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default AdressComponenets;
