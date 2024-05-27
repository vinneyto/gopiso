import { Canvas } from '@react-three/fiber';
import { ARButton, Controllers, Hands, XR } from '@react-three/xr';
import { XRPlanes } from './atoms';
import './App.css';

export function App() {
  return (
    <>
      <ARButton sessionInit={{ optionalFeatures: ['plane-detection'] }} />
      <Canvas>
        <XR>
          <Controllers />
          <Hands />
          <XRPlanes />
          <mesh>
            <boxGeometry />
            <meshBasicMaterial color="blue" />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
}
