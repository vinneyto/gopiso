import { useEffect, useState } from 'react';
import { PlaneDescriptor, useXRPlanes } from './useXRPlanes';
import { Matrix4, Quaternion, Vector3 } from 'three';

interface RoomSpace {
  planes: PlaneDescriptor[];
  originMatrix?: Matrix4;
  originMatrixInverse?: Matrix4;
}

export function useRoomSpace() {
  const [roomSpace, setRoomSpace] = useState<RoomSpace>({
    planes: [],
  });

  const planes = useXRPlanes();

  useEffect(() => {
    let originMatrix = findMaxFloorPlaneTransform(planes);

    if (originMatrix) {
      const basisX = new Vector3();
      const basisY = new Vector3();
      const basisZ = new Vector3();

      originMatrix.extractBasis(basisX, basisY, basisZ);

      if (basisY.y < 0) {
        basisY.negate();

        const correctedMatrix = new Matrix4();
        correctedMatrix.makeBasis(basisX, basisY, basisZ);

        const position = new Vector3();
        originMatrix.decompose(position, new Quaternion(), new Vector3());
        correctedMatrix.setPosition(position);

        originMatrix = correctedMatrix;
      }
    }

    setRoomSpace({
      planes,
      originMatrix,
      originMatrixInverse: originMatrix?.clone().invert(),
    });
  }, [planes]);

  return roomSpace;
}

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

  // find max plane
  horisontalPlanes.sort((a, b) => {
    const aHeight = getPosition(toMatrix(a.matrix)).y;
    const bHeight = getPosition(toMatrix(b.matrix)).y;

    if (Math.abs(a.height - b.height) > 0.01) {
      return aHeight - bHeight;
    } else {
      const aArea = a.width * a.height;
      const bArea = b.width * b.height;
      return bArea - aArea;
    }
  });

  return toMatrix(horisontalPlanes[0].matrix);
}
