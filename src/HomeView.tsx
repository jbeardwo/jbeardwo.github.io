import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import './HomeView.css';
import Header from '../src/components/Header';
import AboutMeOverlay from './components/AboutMeOverlay';

interface HomeViewProps {
  onSelectView: (view: 'creative' | 'technical') => void;
  lastView?: 'creative' | 'technical' | null;
}


function HomeView({ onSelectView, lastView }: HomeViewProps) {
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);
  const [isCreativeClicked, setIsCreativeClicked] = useState(false);
  const [isTechnicalClicked, setIsTechnicalClicked] = useState(false);

  const [BgClass, setBgClass] = useState(() => {
    if (lastView === 'creative') return 'creative-home-bg';
    if (lastView === 'technical') return 'technical-home-bg';
    return 'default-home-bg';
  });
  const [showLoading, setShowLoading] = useState(() => {
    const loadShow = !lastView;
    return loadShow;
  });

  const controlsLeftSig = useAnimation();
  const controlsRightSig = useAnimation();
  const controlsSignature = useAnimation();

  //Offset the initial animations so they don't conflict with page load
  useEffect(() => {
    if (showLoading) {
      const loadingTimer = setTimeout(() => {
        setShowLoading(false);
      }, 500);

      return () => {
        clearTimeout(loadingTimer);
      };
    }
  }, [showLoading]);
  //Initial Signature Animations
  useEffect(() => {
    if (!showLoading) {
      //Bring signature halves in from the sides
      const runHalfSigAnimation = async () => {
        await Promise.all([
          controlsLeftSig.start({
            left: "50%",
            x: "-100%",
            transition: { type: "spring", duration: .5, bounce: .2, delay: 0 }
          }),
          controlsRightSig.start({
            left: "50%",
            x: "0%",
            transition: { type: "spring", duration: .5, bounce: .2, delay: 0 }
          })
        ]);

        await new Promise(resolve => setTimeout(resolve, 0));
        //Halves fade out while full signature
        await Promise.all([
          controlsLeftSig.start({
            opacity: 0,
            transition: { duration: .5 }
          }),
          controlsRightSig.start({
            opacity: 0,
            transition: { duration: .5 }
          }),
          controlsSignature.start({
            opacity: 1,
            transition: { duration: .15 }
          })
        ]);
        //Full signature shrinks and moves to the bottom
        await new Promise(resolve => setTimeout(resolve, 0));
        controlsSignature.start({
          y: "0vh", left: "50%", x: "-50%", fontSize: "24px",
          transition: { type: "spring", duration: 1, bounce: .2, delay: 0 }
        })
      };
      runHalfSigAnimation();
    }
  }, [showLoading, controlsLeftSig, controlsRightSig, controlsSignature]);


  //set background based on last view for smooth transition
  useEffect(() => {
    if (lastView === "creative") {
      setBgClass("creative-home-bg");
    } else if (lastView === "technical") {
      setBgClass("technical-home-bg");
    } else {
      setBgClass("default-home-bg");
    }
  }, [lastView]);


  //clicking the Creative Half
  const handleCreativeClick = async () => {
    setIsCreativeClicked(true);
    setIsTechnicalClicked(false);
    //Move Signature to corresponding side
    controlsSignature.start({
      y: "0vh", left: "0%", right: "auto", x: "60px", fontSize: "25px",
      transition: { type: "spring", duration: .5, bounce: .2, delay: 0 }
    })
    setTimeout(() => {
      onSelectView('creative');
    }, 700);
  };
  //clicking the Technical Half
  const handleTechnicalClick = async () => {
    setIsTechnicalClicked(true);
    setIsCreativeClicked(false);
    //Move Signature to corresponding side
    controlsSignature.start({
      y: "0vh", left: "auto", right: "0%", x: "-40px", fontSize: "25px",
      transition: { type: "spring", duration: .5, bounce: .2, delay: 0 }
    })
    setTimeout(() => {
      onSelectView('technical');
    }, 1000);
  };


  return (
    // this is called a react fragment, lets us have 2 top level divs without parents.
    <>
      {/* About Me Overlay */}
      <AboutMeOverlay isOpen={isAboutMeOpen} onClose={() => setIsAboutMeOpen(false)} />

      {/* Loading Overlay */}
      <AnimatePresence>
        {showLoading && (
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

      {/* Main background */}
      <div className={`home-view full-screen-view ${BgClass}`}>

        {/* Header w/ portrait and icons, moves with clicked side */}
        <motion.div
          className='header-container'
          initial={{ left: "50%", x: "-50%" }}
          animate={isTechnicalClicked ? { left: "100%", x: "-110%" }
            : isCreativeClicked ? { left: "0%", x: "+10%" }
              : { left: "50%", x: "-50%" }}
          transition={{ type: "spring", duration: .5, bounce: 0 }}
        >
          <Header shouldAnimateFanOut={true} onPortraitClick={() => setIsAboutMeOpen(true)} />
        </motion.div>
        {/* left half */}
        <motion.div
          className="full-background-layer left-half"
          onClick={handleTechnicalClick}
          whileHover={(!isCreativeClicked && !isTechnicalClicked) ? { scale: 1.01, zIndex: 2 } : {}}
          initial={{ x: "-100vw", opacity: 1 }}
          animate={showLoading ? { x: "-100vw", opacity: 1 }
            : (isTechnicalClicked ? { x: "0vw", opacity: 1, zIndex: 2 }
              : { x: "-50vw", opacity: 1, zIndex: 1 })}
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
          whileHover={(!isCreativeClicked && !isTechnicalClicked) ? { scale: 1.01, zIndex: 2 } : {}}
          initial={{ x: "100vw", opacity: 1 }}
          animate={showLoading ? { x: "100vw", opacity: 1 }
            : (isCreativeClicked ? { x: "0vw", opacity: 1, zIndex: 2 }
              : { x: "50vw", opacity: 1, zIndex: 1 })}
          transition={{ type: "spring", duration: .5, bounce: .2 }}

        >
          <div className="half-content right-content">
            <h2>Creative</h2>
            <p></p>
          </div>
        </motion.div>
      </div>

      {/* signature */}
      <motion.div
        className="signature"
        initial={{ y: "-50vh", left: "50%", x: "-47.5%", fontSize: "48px", opacity: 0 }}
        animate={controlsSignature}
      >
        John Beardwood
      </motion.div>
      {/* half sig 1 */}
      <motion.div
        className="half-signature"
        initial={{ y: "-50vh", left: "0%", x: "-50%", opacity: 1 }}
        animate={controlsLeftSig}
        transition={{ type: "spring", duration: .5, bounce: .2, delay: 0 }}
      >
        John Be
      </motion.div>
      {/* half sig 2 */}
      <motion.div
        className="half-signature"
        initial={{ y: "-50vh", left: "100%", x: "-50%" }}
        animate={controlsRightSig}
        transition={{ type: "spring", duration: .5, bounce: .2, delay: 0 }}
      >
        ardwood
      </motion.div>

    </> //close the fragment
  );
}

export default HomeView;
