import React, { useState, useEffect } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
} from "@project-serum/anchor";

const programId = new PublicKey("8bHmUjNXXEDixwyEfkVfGE6CwzUJWprcJupGBPyujUCD");
const network = clusterApiUrl("devnet");
const opts = { preflightCommitment: "processed" };

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [counter, setCounter] = useState(null);

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      try {
        const response = await solana.connect();
        setWalletAddress(response.publicKey.toString());
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Solana wallet not found! Get a Phantom Wallet 👻");
    }
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const initializeCounter = async () => {
    const provider = getProvider();
    const program = new Program(idl, programId, provider);

    const [counterPda] = await PublicKey.findProgramAddress(
      [utils.bytes.utf8.encode("counter")],
      programId
    );

    await program.methods
      .initialize()
      .accounts({
        counter: counterPda,
        user: provider.wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    fetchCounter();
  };

  const incrementCounter = async () => {
    const provider = getProvider();
    const program = new Program(idl, programId, provider);

    const [counterPda] = await PublicKey.findProgramAddress(
      [utils.bytes.utf8.encode("counter")],
      programId
    );

    await program.methods
      .increment()
      .accounts({
        counter: counterPda,
      })
      .rpc();

    fetchCounter();
  };

  const fetchCounter = async () => {
    const provider = getProvider();
    const program = new Program(idl, programId, provider);

    const [counterPda] = await PublicKey.findProgramAddress(
      [utils.bytes.utf8.encode("counter")],
      programId
    );

    const account = await program.account.counter.fetch(counterPda);
    setCounter(account.count.toNumber());
  };

  useEffect(() => {
    const onLoad = async () => {
      await connectWallet();
      fetchCounter();
    };
    onLoad();
  }, []);

  return (
    <div>
      <h1>Solana Counter</h1>
      {!walletAddress && (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
      {walletAddress && (
        <div>
          <p>Wallet Address: {walletAddress}</p>
          <p>Counter: {counter !== null ? counter : "Loading..."}</p>
          <button onClick={initializeCounter}>Initialize Counter</button>
          <button onClick={incrementCounter}>Increment Counter</button>
        </div>
      )}
    </div>
  );
};

const idl = {
  version: "0.0.0",
  name: "solana_counter",
  instructions: [
    {
      name: "initialize",
      accounts: [
        { name: "counter", isMut: true, isSigner: false },
        { name: "user", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false },
      ],
    },
    {
      name: "increment",
      accounts: [
        { name: "counter", isMut: true, isSigner: false },
      ],
    },
  ],
};

export default App;





































// // src/components/LikeCounter.jsx
// import { useWallet } from '@solana/wallet-adapter-react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
// import React, { useEffect, useState } from 'react';

// const LikeCounter = () => {
//   const { publicKey, sendTransaction } = useWallet();
//   const [count, setCount] = useState(0);
//   const [loading, setLoading] = useState(false);
  
//     // Replace with your deployed program ID from SolPG
//     const PROGRAM_ID = new PublicKey('8bHmUjNXXEDixwyEfkVfGE6CwzUJWprcJupGBPyujUCD');
  
//     // Replace with your counter account public key
//     const COUNTER_ACCOUNT = new PublicKey('FoScPhAv3DcAwdxNbo4U47cJRhihL3mUSQKfZu3f6SJM');

//   const getCounterData = async () => {
//     try {
//       const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
//       const accountInfo = await connection.getAccountInfo(COUNTER_ACCOUNT);
      
//       if (accountInfo && accountInfo.data.length >= 4) {
//         const counterData = accountInfo.data;
//         const count = new DataView(counterData.buffer).getUint32(0, true);
//         setCount(count);
//       }
//     } catch (error) {
//       console.error('Error fetching counter:', error);
//     }
//   };

//   const incrementCounter = async () => {
//     if (!publicKey) return;

//     try {
//       setLoading(true);
//       const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      
//       const instruction = new TransactionInstruction({
//         keys: [
//           {
//             pubkey: COUNTER_ACCOUNT,
//             isSigner: false,
//             isWritable: true,
//           },
//         ],
//         programId: PROGRAM_ID,
//         data: Buffer.from([]),
//       });

//       const transaction = new Transaction().add(instruction);
      
//       const signature = await sendTransaction(transaction, connection);
//       await connection.confirmTransaction(signature, 'confirmed');
      
//       await getCounterData();
//     } catch (error) {
//       console.error('Error incrementing counter:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (publicKey) {
//       getCounterData();
//     }
//   }, [publicKey]);

//   return (
//     <div className="flex flex-col items-center gap-6">
//       <WalletMultiButton />
      
//       {publicKey ? (
//         <div className="flex flex-col items-center gap-4">
//           <div className="text-4xl font-bold">{count}</div>
//           <button
//             onClick={incrementCounter}
//             disabled={loading}
//             className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Processing...' : 'Like'}
//           </button>
//         </div>
//       ) : (
//         <p className="text-gray-600">Please connect your wallet to continue</p>
//       )}
//     </div>
//   );
// };

// export default LikeCounter;

















