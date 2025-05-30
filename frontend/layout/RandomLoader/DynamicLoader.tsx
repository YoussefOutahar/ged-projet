import React, { useEffect, useRef } from 'react';
import { 
  grid, 
  ring, 
  helix, 
  orbit, 
  mirage, 
  bouncy, 
  spiral, 
  pulsar, 
  trefoil, 
  quantum, 
  infinity, 
  hourglass, 
  newtonsCradle, 
  jellyTriangle, 
} from 'ldrs';

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
type LoaderType = typeof loaderTypes[number];

interface LoaderProps {
  size?: number | string;
  color?: string;
  initialLoader: LoaderType;
}

const DynamicLoader: React.FC<LoaderProps> = ({ 
  size = "40", 
  color = "#123c69",
  initialLoader 
}) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      grid.register();
      ring.register();
      helix.register();
      orbit.register();
      bouncy.register();
      pulsar.register();
      spiral.register();
      mirage.register();
      quantum.register();
      trefoil.register();
      infinity.register();
      hourglass.register();
      newtonsCradle.register();
      jellyTriangle.register();
      initialized.current = true;
    }
  }, []);

  const loaderProps = { size, color };

  if (typeof window === 'undefined') return null;

  return (
    <div className="fixed inset-0 bg-opacity-90 z-50 flex justify-center items-center">
      {initialLoader === 'ring' && <l-ring {...loaderProps}></l-ring>}
      {initialLoader === 'orbit' && <l-orbit {...loaderProps}></l-orbit>}
      {initialLoader === 'bouncy' && <l-bouncy {...loaderProps}></l-bouncy>}
      {initialLoader === 'infinity' && <l-infinity {...loaderProps}></l-infinity>}
      {initialLoader === 'grid' && <l-grid {...loaderProps}></l-grid>}
      {initialLoader === 'helix' && <l-helix {...loaderProps}></l-helix>}
      {initialLoader === 'pulsar' && <l-pulsar {...loaderProps}></l-pulsar>}
      {initialLoader === 'spiral' && <l-spiral {...loaderProps}></l-spiral>}
      {initialLoader === 'mirage' && <l-mirage {...loaderProps}></l-mirage>}
      {initialLoader === 'quantum' && <l-quantum {...loaderProps}></l-quantum>}
      {initialLoader === 'trefoil' && <l-trefoil {...loaderProps}></l-trefoil>}
      {initialLoader === 'hourglass' && <l-hourglass {...loaderProps}></l-hourglass>}
      {initialLoader === 'newtonsCradle' && <l-newtons-cradle {...loaderProps}></l-newtons-cradle>}
      {initialLoader === 'jellyTriangle' && <l-jelly-triangle {...loaderProps}></l-jelly-triangle>}
    </div>
  );
};

export default DynamicLoader;