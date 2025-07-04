import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HomeView.css'; 
import Header from '../src/components/Header';

interface HomeViewProps {
  onSelectView: (view: 'creative' | 'technical') => void;
}


function HomeView({ onSelectView }: HomeViewProps) {

  const [isCreativeClicked, setIsCreativeClicked] = useState(false);
  const [isTechnicalClicked, setIsTechnicalClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(() => {
    const hasVisitedHomeViewInSession = sessionStorage.getItem('hasVisitedHomeViewInSession');
    console.log(hasVisitedHomeViewInSession)
    return hasVisitedHomeViewInSession ? false : true;
  });
  //Offset the initial animations so they don't conflict with page load
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('hasVisitedHomeViewInSession', 'true');
    }, 500);

    return () => {
      clearTimeout(loadingTimer);
    };
  }, []);
  //clicking the Creative Half
  const handleCreativeClick = async () => {
    setIsCreativeClicked(true);
    setIsTechnicalClicked(false);

    setTimeout(() => {
      onSelectView('creative');
    }, 700);
  };
  //clicking the Technical Half
  const handleTechnicalClick = async () => {
      setIsTechnicalClicked(true);
      setIsCreativeClicked(false);

    setTimeout(() => {
      onSelectView('technical');
    }, 1000);
  };


  return (
    // this is called a react fragment, lets us have 2 top level divs without parents.
    <>
    {/* Loading Overlay */}
    <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: .75 } }}
            className="loading-overlay"
          >
            <div className="spinner"></div>
          </motion.div>
        )}
    </AnimatePresence>

    <div className="home-view full-screen-view">

      {/* Header w/ portrait and icons */}
      <motion.div
        className='header-container'
        initial={{ left: "50%", x: "-50%" }}
        animate={isTechnicalClicked ? {left:"100%", x:"-110%"}
            : isCreativeClicked ? {left: "0%", x:"+10%"} // Added x to creative side too for consistency
            : {left:"50%", x:"-50%"}}
        transition={{ type: "spring", duration: .5, bounce: 0 }}
      >
        <Header shouldAnimateFanOut={true} />
      </motion.div>
      {/* left half */}
      <motion.div 
        className="full-background-layer left-half"
        onClick={handleTechnicalClick}
        initial={{ x: "-100vw", opacity: 1 }}
        animate={isLoading ? { x: "-100vw", opacity: 1 }
         : (isTechnicalClicked ? { x: "0vw", opacity: 1, zIndex: 2 }
         : { x: "-50vw", opacity: 1 })}
        transition={{ type: "spring", duration: .5, bounce: .2 }} 
      >
        <div className="half-content left-content">
          <h2>Technical</h2>
          <p></p>
        </div>

      </motion.div>
      {/*right half  */}
      <motion.div 
        className="full-background-layer right-half"
        onClick={handleCreativeClick}
        initial={{ x: "100vw", opacity: 1 }}
        animate={isLoading ? { x: "100vw", opacity: 1 }
         : (isCreativeClicked ? { x: "0vw", opacity: 1, zIndex: 2 }
         : { x: "50vw", opacity: 1 })}
        transition={{ type: "spring", duration: .5, bounce: .2 }}
      >
        <div className="half-content right-content">
          <h2>Creative</h2>
          <p></p>
        </div>
      </motion.div>
      {/* signature */}
      <motion.div
        className="signature"
        initial={{y:"-50vh", left: "50%", x:"-50%", fontSize:"50px"}}
        animate={isTechnicalClicked ? {y:"0vh", left:"auto", right:"0%", x:"-60px", fontSize: "25px"}
            : isCreativeClicked ? {y:"0vh", left: "0%", x:"60px", fontSize: "25px"} // Added x to creative side too for consistency
            : {y:"0vh", left: "50%", x: "-50%", fontSize:"24px"}}
        transition={isTechnicalClicked||isCreativeClicked ? { type: "spring", duration: .5, bounce: .2 , delay:0} 
            : {  type: "spring", duration: 1, bounce: .2 , delay:1.5}}
        
      >
        John Beardwood
      </motion.div>

    </div>
    </> //close the fragment
  );
}

export default HomeView;