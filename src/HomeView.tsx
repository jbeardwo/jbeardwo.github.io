import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './HomeView.css'; 

interface HomeViewProps {
  onSelectView: (view: 'creative' | 'technical') => void;
}


function HomeView({ onSelectView }: HomeViewProps) {

  const [isCreativeClicked, setIsCreativeClicked] = useState(false);
  const [isTechnicalClicked, setIsTechnicalClicked] = useState(false);


  const handleCreativeClick = async () => {
    setIsCreativeClicked(true);
    setIsTechnicalClicked(false);

    setTimeout(() => {
    onSelectView('creative');
    }, 600);
  };

  const handleTechnicalClick = async () => {
      setIsTechnicalClicked(true);
      setIsCreativeClicked(false);

    setTimeout(() => {
      onSelectView('technical');
    }, 600);
  };

  return (
    <div className="home-view full-screen-view">

      <motion.div
        className="page-header"
        //animate={}
        //transition={{ type: "spring", duration: .5, bounce: 0 }}
      >

        <div className="page-title">
          My Awesome Portfolio
        </div>
        <div className="portrait">
        </div>  
      </motion.div>

      <motion.div 
        className="full-background-layer left-half"
        onClick={handleTechnicalClick}
        initial={{ x: "-50vw", opacity: 1 }}
        animate={isTechnicalClicked ? { x: "0vw", opacity:1, zIndex:2 } : { x: "-50vw", opacity: 1 }}
        transition={{ type: "spring", duration: .5, bounce: 0 }} 
      >
        <div className="half-content left-content">
          <h2>Technical Work</h2>
          <p>Explore my technical portfolio.</p>
        </div>

      </motion.div>

      <motion.div 
        className="full-background-layer right-half"
        onClick={handleCreativeClick}
        initial={{ x: "50vw", opacity: 1 }}
        animate={isCreativeClicked ? { x: "0vw", opacity:1, zIndex:2 } : { x: "50vw", opacity: 1 }}
        transition={{ type: "spring", duration: .5, bounce: 0 }}
      >
        <div className="half-content right-content">
          <h2>Creative Work</h2>
          <p>Explore my creative portfolio.</p>
        </div>
      </motion.div>
      
    </div>
  );
}

export default HomeView;