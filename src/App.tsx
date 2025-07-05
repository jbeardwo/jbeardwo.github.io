import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion'
import HomeView from './HomeView';
import CreativeView from './CreativeView'; 
import TechnicalView from './TechnicalView'; 
import './App.css';

type View = 'home' | 'creative' | 'technical';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [lastView, setlastView] = useState<'creative'| 'technical'| null>(null);

  const handleSelectView = (view: View) => {
    setlastView(view as 'creative' | 'technical' | null);
    setCurrentView(view);
  };

  const handleBackToHome = () => {
    if (currentView === 'creative' || currentView === 'technical') {
      setlastView(currentView);
    } else {
      setlastView(null);
    }
    setCurrentView('home');
  };

  const backgroundClass = 
    lastView === 'creative' ? 'bg-from-creative' :
    lastView === 'technical' ? 'bg-from-technical' :
    '';

  return (

    <div className="app-container">

      <div className={`bg-dup ${backgroundClass}`}></div>

      <AnimatePresence> 
        {currentView === 'home' && (
          <motion.div
            key="homeView"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1, zIndex : 1 }}
            exit={{ opacity: 0, zIndex : 2 }}
            transition={{ duration: 0.5 }}
            className="full-screen-overlay"
          >
            <HomeView onSelectView={handleSelectView} lastView={lastView} />
          </motion.div>
        )}

        {currentView === 'creative' && (
          <motion.div
            key="creativeView"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1, zIndex : 1 }}
            exit={{ opacity: 1, zIndex : 2 }}
            transition={{ duration: 0.5 }}
            className="full-screen-overlay"
          >
            <CreativeView onBackToHome={handleBackToHome}  />
          </motion.div>
        )}

        {currentView === 'technical' && (
          <motion.div
            key="technicalView"
            initial={{ opacity: 1}}
            animate={{ opacity: 1, zIndex : 1 }}
            exit={{ opacity: 1, zIndex : 2 }}
            transition={{ duration: 0.5 }}
            className="full-screen-overlay"
          >
            <TechnicalView onBackToHome={handleBackToHome} />
          </motion.div>
        )}
      </AnimatePresence>

      

    </div>
  );
}

export default App;