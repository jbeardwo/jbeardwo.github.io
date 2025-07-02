import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Header.css';

interface HeaderProps {
  shouldAnimateFanOut?: boolean; // Optional prop to control the fanning animation
}

function Header({ shouldAnimateFanOut = false }: HeaderProps) {
  const [animateIcons, setAnimateIcons] = useState(false);

  useEffect(() => {
    const iconTimer = setTimeout(() => {
        setAnimateIcons(true);
    },900);

    return () => {
        clearTimeout(iconTimer);
      };
  }, [shouldAnimateFanOut]);

  //states for icons' hover text
  const hoverTextVariants = {
    rest: { opacity: 0, y: -5, transition: { duration: 0.2, ease: "easeOut" } },
    hover: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };

  const ovalContainerProps = shouldAnimateFanOut
    ? {
        initial: { width: 45, x: -3 },
        animate: animateIcons ? { width: 199, x: "-3px" } : undefined,
        transition: { type: "spring", duration: .5, bounce: 0 }
      }
    : {
        initial: { width: 199, x: -3 },
      };

    const getIconProps = (initialXOffset: string) => {
        return shouldAnimateFanOut
        ? {
            initial: { x: initialXOffset },
            animate: animateIcons ? { x: "0px" } : undefined,
            transition: { // ADD bounce: 0 HERE
                type: "spring",
                stiffness: 200,
                damping: 15,
                bounce: 0 // <--- ADDED THIS LINE previously!
            }
          }
        : {
            initial: { x: "0px" },
            };
    };

  // ADD THE 'return' STATEMENT HERE:
  return (
    <motion.div
      className="page-header"
      // animate={isTechnicalClicked ? {left:"100%", x:"-105%"}
      //          : isCreativeClicked ? {left: "0%", x:"+10%"}
      //          : {left:"50%", x:"-50%"}}
      // transition={{ type: "spring", duration: .5, bounce: 0 }}
    >
      <motion.div
        className="oval-container"
        {...ovalContainerProps}
      >

        {/* portrait */}
        <motion.div
          className="icon-hover-wrapper portrait-description"
          whileHover="hover"
          initial="rest"
        >
          <motion.img src="/images/me-square.jpg"
            className="icon portrait"
            {...getIconProps("72px")}
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
              {...getIconProps("24px")}
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
              {...getIconProps("-24px")}
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
              {...getIconProps("-72px")}
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
  ); // CLOSE THE 'return' STATEMENT
}

export default Header;