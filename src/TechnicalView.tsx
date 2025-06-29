import React from 'react';
import './TechnicalView.css';

interface TechnicalViewProps {
  onBackToHome: () => void;
}

function TechnicalView({ onBackToHome }: TechnicalViewProps) {
  return (
    <div className="technical-view full-screen-view">
      <div className="view-content">
        <h2>My Technical Skills</h2>
        <p>Explore my technical projects and expertise here.</p>
        <button onClick={onBackToHome} className="back-button">Back to Home</button>
      </div>
    </div>
  );
}

export default TechnicalView;