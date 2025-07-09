import React, {useState} from 'react';
import { motion  } from 'framer-motion';
import './TechnicalView.css';
import Header from '../src/components/Header';
import AboutMeOverlay from './components/AboutMeOverlay';

interface TechnicalViewProps {
  onBackToHome: () => void;
}

function TechnicalView({ onBackToHome }: TechnicalViewProps) {
  const [isHomeClicked, setIsHomeClicked] = useState(false);
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);

  const handleHomeClick = async () => {
    setIsHomeClicked(true);
    setTimeout(() => {
      onBackToHome();
    }, 700);
  }

  return (
    <>
      <motion.div
        className="technical-intro-text"
        initial={{y:0, opacity: 1 }}
        animate={{ y:'-100vh', opacity: 1}}
        transition={{duration : 0.75, delay: 0.5}}
      >
        <div className="half-content left-content">
          <h2>Technical</h2>
          <p></p>
        </div>
      </motion.div>
    
      <AboutMeOverlay isOpen={isAboutMeOpen} onClose={() => setIsAboutMeOpen(false)} />

      <motion.div className="technical-view full-screen-view"
        initial={{opacity: 1}}
        animate={isHomeClicked? {opacity: 0}
            : {opacity: 1}}
        transition={{duration: 0.5}}
      >
        
        <motion.div
          className='header-container'
          initial={{left:"100%", x:"-110%"}}
        >
          <Header shouldAnimateFanOut={false} onPortraitClick={() => setIsAboutMeOpen(true)}/>
        </motion.div>
        <section className="layout">
          <div className="header">1</div>
          <div className="leftSide">2</div>
          <div className="body">

          </div>
          <div className="rightSide">
            
            <div className="sidebar">
              <img src='/images/mediaPlayerTemp.png'></img>
              <div className="sidebar-content">
                <p>4</p>
              </div>
              
            </div>
          </div>
          <div className="footer">5</div>
        </section>
    

        <motion.div
          className="signature"
          initial={{bottom: "20px", left:"100%", x:"calc(-100% - 60px)"}}
        >
          John Beardwood
        </motion.div>
        <motion.img src="/home-heart-fill.svg"
          className= "home-button"
          initial={{bottom: "-100px", left:"100%", x:"-48px"}}
          animate={{bottom: "23px", left:"100%", x:"-48px"}}
          transition={{duration : 0.5, delay: 0.5}}
          onClick={handleHomeClick}
        ></motion.img>

      </motion.div>
      
    </>
  );
}

export default TechnicalView;