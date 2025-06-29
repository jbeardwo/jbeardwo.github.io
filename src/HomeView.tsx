import React, { useState } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import './HomeView.css'; 

interface HomeViewProps {
  onSelectView: (view: 'creative' | 'technical') => void;
}

const CREATIVE_BG_IMAGE = '/public/images/creative-bg.jpg';
const TECHNICAL_BG_IMAGE = '/public/images/technical-bg.jpg';
const DEFAULT_BG_IMAGE = '/public/images/technical-bg1.jpg';


function HomeView({ onSelectView }: HomeViewProps) {

  const [isCreativeClicked, setIsCreativeClicked] = useState(false);
  const [isTechnicalClicked, setIsTechnicalClicked] = useState(false);
  const [bgImagePath, setBgImagePath] = useState(DEFAULT_BG_IMAGE);

  const bgAnimationControls = useAnimationControls();

  const handleCreativeClick = async () => {
    setIsCreativeClicked(true);
    setIsTechnicalClicked(false);
    setBgImagePath(CREATIVE_BG_IMAGE);
    
    await bgAnimationControls.set({ x: "-50vw", backgroundPosition: "right" });
    await bgAnimationControls.start({
        x: "0vw",
        transition: { type: "spring", duration: .5, bounce: 0 }
    });

    setTimeout(() => {
     onSelectView('creative');
    }, 600);
  };

  const handleTechnicalClick = async () => {
      setIsTechnicalClicked(true);
      setIsCreativeClicked(false);
      setBgImagePath(TECHNICAL_BG_IMAGE);

      await bgAnimationControls.set({ x: "50vw" , backgroundPosition: "left"});
      await bgAnimationControls.start({
        x:"0vw",
        transition: { type: "spring", duration: .5, bounce: 0 }
      })

    setTimeout(() => {
      onSelectView('technical');
    }, 300);
  };

  return (
    <div className="home-view full-screen-view">

      <motion.div 
        className="full-background-layer"
        initial={{ x: "-50vw", opacity: 1 }}
        animate={bgAnimationControls}
        transition={{ type: "spring", duration: .5, bounce: 0 }}
        style={{ backgroundImage: `url(${bgImagePath})`  }}
      >
      </motion.div>

      <div className="page-title">
        My Awesome Portfolio
      </div>

      <motion.div 
        className="image-half left-half"
        onClick={handleCreativeClick}
        initial={{ x: 0, opacity: 1 }}
        //Moves image across screen, width adjustment is to prevent sub-pixel overlap issues
        animate={isCreativeClicked ? { x: "50vw", opacity:1, zIndex: 3, width: "50.1vw" } : { x:0, opacity:1, zIndex: 2 }}
        transition={{ type: "spring", duration: .5, bounce: 0 }}
      >
        <div className="half-content">
          <h2>Creative Work</h2>
          <p>Explore my artistic portfolio.</p>
        </div>
      </motion.div>

      <motion.div 
        className="image-half right-half"
        onClick={handleTechnicalClick}
        initial={{ x: 0, opacity: 1 }}
        //Moves image across screen, width adjustment is to prevent sub-pixel overlap issues
        animate={isTechnicalClicked ? { x: "-50vw", opacity:1, zIndex: 3, width: "50.1vw" } : { x:0, opacity:1, zIndex: 2 }}
        transition={{ type: "spring", duration: .5, bounce: 0 }}
      >
        <div className="half-content">
          <h2>Technical Work</h2>
          <p>Explore my technical portfolio.</p>
        </div>
      </motion.div>
    </div>
  );
}

export default HomeView;