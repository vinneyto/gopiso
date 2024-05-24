import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

export function XRPlanes() {
  const { xr } = useThree((state) => state.gl);

  useEffect(() => {
    function onPlanes(event: { data: XRPlaneSet }) {
      console.log(event);
    }

    xr.addEventListener('planesdetected', onPlanes);

    return () => {
      xr.removeEventListener('planesdetected', onPlanes);
    };
  }, [xr]);

  return null;
}
