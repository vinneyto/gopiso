import { OrbitControls, Gltf } from '@react-three/drei';
import { Controllers, Hands, RayGrab } from '@react-three/xr';
import { Suspense, useEffect, useRef, useState } from 'react';
import { RoomPlanes } from '../RoomSpace';
import { Group, Matrix4, Vector3, Quaternion } from 'three';
import { useRoomSpace } from '../../hooks';

export function Scene() {
  const baseUrl = import.meta.env.BASE_URL;

  const gltfRef = useRef<Group>(null);
  const [gltfMatrix, setGltfMatrix] = useState(new Matrix4());

  const roomSpace = useRoomSpace();

  // load objects
  useEffect(() => {
    if (!roomSpace.originMatrix) {
      return;
    }

    const matrix = loadMatrixFromLocalStorage('gltf_matrix');
    if (matrix) {
      setGltfMatrix(
        new Matrix4().multiplyMatrices(roomSpace.originMatrix, matrix)
      );
    }
  }, [roomSpace]);

  // save transform
  const onSelectGltfEnd = () => {
    if (!gltfRef.current || !roomSpace.originMatrixInverse) {
      return;
    }

    const relativeMatrix = roomSpace.originMatrixInverse
      .clone()
      .multiply(gltfRef.current.matrixWorld);

    saveMatrixToLocalStorage('gltf_matrix', relativeMatrix);
  };

  const gltfPosition = new Vector3();
  const gltfQuaternion = new Quaternion();
  gltfMatrix.decompose(gltfPosition, gltfQuaternion, new Vector3());

  return (
    <>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Controllers />
      <Hands />
      <OrbitControls />

      <RoomPlanes planes={roomSpace.planes} />

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

      <group matrix={roomSpace.originMatrix} matrixAutoUpdate={false}>
        <axesHelper />
      </group>

      <mesh>
        <meshBasicMaterial color={'red'} />
        <sphereGeometry args={[0.2, 32, 32]} />
      </mesh>
    </>
  );
}

function saveMatrixToLocalStorage(key: string, matrix: Matrix4): void {
  const matrixArray = matrix.toArray();
  const matrixString = JSON.stringify(matrixArray);
  localStorage.setItem(key, matrixString);
}

function loadMatrixFromLocalStorage(key: string): Matrix4 | null {
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
