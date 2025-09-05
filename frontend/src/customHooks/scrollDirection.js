import { useEffect, useState, useRef } from 'react';

const useScrollDirection = (threshold = 100) => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const lastScrollY = useRef(window.scrollY);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY.current) >= threshold) {
        const newDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
        setScrollDirection(newDirection);
        lastScrollY.current = currentScrollY;
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDir);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrollDirection;
};

export default useScrollDirection;
