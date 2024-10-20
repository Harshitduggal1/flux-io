"use client"

import { useState, useEffect } from 'react';

function ScrollTracker() {
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = window.scrollY;
      const windowHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;
      const scrolled = (totalScroll / windowHeight) * 100;
      setScroll(scrolled);
    };

    // Initial call to set the initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="top-0 left-0 z-50 fixed bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 h-4"
      style={{ width: `${scroll}%` }}
    />
  );
}

export default ScrollTracker;
