import Navbar from '../components/Designs/Navbar';
import { CreateToken } from '../components/CreateToken';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useRouter } from 'next/router';
import { FC } from 'react';
import Footer from '../components/Designs/Footer';

const CreateTokenPage: FC = () => {
    const router = useRouter();

    return (
        <div className='bg-slate-700 text-white min-h-screen'>
        <Navbar />

            <div className='flex justify-between items-center p-4'>
                <button 
                className='mt-6 text-white font-extrabold bg-purple-700 hover:bg-purple-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-purple- dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                onClick={() => router.push('/tokendata')}
                >
                    Search Your Token on Solana Blockchain
                </button>
                <WalletMultiButton />
            </div>

            <div className="w-1/2 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold p-4 rounded-lg shadow-lg">
                    <p className=" hover:text-yellow-300">
                        Use this Demo URI: 
                    </p>
                    <p className="text-yellow-300 hover:underline text-xl">
                        https://cdn.100xdevs.com/metadata.json
                    </p>
            </div>


            <CreateToken />

            <Footer />
        </div>
    );
};

export default CreateTokenPage;