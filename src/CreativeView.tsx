import React from 'react';
import './CreativeView.css';

interface CreativeViewProps {
  onBack: () => void;
}

function CreativeView({ onBack }: CreativeViewProps) {
  return (
    <div className="creative-view full-screen-view">
      <div className="view-content">
        <h2>My Creative Portfolio</h2>
        <p>This is where I showcase my creative projects.</p>
        <button onClick={onBack} className="back-button">Back to Home</button>
      </div>
    </div>
  );
}

export default CreativeView;