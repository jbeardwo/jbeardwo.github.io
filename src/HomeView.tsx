import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HomeView.css'; 

interface HomeViewProps {
  onSelectView: (view: 'creative' | 'technical') => void;
}


function HomeView({ onSelectView }: HomeViewProps) {

  const [isCreativeClicked, setIsCreativeClicked] = useState(false);
  const [isTechnicalClicked, setIsTechnicalClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [animateIcons, setAnimateIcons] = useState(false);

  //Offset the initial animations so they don't conflict with page load
  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    const iconTimer = setTimeout(() => {
      setAnimateIcons(true); 
    }, 900);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(iconTimer);
    };
  }, []);
  //clicking the Creative Half
  const handleCreativeClick = async () => {
    setIsCreativeClicked(true);
    setIsTechnicalClicked(false);

    setTimeout(() => {
  //  onSelectView('creative');
    }, 600);
  };
  //clicking the Technical Half
  const handleTechnicalClick = async () => {
      setIsTechnicalClicked(true);
      setIsCreativeClicked(false);

    setTimeout(() => {
  //    onSelectView('technical');
    }, 600);
  };
  //states for icons' hover text
  const hoverTextVariants = {
    rest: { opacity: 0, y: -5, transition: { duration: 0.2, ease: "easeOut" } },
    hover: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
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

      {/* Header w/ portrait and icons 
        icons all fan out from the middle, relative position based on width and gap*/}
      <motion.div
        className="page-header"
        animate={isTechnicalClicked ? {left:"100%", x:"-105%"}
                : isCreativeClicked ? {left: "0%", x:"+10%"}
                : {left:"50%", x:"-50%"}}
        transition={{ type: "spring", duration: .5, bounce: 0 }}
      >
        <motion.div
          className="oval-container"
          initial={{width: 45, x:-3 }}
          animate={animateIcons? {width: 199, x:"-3px"} : {width: 45, x:-3}}
          transition={{ type: "spring", duration: .5, bounce: 0 }}
        >

          {/* portrait */}
          <motion.div
              className="icon-hover-wrapper portrait-description"
              whileHover="hover" 
              initial="rest"
          >
            <motion.img src="/images/me-square.jpg" 
              className="icon portrait"
              initial= {{ x: "72px" }}
              animate={animateIcons ? { x: "0px"} : {x:"72px"}}
              transition={{
                type: "spring",  
                stiffness: 200,
                damping: 15 
              }}
            ></motion.img>
            <motion.p
              className="icon-description"
              variants={hoverTextVariants}
            >
              That's me!
            </motion.p>
          </motion.div>

            {/* github */}
          <a href="https://github.com/jbeardwo" target="_blank" rel="noopener noreferrer">
            <motion.div
                className="icon-hover-wrapper"
                whileHover="hover" 
                initial="rest"
            >
              <motion.img src="/github-fill.svg" 
                className="icon"
                initial= {{ x: "24px" }}
                animate={animateIcons ? { x: "0px"} : {x:"24px"}}  
                transition={{
                  type: "spring",  
                  stiffness: 200,
                  damping: 15 
                }}
              ></motion.img>
              <motion.p
                className="icon-description"
                variants={hoverTextVariants}
              >
                GitHub Profile 
              </motion.p>
            </motion.div>
          </a>      

          {/* linkedin */}
          <a href="https://www.linkedin.com/in/john-beardwood/" target="_blank" rel="noopener noreferrer"> 
            <motion.div
                className="icon-hover-wrapper"
                whileHover="hover" 
                initial="rest" 
            >
              <motion.img src="/linkedin-box-fill.svg"
                className="icon"
                initial= {{ x: "-24px" }}
                animate={animateIcons ? { x: "0px"} : {x:"-24px"}}  
                transition={{
                  type: "spring",  
                  stiffness: 200,
                  damping: 15 
                }}
              ></motion.img>
              <motion.p
                className="icon-description"
                variants={hoverTextVariants}
                
              >
                LinkedIn Profile
              </motion.p>
            </motion.div>
          </a>         

          {/* Resume */}
          <a href="/Resume June 2025 AI.pdf" target="_blank" rel="noopener noreferrer">     
            <motion.div
                className="icon-hover-wrapper"
                whileHover="hover"            
                initial="rest"                
            >
              <motion.img src="/file-pdf-2-fill.svg"
                className="icon"
                initial= {{ x: "-72px" }}
                animate={animateIcons ? { x: "0px"} : {x:"-72px"}}  
                transition={{
                  type: "spring",  
                  stiffness: 200,
                  damping: 15 
                }}
              ></motion.img>
              <motion.p
                className="icon-description"
                variants={hoverTextVariants}
              >
                Professional Resume 
              </motion.p>
            </motion.div>
          </a>
        </motion.div>
        
      </motion.div>
      
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
          <h2>Technical Work</h2>
          <p>Explore my technical portfolio.</p>
        </div>

      </motion.div>

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
          <h2>Creative Work</h2>
          <p>Explore my creative portfolio.</p>
        </div>
      </motion.div>
      
    </div>
    </>
  );
}

export default HomeView;