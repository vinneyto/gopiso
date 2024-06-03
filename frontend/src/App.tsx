import { Canvas } from '@react-three/fiber';
import { ARButton, XR } from '@react-three/xr';
import { Scene } from './features/Scene';
import './App.css';

export function App() {
  return (
    <>
      <ARButton sessionInit={{ optionalFeatures: ['plane-detection'] }} />
      <Canvas>
        <XR>
          <Scene />
        </XR>
      </Canvas>
    </>
  );
}
