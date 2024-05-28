import { useDispatch, useSelector } from 'react-redux';
import { PlaneDescriptor, useXRPlanes } from '../../hooks';
import { RootState } from '../../store';
import { useEffect } from 'react';
import { setPlanes } from '../../slices';

export function RoomPlanes() {
  const roomPlanes = useSelector<RootState>(
    (state) => state.roomPlanes.planes
  ) as PlaneDescriptor[];

  const dispatch = useDispatch();

  const planes = useXRPlanes();

  useEffect(() => {
    dispatch(setPlanes(planes));
  }, [planes, dispatch]);

  return (
    <group>
      {roomPlanes.map((plane) => (
        <mesh key={plane.id} matrix={plane.matrix} matrixAutoUpdate={false}>
          <boxGeometry args={[plane.width, 0.01, plane.height]} />
          <meshBasicMaterial
            color={0xffffff * Math.random()}
            opacity={0.5}
            transparent={true}
            depthWrite={true}
          />
        </mesh>
      ))}
    </group>
  );
}
