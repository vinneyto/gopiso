import { PlaneDescriptor } from '../../hooks';
import { DoubleSide } from 'three';

export interface RoomSpaceProps {
  planes: PlaneDescriptor[];
}

export const RoomPlanes = ({ planes }: RoomSpaceProps) => {
  return (
    <group>
      {planes.map((plane) => (
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
    </group>
  );
};
