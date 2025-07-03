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
      >
        <Header shouldAnimateFanOut={false} />
      </motion.div>

        
        {/* <div className="view-content">
          <h2>My Creative Portfolio</h2>
          <p>This is where I showcase my creative projects.</p>
          <button onClick={onBackToHome} className="back-button">Back to Home</button>
        </div> */}
      </div>
      <section className="layout">
            <div className="header">1</div>
            <div className="leftSide">2</div>
            <div className="body">3</div>
            <div className="rightSide">4</div>
            <div className="footer">5</div>
          </section>
    

      <motion.div
        className="signature"
        initial={{bottom: "20px", left:"0%", x:"60px"}}
        // animate={isTechnicalClicked ? {left:"100%", x:"calc(-110% - 60px)"}
        //     : isCreativeClicked ? {left: "0%", x:"calc(+10% + 60px)"} // Added x to creative side too for consistency
        //     : {left:"50%", x:"-50%"}}
        // transition={{  type: "spring", duration: .5, bounce: .2 }}
      >
        John Beardwood
      </motion.div>
      <motion.img src="/home-heart-fill.svg"
        className= "home-button"
        initial={{bottom: "-100px", left:"0%", x:"10px"}}
        animate={{bottom: "20px", left:"0%", x:"10px"}}
        transition={{duration : 0.5, delay: 0.5}}
        onClick={onBackToHome}
        
      ></motion.img>
    </>
  );
}

export default CreativeView;