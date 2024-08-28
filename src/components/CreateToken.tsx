import { FC, useCallback, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import {
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    getMinimumBalanceForRentExemptMint,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createMintToInstruction
} from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction, PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import MintedToken from './MintedToken';

export const CreateToken: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const [tokenName, setTokenName] = useState<string>('');
    const [metadata, setMetadata] = useState<string>('');
    const [symbol, setSymbol] = useState<string>('');
    const [decimals, setDecimals] = useState<number>();

    const [mintAddress, setMintAddress] = useState<string>('');
    const [associatedToken, setAssociatedToken] = useState<string>('');
    const [metadataToSend, setMetadataToSend] = useState<string>('');

    const [toShowTokenResult, setToShowTokenResult] = useState<boolean>(false);

    const [amount, setAmount] = useState<number>();

    // const amount = 100;

    const onClick = useCallback(async (data) => {
        if (!publicKey) {
            console.error('Wallet not connected');
            return;
        }

        console.log('Generating mint keypair...');
        const mintKeypair = Keypair.generate();
        console.log('Mint keypair generated:', mintKeypair.publicKey.toBase58());

        const lamports = await getMinimumBalanceForRentExemptMint(connection);
        console.log('Lamports needed for rent exemption:', lamports);

        const tokenATA = await getAssociatedTokenAddress(mintKeypair.publicKey, publicKey);
        console.log('Associated Token Account:', tokenATA.toBase58());

        const createMetadataInstruction = createCreateMetadataAccountV3Instruction(
            {
                metadata: PublicKey.findProgramAddressSync(
                    [
                        Buffer.from("metadata"),
                        PROGRAM_ID.toBuffer(),
                        mintKeypair.publicKey.toBuffer(),
                    ],
                    PROGRAM_ID,
                )[0],
                mint: mintKeypair.publicKey,
                mintAuthority: publicKey,
                payer: publicKey,
                updateAuthority: publicKey
            },
            {
                createMetadataAccountArgsV3: {
                    data: {
                        name: data.tokenName,
                        symbol: data.symbol,
                        uri: data.metadata,
                        creators: null,
                        sellerFeeBasisPoints: 0,
                        uses: null,
                        collection: null,
                    },
                    isMutable: false,
                    collectionDetails: null,
                },
            },
        );

        const createNewTokenTransaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports: lamports,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMintInstruction(
                mintKeypair.publicKey,
                data.decimals,
                publicKey,
                publicKey,
                TOKEN_PROGRAM_ID
            ),
            createAssociatedTokenAccountInstruction(
                publicKey,
                tokenATA,
                publicKey,
                mintKeypair.publicKey,
            ),
            createMintToInstruction(
                mintKeypair.publicKey,
                tokenATA,
                publicKey,
                data.amount * Math.pow(10, data.decimals),
            ),
            createMetadataInstruction
        );

        console.log('Transaction created, sending...');

        try {
            const signature = await sendTransaction(createNewTokenTransaction, connection, { signers: [mintKeypair] });
            console.log('Transaction sent:', signature);

            console.log('Mint created:', mintKeypair.publicKey.toBase58());
            setMintAddress(mintKeypair.publicKey.toBase58())
            console.log('Token Account created:', tokenATA.toBase58());
            setAssociatedToken(tokenATA.toBase58());
            console.log('Metadata account created for mint:', mintKeypair.publicKey.toBase58());
            setMetadataToSend(mintKeypair.publicKey.toBase58());
            setToShowTokenResult(true);
        } catch (error) {
            console.error('Transaction failed:', error);
        }
    }, [publicKey, connection, sendTransaction]);


    return (
        <div>

            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <div>
                <div className='flex flex-col items-center space-y-4'>
                    <input 
                        type='text'
                        placeholder='Token Name'
                        className='border text-black border-gray-300 p-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={(e) => setTokenName(e.target.value)}
                    />

                    <input 
                        type='text'
                        placeholder='Symbol'
                        className='border text-black border-gray-300 p-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={(e) => setSymbol(e.target.value)}
                    />

                    <input 
                        type='text'
                        placeholder='URI'
                        className='border text-black border-gray-300 p-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={(e) => setMetadata(e.target.value)}
                    />

                    <input 
                        type='text'
                        placeholder='No. to Token to mint'
                        className='border text-black border-gray-300 p-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={(e) => setAmount(Number(e.target.value))}
                    />

                    <input 
                        type='number'
                        placeholder='Decimals'
                        className='border text-black border-gray-300 p-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500'
                        onChange={(e) => setDecimals(Number(e.target.value))}
                    />
                    <br></br>

            <button 
                  className='mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
                onClick={() => onClick({decimals: Number(decimals), amount: Number(amount), metadata: metadata, symbol: symbol, tokenName: tokenName})}>
                CreateToken
            </button>

            {toShowTokenResult && (<MintedToken mintAddress={mintAddress} associatedToken={associatedToken} metadataToSend={metadataToSend} />)}
                    </div>

            </div>
        </div>
    )
};