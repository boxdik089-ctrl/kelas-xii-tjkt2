import { CLASS_DATA } from '@/data/classData';
import Win98DesktopApp from '@/components/Win98DesktopApp';

export default function HomePage() {
  return <Win98DesktopApp data={CLASS_DATA} initialServerNow={Date.now()} />;
}
