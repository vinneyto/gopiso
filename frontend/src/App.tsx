import { Canvas } from '@react-three/fiber';
import { ARButton, Controllers, Hands, XR } from '@react-three/xr';
import './App.css';

export function App() {
  return (
    <>
      <ARButton />
      <Canvas>
        <XR>
          <Controllers />
          <Hands />
          <mesh>
            <boxGeometry />
            <meshBasicMaterial color="blue" />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
}
