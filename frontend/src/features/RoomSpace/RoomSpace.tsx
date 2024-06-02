import { useDispatch, useSelector } from 'react-redux';
import { PlaneDescriptor, useXRPlanes } from '../../hooks';
import { RootState } from '../../store';
import React, { ReactNode, forwardRef, useEffect } from 'react';
import { setPlanes } from '../../slices';
import { DoubleSide, Group, Matrix4, Quaternion, Vector3 } from 'three';
import { ThreeElements } from '@react-three/fiber';

export interface RoomSpaceProps {
  debugPlanes?: boolean;
  children?: ReactNode;
  innerRef?: React.Ref<Group>;
}

export const RoomSpace = forwardRef<ThreeElements['group'], RoomSpaceProps>(
  ({ children, innerRef }: RoomSpaceProps) => {
    const roomPlanes = useSelector<RootState>(
      (state) => state.roomPlanes.planes
    ) as PlaneDescriptor[];

    const dispatch = useDispatch();

    const planes = useXRPlanes();

    useEffect(() => {
      dispatch(setPlanes(planes));
    }, [planes, dispatch]);

    const roomMatrix = findMaxFloorPlaneTransform(planes);

    if (roomMatrix) {
      const normal = new Vector3();
      normal.setFromMatrixColumn(roomMatrix, 2);
      normal.normalize();
      if (normal.y < 0) {
        // invert y
        roomMatrix.elements[4] *= -1;
        roomMatrix.elements[5] *= -1;
        roomMatrix.elements[6] *= -1;
      }
    }

    if (!roomMatrix) {
      return null;
    }

    return (
      <group>
        {roomPlanes.map((plane) => (
          <mesh key={plane.id} matrix={plane.matrix} matrixAutoUpdate={false}>
            <boxGeometry args={[plane.width, 0.01, plane.height]} />
            <meshBasicMaterial
              color={0xffffff * Math.random()}
              opacity={0.2}
              transparent={true}
              side={DoubleSide}
            />
          </mesh>
        ))}
        <group
          ref={innerRef}
          matrix={roomMatrix?.elements}
          matrixAutoUpdate={false}
        >
          {children}
        </group>
      </group>
    );
  }
);

function getPosition(matrix: Matrix4) {
  const position = new Vector3();
  matrix.decompose(position, new Quaternion(), new Vector3());

  return position;
}

function toMatrix(data: number[]) {
  return new Matrix4().fromArray(data);
}

function findMaxFloorPlaneTransform(planes: PlaneDescriptor[]) {
  const horisontalPlanes = planes.filter((p) => p.orientation === 'horizontal');

  if (horisontalPlanes.length === 0) {
    return undefined;
  }

  const findLowestY = (planes: PlaneDescriptor[]) => {
    let lowetsY = 1000;

    for (const plane of planes) {
      const pos = getPosition(toMatrix(plane.matrix));
      if (pos.y < lowetsY) {
        lowetsY = pos.y;
      }
    }
    return lowetsY;
  };

  const lowestY = findLowestY(horisontalPlanes);

  // planes close to floor
  const floorPlanes = horisontalPlanes.filter(
    (p) => Math.abs(getPosition(toMatrix(p.matrix)).y - lowestY) < 0.5
  );

  // find max plane
  floorPlanes.sort((a, b) => {
    const aSize = a.width * a.height;
    const bSize = b.width * b.height;
    return bSize - aSize;
  });

  return toMatrix(floorPlanes[0].matrix);
}
