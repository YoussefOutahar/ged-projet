import React from 'react';
import styles from './ParticleComponent.module.css';

interface ParticleComponentProps {
  size?: string;
  speed?: string;
  color?: string;
  style?: React.CSSProperties;
}

const ParticleComponent: React.FC<ParticleComponentProps> = ({
  size = '45',
  speed = '1.75',
  color = 'black',
  style = {},
}) => {
  const containerStyle = {
    '--uib-size': `${size}px`,
    '--uib-speed': `${speed}s`,
    '--uib-color': color,
    ...style
  } as React.CSSProperties;

  return (
    <div className={styles.container} style={containerStyle}>
      {[...Array(13)].map((_, i) => (
        <div key={i} className={styles.particle}></div>
      ))}
    </div>
  );
};

export default ParticleComponent;