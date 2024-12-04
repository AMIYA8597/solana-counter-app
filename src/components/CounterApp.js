import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';
import Navbar from './Navbar';
import CounterDisplay from './CounterDisplay';
import CounterControls from './CounterControls';
import { getProvider, createCounter, incrementCounter, decrementCounter, fetchCount } from '../services/counterService';

const CounterApp = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [counterAccount, setCounterAccount] = useState(null);

  const handleCreateCounter = async () => {
    try {
      setLoading(true);
      const provider = getProvider(connection, wallet);
      const publicKey = await createCounter(provider, wallet);
      setCounterAccount(publicKey);
      toast.success('Counter initialized successfully!');
    } catch (error) {
      console.error("Error creating counter:", error);
      toast.error('Failed to initialize counter');
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = async () => {
    try {
      setLoading(true);
      const provider = getProvider(connection, wallet);
      await incrementCounter(provider, counterAccount);
      await updateCount();
      toast.success('Counter incremented!');
    } catch (error) {
      console.error("Error incrementing:", error);
      toast.error('Failed to increment counter');
    } finally {
      setLoading(false);
    }
  };

  const handleDecrement = async () => {
    try {
      setLoading(true);
      const provider = getProvider(connection, wallet);
      await decrementCounter(provider, counterAccount);
      await updateCount();
      toast.success('Counter decremented!');
    } catch (error) {
      console.error("Error decrementing:", error);
      toast.error('Failed to decrement counter');
    } finally {
      setLoading(false);
    }
  };

  const updateCount = async () => {
    if (!counterAccount) return;
    try {
      const provider = getProvider(connection, wallet);
      const newCount = await fetchCount(provider, counterAccount);
      setCount(newCount);
    } catch (error) {
      console.error("Error fetching count:", error);
      toast.error('Failed to fetch counter value');
    }
  };

  useEffect(() => {
    if (wallet.connected && counterAccount) {
      updateCount();
    }
  }, [wallet.connected, counterAccount]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500">
      <Navbar />
      
      <main className="pt-20 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl">
            {!wallet.connected ? (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
                <p className="text-gray-600 mb-4">Please connect your Solana wallet to use the counter</p>
              </div>
            ) : !counterAccount ? (
              <div className="text-center py-8">
                <h2 className="text-xl font-semibold mb-4">Initialize Counter</h2>
                <button
                  onClick={handleCreateCounter}
                  disabled={loading}
                  className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Initializing...' : 'Create Counter'}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <CounterDisplay count={count} loading={loading} />
                <CounterControls 
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  loading={loading}
                />
              </div>
            )}
            
            {loading && (
              <div className="text-center mt-4 text-gray-600">
                Processing transaction...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CounterApp;

































































































// import React, { useEffect, useState } from 'react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
// import { PublicKey } from '@solana/web3.js';
// import idl from '../idl.json';

// const programID = new PublicKey('HYpYfKbHBsr2KtsviGF5miA47kykMvqCjYdoAC6ckgDa');

// const CounterApp = () => {
//   const { connection } = useConnection();
//   const wallet = useWallet();
//   const [count, setCount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [counterAccount, setCounterAccount] = useState(null);

//   const getProvider = () => {
//     if (!wallet) return null;
//     const provider = new AnchorProvider(
//       connection,
//       wallet,
//       AnchorProvider.defaultOptions()
//     );
//     return provider;
//   };

//   const createCounterAccount = async () => {
//     try {
//       setLoading(true);
//       const provider = getProvider();
//       const program = new Program(idl, programID, provider);
      
//       const account = web3.Keypair.generate();
      
//       await program.methods
//         .initialize()
//         .accounts({
//           counter: account.publicKey,
//           user: wallet.publicKey,
//           systemProgram: web3.SystemProgram.programId,
//         })
//         .signers([account])
//         .rpc();
        
//       setCounterAccount(account.publicKey);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error creating counter:", error);
//       setLoading(false);
//     }
//   };

//   const increment = async () => {
//     try {
//       setLoading(true);
//       const provider = getProvider();
//       const program = new Program(idl, programID, provider);
      
//       await program.methods
//         .increment()
//         .accounts({
//           counter: counterAccount,
//         })
//         .rpc();
        
//       await fetchCount();
//       setLoading(false);
//     } catch (error) {
//       console.error("Error incrementing:", error);
//       setLoading(false);
//     }
//   };

//   const decrement = async () => {
//     try {
//       setLoading(true);
//       const provider = getProvider();
//       const program = new Program(idl, programID, provider);
      
//       await program.methods
//         .decrement()
//         .accounts({
//           counter: counterAccount,
//         })
//         .rpc();
        
//       await fetchCount();
//       setLoading(false);
//     } catch (error) {
//       console.error("Error decrementing:", error);
//       setLoading(false);
//     }
//   };

//   const fetchCount = async () => {
//     if (!counterAccount) return;
//     try {
//       const provider = getProvider();
//       const program = new Program(idl, programID, provider);
//       const account = await program.account.counter.fetch(counterAccount);
//       setCount(account.count.toString());
//     } catch (error) {
//       console.error("Error fetching count:", error);
//     }
//   };

//   useEffect(() => {
//     if (wallet.connected && counterAccount) {
//       fetchCount();
//     }
//   }, [wallet.connected, counterAccount]);

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex flex-col items-center justify-center">
//       <div className="bg-white p-8 rounded-lg shadow-xl w-96">
//         <h1 className="text-3xl font-bold text-center mb-8">Solana Counter</h1>
        
//         <div className="flex justify-center mb-6">
//           <WalletMultiButton className="btn" />
//         </div>

//         {wallet.connected && !counterAccount && (
//           <button
//             onClick={createCounterAccount}
//             disabled={loading}
//             className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
//           >
//             Initialize Counter
//           </button>
//         )}

//         {counterAccount && (
//           <div className="space-y-6">
//             <div className="text-center">
//               <h2 className="text-xl font-semibold mb-2">Current Count</h2>
//               <div className="text-4xl font-bold text-purple-600">{count}</div>
//             </div>

//             <div className="flex gap-4">
//               <button
//                 onClick={decrement}
//                 disabled={loading}
//                 className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
//               >
//                 Decrement
//               </button>
//               <button
//                 onClick={increment}
//                 disabled={loading}
//                 className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
//               >
//                 Increment
//               </button>
//             </div>
//           </div>
//         )}

//         {loading && (
//           <div className="text-center mt-4 text-gray-600">
//             Processing transaction...
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CounterApp;