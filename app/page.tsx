import Image from 'next/image';

import { ScrollProgress } from '@/components/ui/scroll';
import { Skiper26 } from '@/components/ui/skiper-ui/skiper26';

export default function Home() {
    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
            <Skiper26 />
            <ScrollProgress />
        </div>
    );
}
