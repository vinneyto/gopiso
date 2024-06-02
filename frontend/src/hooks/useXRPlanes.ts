import { useThree } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { Matrix4 } from 'three';
import { v4 } from 'uuid';

export interface PlaneDescriptor {
  id: string;
  width: number;
  height: number;
  matrix: number[];
  orientation: 'horizontal' | 'vertical';
}

export function useXRPlanes() {
  const { xr } = useThree((state) => state.gl);

  const [planesList, setPlanesList] = useState<PlaneDescriptor[]>([]);

  useEffect(() => {
    const matrix = new Matrix4();
    const currentPlanes = new Map<XRPlane, PlaneDescriptor>();

    let planeschanged = false;

    function onPlanes(event: { data: unknown }) {
      const frame = event.data as XRFrame;
      const planes = frame.detectedPlanes;

      if (!planes) {
        return;
      }

      for (const [plane] of currentPlanes) {
        if (planes.has(plane) === false) {
          currentPlanes.delete(plane);

          planeschanged = true;
        }
      }

      const referenceSpace = xr.getReferenceSpace();

      if (!referenceSpace) {
        return;
      }

      for (const plane of planes) {
        if (currentPlanes.has(plane) === false) {
          const pose = frame.getPose(plane.planeSpace, referenceSpace);
          if (!pose) {
            continue;
          }

          matrix.fromArray(pose.transform.matrix);

          const polygon = plane.polygon;

          let minX = Number.MAX_SAFE_INTEGER;
          let maxX = Number.MIN_SAFE_INTEGER;
          let minZ = Number.MAX_SAFE_INTEGER;
          let maxZ = Number.MIN_SAFE_INTEGER;

          for (const point of polygon) {
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            minZ = Math.min(minZ, point.z);
            maxZ = Math.max(maxZ, point.z);
          }

          const width = maxX - minX;
          const height = maxZ - minZ;

          // const geometry = new BoxGeometry(width, 0.01, height);
          // const material = new MeshBasicMaterial({
          //   color: 0xffffff * Math.random(),
          //   transparent: true,
          //   opacity: 0.5,
          // });

          // const mesh = new Mesh(geometry, material);
          // mesh.position.setFromMatrixPosition(matrix);
          // mesh.quaternion.setFromRotationMatrix(matrix);

          currentPlanes.set(plane, {
            id: v4(),
            width,
            height,
            matrix: [...matrix.elements],
            orientation: plane.orientation,
          });

          planeschanged = true;
        }
      }

      if (planeschanged) {
        planeschanged = false;

        setPlanesList(
          [...currentPlanes.values()].map((mesh) => ({
            ...mesh,
            matrix: [...mesh.matrix],
          }))
        );
      }
    }

    xr.addEventListener('planesdetected', onPlanes);

    return () => {
      xr.removeEventListener('planesdetected', onPlanes);
    };
  }, [xr]);

  return planesList;
}
