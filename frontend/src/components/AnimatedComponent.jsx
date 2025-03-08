// filepath: /Users/vishal/Documents/personal-finance-manager/frontend/src/components/AnimatedComponent.jsx
import React from 'react';
import { useSpring, animated } from 'react-spring';

const AnimatedComponent = ({ children }) => {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: { duration: 500 },
  });

  return <animated.div style={props}>{children}</animated.div>;
};

export default AnimatedComponent;