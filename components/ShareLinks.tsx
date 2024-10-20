"use client"

import { FaTwitter, FaFacebook, FaLinkedin, FaShareAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ShareLinks({ url, title }: { url: string; title: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      className="flex justify-center items-center space-x-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg hover:shadow-xl p-4 rounded-full transition-shadow duration-300 ease-in-out"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <FaShareAlt className="mr-2 w-6 h-6 text-white" />
      <motion.a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-400 hover:bg-blue-500 p-3 rounded-full transform hover:scale-110 transition-all duration-300 ease-in-out"
        variants={itemVariants}
        whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
      >
        <FaTwitter className="w-6 h-6 text-white" />
      </motion.a>
      <motion.a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transform hover:scale-110 transition-all duration-300 ease-in-out"
        variants={itemVariants}
        whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
      >
        <FaFacebook className="w-6 h-6 text-white" />
      </motion.a>
      <motion.a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-800 hover:bg-blue-900 p-3 rounded-full transform hover:scale-110 transition-all duration-300 ease-in-out"
        variants={itemVariants}
        whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
      >
        <FaLinkedin className="w-6 h-6 text-white" />
      </motion.a>
    </motion.div>
  );
}
