import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    '/images/B&W-noise-combined.png',
    '/images/color-noise-combined.png',
    '/images/MusicTheorySample.png',
    '/images/SORSample.png',
  ];

  const noiseSlideshow = [

    '/images/noise/animal-fur.png',
    '/images/noise/dahlia.png',
    '/images/noise/fraud-phsyics.png',
    '/images/noise/fraud.png',
    '/images/noise/meat.png',
    '/images/noise/ocean.png',
    '/images/noise/overcrowd.png',
    '/images/noise/pond.png'
  ];

  const keyboardSlideshow = [

    '/images/keyboard/note-quiz.png',
    '/images/keyboard/scale-lesson.png',
    '/images/keyboard/scale-quiz.png'
  ];

  const SORSlideshow = [


    '/images/SORs/beyblade.png',
    '/images/SORs/speaker.png',
    '/images/SORs/stack.png'
  ]

  const sendCanvasOffset = () => {
    const iframe = document.getElementById('p5-visualizer') as HTMLIFrameElement | null;
    if (iframe && iframe.contentWindow) {
      const rect = iframe.getBoundingClientRect();
      return {
        offsetX: rect.left,
        offsetY: rect.top
      };
    }
    return null;
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      const iframe = document.getElementById('p5-visualizer') as HTMLIFrameElement | null;
      if (iframe && iframe.contentWindow) {
        const offset = sendCanvasOffset();
        if (offset) {
          iframe.contentWindow.postMessage({
            type: 'canvasOffset',
            offsetX: offset.offsetX,
            offsetY: offset.offsetY
          }, '*');
        }
      }
    };

    window.addEventListener('resize', handleResize);

    const timer = setTimeout(() => {
      handleResize();
    }, 100);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const iframe = document.getElementById('p5-visualizer') as HTMLIFrameElement | null;
    if (iframe && iframe.contentWindow) {
      // Send canvas offset with every mouse move to ensure it's always current
      const offset = sendCanvasOffset();

      iframe.contentWindow.postMessage({
        type: 'mouseMove',
        x: mousePos.x,
        y: mousePos.y,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight
      }, '*');

      if (offset) {
        iframe.contentWindow.postMessage({
          type: 'canvasOffset',
          offsetX: offset.offsetX,
          offsetY: offset.offsetY
        }, '*');
      }
    }
  }, [mousePos]);

  const handleIframeLoad = () => {
    setTimeout(() => {
      const iframe = document.getElementById('p5-visualizer') as HTMLIFrameElement | null;
      if (iframe && iframe.contentWindow) {
        const offset = sendCanvasOffset();
        if (offset) {
          iframe.contentWindow.postMessage({
            type: 'canvasOffset',
            offsetX: offset.offsetX,
            offsetY: offset.offsetY
          }, '*');
        }
      }
    }, 100);
  };




  return (
    <>
      <motion.div
        className="technical-intro-text"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: '-100vh', opacity: 1 }}
        transition={{ duration: 0.75, delay: 0.5 }}
      >
        <div className="half-content left-content">
          <h2>Technical</h2>
          <p></p>
        </div>
      </motion.div>

      <AboutMeOverlay isOpen={isAboutMeOpen} onClose={() => setIsAboutMeOpen(false)} />

      <motion.div className="technical-view full-screen-view"
        initial={{ opacity: 1 }}
        animate={isHomeClicked ? { opacity: 0 }
          : { opacity: 1 }}
        transition={{ duration: 0.5 }}
      >

        <section className="layout">
          <div className='page-top'>

            <div
              className='header-container'
            >
              <Header shouldAnimateFanOut={false} onPortraitClick={() => setIsAboutMeOpen(true)} />
            </div>

          </div>
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

              <div className='project-summary'>
                <h1>
                  Perlin Noise Painter
                </h1>
                <p>
                  P5 project that allows users to create images using Perlin noise fields.<br />
                  Particles are organized into Sets which have many parameters that can be user defined including
                  number of particles, size, color, method of movement, shape, and more.
                  Features physics based movement using acceleration to sling the particles around, as well as direct-driven movement,
                  which inches the particles forward directly by the noise value.
                  Primarily made with p5.js, but built the interface using CSS and JS.<br />
                  Heavily inspired by
                  <a href='https://thecodingtrain.com/challenges/24-perlin-noise-flow-field' target="_blank" rel="noopener noreferrer">Coding Train Challenge #24</a>and
                  <a href='https://sighack.com/post/getting-creative-with-perlin-noise-fields' target="_blank" rel="noopener noreferrer">this article</a>
                  from SigHack<br /><br />
                  Try it here!
                  <a href="/PerlinNoisePainter/index.html" target="_blank" rel="noopener noreferrer">
                    Perlin Noise Painter
                  </a>
                </p>
              </div>
              <Slideshow images={noiseSlideshow} interval={5000} />
            </div>
            <div className='project-card'>

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
                  <a href="/MusicTheoryKeyboard/static/html/layout.html" target="_blank" rel="noopener noreferrer">
                    Music Theory Keyboard
                  </a>
                </p>
              </div>
              <Slideshow images={keyboardSlideshow} interval={5000} />


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
                  <a href="/SORRenderer/driver.html" target="_blank" rel="noopener noreferrer">
                    SOR Renderer
                  </a>
                </p>
              </div>
              <Slideshow images={SORSlideshow} interval={5000} />
            </div>
          </div>
          <div className="side">

            <div className="sidebar">
              <iframe
                id="p5-visualizer"
                src="/Visualizer/index.html"
                style={{ objectFit: 'contain' }}
                onLoad={handleIframeLoad}
              ></iframe>
              {/* <img src='/images/mediaPlayerTemp.png'></img> */}
              <div className="sidebar-content">
                <h1>Extras</h1>
                <details>
                  <summary>AI</summary>
                  <p>
                    <a href='https://huggingface.co/jbeardwo' target="_blank" rel="noopener noreferrer"> - HuggingFace Space</a><br />
                    <a href='https://www.kaggle.com/johnbeardwood' target="_blank" rel="noopener noreferrer">- Kaggle Profile</a>
                  </p>
                </details>
                <details>
                  <summary>Coding Art</summary>
                  <p>
                    <a href='https://editor.p5js.org/jbeardwo/collections' target="_blank" rel="noopener noreferrer"> - P5.js Collections</a><br />
                  </p>
                </details>
              </div>


            </div>
          </div>

          <div className='page-bot'>

            <div className="signature">
              John Beardwood
            </div>
            <motion.img src="/home-heart-fill.svg"
              className="home-button"
              initial={{ bottom: "-100px" }}
              animate={{ bottom: "5px" }}
              transition={{ duration: 0.5, delay: 0.5 }}
              onClick={handleHomeClick}
            ></motion.img>
          </div>
        </section>



      </motion.div>

    </>
  );
}

export default TechnicalView;
