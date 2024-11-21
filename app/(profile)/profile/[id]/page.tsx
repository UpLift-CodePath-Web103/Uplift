import VirtualHugs from '@/components/VirtualHugs';
import RandomAffirmation from '@/components/RandomAffirmation';

export default function ProfilePage() {
  return (
    <div className='p-6 space-y-6'>
      <RandomAffirmation />
      <VirtualHugs />
    </div>
  );
}
