import React, {useState, useEffect} from 'react';
import { motion  } from 'framer-motion';
import './TechnicalView.css';
import Header from '../src/components/Header';
import AboutMeOverlay from './components/AboutMeOverlay';
import Slideshow from './components/Slideshow';

interface TechnicalViewProps {
  onBackToHome: () => void;
}

function TechnicalView({ onBackToHome }: TechnicalViewProps) {
  const [isHomeClicked, setIsHomeClicked] = useState(false);
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleHomeClick = async () => {
    setIsHomeClicked(true);
    setTimeout(() => {
      onBackToHome();
    }, 700);
  }

  const slideshowImages = [
    '/images/MusicTheorySample.png',
    '/images/SORSample.png',
    '/images/slide3.jpg',
  ];



  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const iframe = document.getElementById('p5-visualizer') as HTMLIFrameElement | null;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: 'mouseMove',
        x: mousePos.x,
        y: mousePos.y,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      }, '*');
    }
  }, [mousePos]);






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
          <div className="header"></div>
          <div className="leftSide"></div>
          <div className="body">
            <Slideshow images={slideshowImages} interval={5000} />
            <div className='technical-summary'>
              <h1>
                Get Technical<br></br>
              </h1>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
             
            </div>
            <div className='project-card'>
              
              <img src= '/images/MusicTheorySample.png'></img>
              <div className='project-summary'>
                <h1>
                  Music Theory Keyboard
                </h1>
                <p>
                  Student group project. <br></br>
                  Music-Theory-Keyboard is a web-based piano keyboard application that visually demonstrates
                  music theory principles such as scales, chords, and note relationships.
                  It aims to provide learners—whether beginners or intermediate musicians—with a fun and 
                  interactive way to understand music theory fundamentals by playing and exploring the keyboard,
                  as well as offer quick practice for veterans.
                  It features several lessons and interactive quizzes.<br></br>
                  Written using JavaScript with MIDI.js, HTML, CSS.<br></br>
                  Organized with Github and Scrum.<br></br>
                </p>
                <p>Try it here!
                  <a href="../MusicTheoryKeyboard/static/html/layout.html" target="_blank" rel="noopener noreferrer">
                     Music Theory Keyboard
                  </a>
                </p>
              </div>
            </div>
            <div className='project-card'>
              
              
              <div className='project-summary'>
                <h1>
                  SOR Renderer 
                </h1>
                <p>
                  A real-time 3D WebGL application that allows users to create and manipulate surfaces of rotation (SORs).
                  SORs are a vase-like object created by rotating a user-drawn line around a central axis.
                  Built originally for a university graphics course, this project explores various computer graphics concepts.
                  It features different lighting styles, specular effects, as well as object picking and manipulation.<br></br>
                  Written in JavaScript with cuon-matrix.js, and shaders written in WebGL. 
                </p>
                <p>Try it here! 
                  <a href="../SORRenderer/driver.html" target="_blank" rel="noopener noreferrer">
                     SOR Renderer
                  </a>
                </p>
              </div>
              <img src= '/images/SORSample.png'></img>
            </div>
           <div className='project-card'>
              
              <img src= '/images/me.jpg'></img>
              <div className='project-summary'>
                <h1>
                  Music Theory Keyboard
                </h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </div> 
          </div>
          <div className='bodyGap'></div>
          <div className="rightSide">
            
            <div className="sidebar">
             <iframe id="p5-visualizer" src="Visualizer/index.html" style={{ objectFit: 'contain' }}></iframe>
              {/* <img src='/images/mediaPlayerTemp.png'></img> */}
              <div className="sidebar-content">
                <p>AHHHHH</p>
              </div>
              
            </div>
          </div>
          <div className="footer"></div>
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