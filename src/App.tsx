import React, { useState } from 'react';
import HomeView from './HomeView';
import CreativeView from './CreativeView'; 
import TechnicalView from './TechnicalView'; 
import './App.css';

type View = 'home' | 'creative' | 'technical';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');

  const handleSelectView = (view: View) => {
    setCurrentView(view);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  return (
    <div className="app-container">
      {currentView === 'home' && (
        <HomeView onSelectView={handleSelectView} />
      )}

      {currentView === 'creative' && (
        <CreativeView onBack={handleBackToHome} />
      )}

      {currentView === 'technical' && (
        <TechnicalView onBack={handleBackToHome} />
      )}
    </div>
  );
}

export default App;