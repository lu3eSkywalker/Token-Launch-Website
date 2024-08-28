import { useRouter } from 'next/router';
import React from 'react';
import Image from 'next/image';

const Navbar = () => {

  const router = useRouter();
  return (
    <nav className="bg-gray-800">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-shrink-0 items-center absolute left-0 pl-6">

            <button onClick={() => router.push('/create-token')}><Image alt='image' src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXMw4BPBYmGXV2BF5Hhoxr8m3pMRLG_1iJsg&s' className='h-10' /></button>
            
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-6">
            <a
              href="#"
              className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              aria-current="page"
            >
              Airdrop
            </a>
          </div>
        </div>
    </nav>
  );
};

export default Navbar;