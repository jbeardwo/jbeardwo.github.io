import React from 'react';
import { motion  } from 'framer-motion';
import './TechnicalView.css';
import Header from '../src/components/Header';

interface TechnicalViewProps {
  onBackToHome: () => void;
}

function TechnicalView({ onBackToHome }: TechnicalViewProps) {
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
    

      <div className="technical-view full-screen-view">
        
        <motion.div
          className='header-container'
          initial={{left:"100%", x:"-110%"}}
          // animate={isTechnicalClicked ? {left:"100%", x:"-110%"}
          //     : isCreativeClicked ? {left: "0%", x:"+10%"} // Added x to creative side too for consistency
          //     : {left:"50%", x:"-50%"}}
          // transition={{ type: "spring", duration: .5, bounce: 0 }}
        >
          <Header shouldAnimateFanOut={false} />
        </motion.div>

        {/* <div className="view-content">
          <h2>My Technical Skills</h2>
          <p>Explore my technical projects and expertise here.</p>
          <button onClick={onBackToHome} className="back-button">Back to Home</button>
        </div> */}
      </div>
    </>
  );
}

export default TechnicalView;