import { useXRPlanes } from '../hooks';

export function XRPlanes() {
  const planes = useXRPlanes();

  return <primitive object={planes} />;
}
