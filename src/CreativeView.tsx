import React from 'react';
import { motion  } from 'framer-motion';
import './CreativeView.css';
import Header from '../src/components/Header';

interface CreativeViewProps {
  onBackToHome: () => void;
}

function CreativeView({ onBackToHome }: CreativeViewProps) {
  return (
    <>
      <motion.div
        className='creative-intro-text'
        initial={{y:0, opacity: 1}}
        animate={{y: '-100vh', opacity:1}}
        transition={{duration : 0.75, delay: 0.5}}
      >  
        <div className="half-content right-content">
          <h2>Creative</h2>
          <p></p>
        </div>
      </motion.div>


      <div className="creative-view full-screen-view">

        {/* Header w/ portrait and icons 
        icons all fan out from the middle, relative position based on width and gap*/}
      <motion.div
        className='header-container'
        initial={{left: "0%", x:"+10%"}}
        // animate={isTechnicalClicked ? {left:"100%", x:"-110%"}
        //     : isCreativeClicked ? {left: "0%", x:"+10%"} // Added x to creative side too for consistency
        //     : {left:"50%", x:"-50%"}}
        // transition={{ type: "spring", duration: .5, bounce: 0 }}
      >
        <Header shouldAnimateFanOut={false} />
      </motion.div>

        
        {/* <div className="view-content">
          <h2>My Creative Portfolio</h2>
          <p>This is where I showcase my creative projects.</p>
          <button onClick={onBackToHome} className="back-button">Back to Home</button>
        </div> */}
      </div>
    </>
  );
}

export default CreativeView;