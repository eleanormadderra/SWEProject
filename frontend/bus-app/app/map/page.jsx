/**
 * Home component renders the main page of the application.
 * It displays a heading and the UGAthensBusStops component.
 *
 * @component
 * @example
 * return (
 *   <Home />
 * )
 */
// /pages/index.tsx
import UGAthensBusStops from '../components/UGAthensBusStops';

export default function Home() {
  return (
    <div>
      <h1>UGA Bus Stops Map</h1>
      <UGAthensBusStops />
    </div>
  );
}
