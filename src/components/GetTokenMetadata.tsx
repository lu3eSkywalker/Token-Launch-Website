import React, { useState } from 'react'
import { Metaplex } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";
import { ENV, TokenListProvider } from "@solana/spl-token-registry";
import Image from 'next/image';

const GetTokenMetadata = () => {

    const [mintAddressToken, setMintAddressToken] = useState<string>('');

    //To Render
    const [tokenImage, setTokenImage] = useState<string>('');
    const [tokenName, setTokenName] = useState<string>('');
    const [tokenSymbol, setTokenSymbol] = useState<string>('');
    const [metadataURI, setMetaURI] = useState<string>('');

    const [dataAvailable, setDataAvailable] = useState<boolean>(false);

    const [imageAvailable, setImageAvailable] = useState<boolean>(false);

    async function getTokenMetadata() {
      const connection = new Connection("https://api.devnet.solana.com");
      const metaplex = Metaplex.make(connection);
    
    //   const mintAddress = new PublicKey("7P7FTcUnLKfrNobkmrU64uCoyg4nigVSJbEHqD8dVonp");
    const mintAddress = new PublicKey(mintAddressToken);
    
      let tokenName;
      let tokenSymbol;
      let tokenURI;
    
      const metadataAccount = metaplex
        .nfts()
        .pdas()
        .metadata({ mint: mintAddress });
    
        const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);
    
        if (metadataAccountInfo) {
              const token = await metaplex.nfts().findByMint({ mintAddress: mintAddress });
              tokenName = token.name;
              tokenSymbol = token.symbol;
              tokenURI = token.uri;

              setTokenName(tokenName)
              setTokenSymbol(tokenSymbol)
              setMetaURI(tokenURI)
              setDataAvailable(true);
      
        }
        else {
            const provider = await new TokenListProvider().resolve();
            const tokenList = provider.filterByChainId(ENV.Devnet).getList();
            console.log(tokenList)
            const tokenMap = tokenList.reduce((map, item) => {
              map.set(item.address, item);
              return map;
            }, new Map());
    
            const token = tokenMap.get(mintAddress.toBase58());
    
            // tokenName = token.name;
            // tokenSymbol = token.symbol;
            // tokenURI = token.uri;
        }

        console.log(tokenName)
        console.log(tokenSymbol)
        console.log(tokenURI)


        
    }

    const fetchLogo = async () => {
        try {
            const proxyUrl = 'https://api.allorigins.win/get?url=';
            const savedResponse = await fetch(proxyUrl + encodeURIComponent(metadataURI));
            if (!savedResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await savedResponse.json();
            // console.log(JSON.parse(data.image));
            console.log(JSON.parse(data.contents).image);
            setTokenImage(JSON.parse(data.contents).image);
            setImageAvailable(true);

        } catch (error) {
            console.error('Error fetching metadata:', error);
        }

    };

  return (
    <div className='bg-slate-700 text-white min-h-screen p-6'>
    <div className='text-center mb-6'>
        <h1 className='text-2xl font-bold'>Search Your Token on the Blockchain</h1>
    </div>

    <div className='flex flex-col items-center space-y-6'>
        <label className='text-lg font-medium'>Mint Address</label>
        <input 
            type='text'
            placeholder='Mint Address'
            className='text-black border border-gray-300 p-3 rounded-lg w-80 focus:outline-none focus:ring-2 focus:ring-blue-500'
            onChange={(e) => setMintAddressToken(e.target.value)}
        />
        
        <button 
            className='bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300'
            onClick={() => {
                getTokenMetadata();
                fetchLogo();
            }}
        >
            Get Token Information
        </button>

      {dataAvailable && 
      (<div className='text-center space-y-2'>
            <p className='text-lg'>Token Name: {tokenName}</p>
            <p className='text-lg'>Token Symbol: {tokenSymbol}</p>
            <p className='text-lg'>
                Token URI: <a href={metadataURI} className='text-blue-400 hover:underline'>{metadataURI}</a>
            </p>

            
            {imageAvailable ? (<p><Image src={tokenImage} alt='image' className='w-[150px] h-[150px] rounded-full object-cover mx-auto' /></p>): (<button className='bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300' onClick={() => fetchLogo()}>Fetch Logo Again</button>)}
        </div>
        )}


        <div className='text-center mt-6'>
        </div>
    </div>
</div>

  )
}

export default GetTokenMetadata