import React, {useState} from 'react';
import { motion  } from 'framer-motion';
import './CreativeView.css';
import Header from '../src/components/Header';

interface CreativeViewProps {
  onBackToHome: () => void;
}

function CreativeView({ onBackToHome }: CreativeViewProps) {
  const [isHomeClicked, setIsHomeClicked] = useState(false);

  const handleHomeClick = async () => {
    setIsHomeClicked(true);
    setTimeout(() => {
      onBackToHome();
    }, 700);
  }

  return (
    <>
      <motion.div
        className='creative-intro-text'
        initial={{y:0, opacity: 1}}
        animate={{y: '-100vh', opacity:1}}
        transition={{duration : 0.75, delay: 0.3}}
      >  
        <div className="half-content right-content">
          <h2>Creative</h2>
          <p></p>
        </div>
      </motion.div>


      <motion.div className="creative-view full-screen-view"
      initial={{opacity: 1}}
      animate={isHomeClicked? {opacity: 0}
          : {opacity: 1}}
        transition={{duration: 0.5}}
      >

        
        <motion.div
          className='header-container'
          initial={{left: "0%", x:"+10%"}}
        >
          <Header shouldAnimateFanOut={false} />
        </motion.div>
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
        >
          John Beardwood
        </motion.div>
        <motion.img src="/home-heart-fill.svg"
          className= "home-button"
          initial={{bottom: "-100px", left:"0%", x:"10px"}}
          animate={{bottom: "20px", left:"0%", x:"10px"}}
          transition={{duration : 0.5, delay: 0.5}}
          onClick={handleHomeClick}
          
        ></motion.img>
        </motion.div>
      
    </>
  );
}

export default CreativeView;