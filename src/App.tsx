import React from 'react';
import './App.css'; // Import the CSS for styling

function App() {
  return (
    <div className="app-container">
      <div className="title">
        AHHH
      </div>
      {/* Left half of the page */}
      <div className="image-half left-half">
        <div className="half-text">
          Creative
        </div>
      </div>

      {/* Right half of the page */}
      <div className="image-half right-half">
        <div className="half-text">
          Technical
        </div> 
      </div>
    </div>
  );
}

export default App;