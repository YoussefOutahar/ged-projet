// RandomLoader.tsx
import React, { memo } from 'react';
import dynamic from 'next/dynamic';

const loaderTypes = [
  'grid', 
  'ring', 
  'helix', 
  'orbit', 
  'mirage', 
  'bouncy', 
  'spiral', 
  'pulsar', 
  'trefoil', 
  'quantum', 
  'infinity', 
  'hourglass', 
  'newtonsCradle', 
  'jellyTriangle',
] as const;

const getRandomLoader = () => {
  return loaderTypes[Math.floor(Math.random() * loaderTypes.length)];
};

const DynamicLoader = dynamic(() => import('./DynamicLoader'), {
  ssr: false,
  loading: () => null
});

interface RandomLoaderProps {
  loadingKey: number;
}

const RandomLoader = memo(({ loadingKey }: RandomLoaderProps) => {
  return <DynamicLoader initialLoader={getRandomLoader()} key={loadingKey} />;
});

RandomLoader.displayName = 'RandomLoader';

export default RandomLoader;