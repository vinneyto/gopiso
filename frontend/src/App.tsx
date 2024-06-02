import { Canvas } from '@react-three/fiber';
import { ARButton, Controllers, Hands, RayGrab, XR } from '@react-three/xr';
import { RoomSpace } from './features';
import { Gltf, OrbitControls } from '@react-three/drei';
import './App.css';
import { Suspense, useEffect, useRef, useState } from 'react';
import { Group, Matrix4, Quaternion, Vector3 } from 'three';

export function App() {
  const baseUrl = import.meta.env.BASE_URL;

  const roomSpaceGroupRef = useRef<Group>(null);
  const gltfRef = useRef<Group>(null);

  const [gltfMatrix, setGltfMatrix] = useState(new Matrix4());

  useEffect(() => {
    const matrix = loadMatrixFromLocalStorage('gltf_matrix');
    if (matrix) {
      setGltfMatrix(matrix);
    }
  }, []);

  const onSelectGltfEnd = () => {
    if (!gltfRef.current || !roomSpaceGroupRef.current) {
      return;
    }

    const relativeMatrix = roomSpaceGroupRef.current.matrixWorld
      .clone()
      .invert()
      .multiply(gltfRef.current.matrixWorld);

    console.log(relativeMatrix);

    saveMatrixToLocalStorage('gltf_matrix', relativeMatrix);
  };

  const gltfPosition = new Vector3();
  const gltfQuaternion = new Quaternion();
  gltfMatrix.decompose(gltfPosition, gltfQuaternion, new Vector3());

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
          <OrbitControls />

          <RoomSpace innerRef={roomSpaceGroupRef}>
            <Suspense>
              <RayGrab onSelectEnd={onSelectGltfEnd}>
                <Gltf
                  ref={gltfRef}
                  src={`${baseUrl}shelf.glb`}
                  position={gltfPosition}
                  quaternion={gltfQuaternion}
                  scale={[0.3, 0.3, 0.3]}
                />
              </RayGrab>
            </Suspense>
          </RoomSpace>

          <mesh>
            <meshBasicMaterial color={'red'} />
            <sphereGeometry args={[0.2, 32, 32]} />
          </mesh>
        </XR>
      </Canvas>
    </>
  );
}

function saveMatrixToLocalStorage(key: string, matrix: Matrix4): void {
  const matrixArray = matrix.toArray();
  const matrixString = JSON.stringify(matrixArray);
  localStorage.setItem(key, matrixString);
}

export function loadMatrixFromLocalStorage(key: string): Matrix4 | null {
  const matrixString = localStorage.getItem(key);
  if (!matrixString) {
    return null;
  }

  try {
    const matrixArray = JSON.parse(matrixString);
    if (Array.isArray(matrixArray) && matrixArray.length === 16) {
      const matrix = new Matrix4();
      matrix.fromArray(matrixArray);
      return matrix;
    } else {
      console.error('Invalid matrix data');
      return null;
    }
  } catch (error) {
    console.error('Failed to parse matrix data:', error);
    return null;
  }
}
