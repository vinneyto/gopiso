import { useThree } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { Group, Matrix4, Mesh, BoxGeometry, MeshBasicMaterial } from 'three';

export function useXRPlanes() {
  const { xr } = useThree((state) => state.gl);

  const [planesContainer, setPlanesContainer] = useState(new Group());

  useEffect(() => {
    const matrix = new Matrix4();
    const currentPlanes = new Map<XRPlane, Mesh>();
    const container = new Group();

    let planeschanged = false;

    function onPlanes(event: { data: unknown }) {
      const frame = event.data as XRFrame;
      const planes = frame.detectedPlanes;

      if (!planes) {
        return;
      }

      for (const [plane, mesh] of currentPlanes) {
        if (planes.has(plane) === false) {
          mesh.geometry.dispose();
          // @ts-expect-error single material
          mesh.material.dispose();
          container.remove(mesh);
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

          const geometry = new BoxGeometry(width, 0.01, height);
          const material = new MeshBasicMaterial({
            color: 0xffffff * Math.random(),
            transparent: true,
            opacity: 0.5,
          });

          const mesh = new Mesh(geometry, material);
          mesh.position.setFromMatrixPosition(matrix);
          mesh.quaternion.setFromRotationMatrix(matrix);
          container.add(mesh);

          currentPlanes.set(plane, mesh);

          planeschanged = true;
        }
      }

      if (planeschanged) {
        planeschanged = false;

        setPlanesContainer(container.clone());
      }
    }

    xr.addEventListener('planesdetected', onPlanes);

    return () => {
      xr.removeEventListener('planesdetected', onPlanes);
    };
  }, [xr]);

  return planesContainer;
}
