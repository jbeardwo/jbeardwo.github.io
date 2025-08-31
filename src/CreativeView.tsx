import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CreativeView.css';
import Header from '../src/components/Header';
import AboutMeOverlay from './components/AboutMeOverlay';

interface CreativeViewProps {
  onBackToHome: () => void;
}

function CreativeView({ onBackToHome }: CreativeViewProps) {
  const [isHomeClicked, setIsHomeClicked] = useState(false);
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);

  const handleHomeClick = async () => {
    setIsHomeClicked(true);
    setTimeout(() => {
      onBackToHome();
    }, 700);
  }

  return (
    <div className='creative-wrapper'>
      <motion.div
        className='creative-intro-text'
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: '-100vh', opacity: 1 }}
        transition={{ duration: 0.75, delay: 0.3 }}
      >
        <div className="half-content right-content">
          <h2>Creative</h2>
          <p></p>
        </div>
      </motion.div>
      <div className='page-container'>

        <motion.div
          className='header-container'
          initial={{ left: "0%", x: "+10%" }}
        >
          <Header shouldAnimateFanOut={false} onPortraitClick={() => setIsAboutMeOpen(true)} />
        </motion.div>

        <div className="signature">
          John Beardwood
        </div>
        <motion.div className="creative-view full-screen-view"
          initial={{ y: '100vh' }}
          animate={isHomeClicked ? { opacity: 0, y: '0vh' }
            : { y: '0vh' }}
          transition={isHomeClicked ? { duration: 0.75, delay: 0 }
            : { duration: 0.5, delay: 0.2 }}
        >

          <section className="layout">
            <div className="page-top">

            </div>
            <div className="body">
              <h1>Under Construction</h1>
              <h2>But there's some cool art on the Technical side, for now.</h2>
            </div>
            <div className="side">

            </div>
            <div className="page-bot">

              <motion.img src="/home-heart-fill.svg"
                className="home-button"
                initial={{ bottom: "-100px" }}
                animate={{ bottom: "5px" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={handleHomeClick}
              ></motion.img>

            </div>
          </section>

        </motion.div>
      </div>

    </div>
  );
}

export default CreativeView;
