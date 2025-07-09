import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AboutMeOverlay.css';

interface AboutMeOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutMeOverlay: React.FC<AboutMeOverlayProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            className="about-me-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // Allows closing by clicking the background
          />
          
          {/* in and out animations */}
          <motion.div
            className="about-me-container"
            initial={{ scale: 0.0, opacity: 1, x: "-50%", y: "-50%" }}
            animate={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
            exit={{ scale: 0.0, opacity: 1, x: "-50%", y: "-50%" }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* content */}
            <button className="about-me-close-button" onClick={onClose}>x</button>
            <img src="/images/me.jpg" alt="A picture of John Beardwood" className="about-me-image" />
            <div className="about-me-content">
              <h2>About Me</h2>
              <p>
                Hello! I'm John, a developer who is passionate about creating elegant and effective user experiences. I love the challenge of blending aesthetic design with robust technical solutions.
              </p>
              <p>
                When I'm not coding, you can find me exploring new technologies, working on personal creative projects, or enjoying the outdoors. Thanks for visiting my portfolio!
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AboutMeOverlay;