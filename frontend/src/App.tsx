import { Canvas } from '@react-three/fiber';
import { ARButton, Controllers, Hands, RayGrab, XR } from '@react-three/xr';
import { RoomPlanes } from './features';
import { Gltf } from '@react-three/drei';
import './App.css';

export function App() {
  return (
    <>
      <ARButton sessionInit={{ optionalFeatures: ['plane-detection'] }} />
      <Canvas>
        <XR>
          <ambientLight intensity={Math.PI / 2} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            decay={0}
            intensity={Math.PI}
          />
          <pointLight
            position={[-10, -10, -10]}
            decay={0}
            intensity={Math.PI}
          />
          <Controllers />
          <Hands />
          <RoomPlanes />
          <RayGrab>
            <Gltf src="/shelf.glb" scale={[0.3, 0.3, 0.3]} />
          </RayGrab>
        </XR>
      </Canvas>
    </>
  );
}
