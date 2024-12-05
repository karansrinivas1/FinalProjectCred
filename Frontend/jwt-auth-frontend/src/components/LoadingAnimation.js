// src/components/LoadingAnimation.js
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import "../components/LoadingAnimation.css"; // For optional styles

const LoadingAnimation = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3000); // Duration of the animation in milliseconds

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="loading-container"
        >
            {/* Add your animation visuals here */}
            <motion.div
                className="circle"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="loading-text"
            >
                Welcome to Cred
            </motion.h1>
        </motion.div>
    );
};

export default LoadingAnimation;
