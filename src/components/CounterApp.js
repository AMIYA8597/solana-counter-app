import React, { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../idl.json';

const programID = new PublicKey('HYpYfKbHBsr2KtsviGF5miA47kykMvqCjYdoAC6ckgDa');

const CounterApp = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [counterAccount, setCounterAccount] = useState(null);

  const getProvider = () => {
    if (!wallet) return null;
    const provider = new AnchorProvider(
      connection,
      wallet,
      AnchorProvider.defaultOptions()
    );
    return provider;
  };

  const createCounterAccount = async () => {
    try {
      setLoading(true);
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      
      const account = web3.Keypair.generate();
      
      await program.methods
        .initialize()
        .accounts({
          counter: account.publicKey,
          user: wallet.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([account])
        .rpc();
        
      setCounterAccount(account.publicKey);
      setLoading(false);
    } catch (error) {
      console.error("Error creating counter:", error);
      setLoading(false);
    }
  };

  const increment = async () => {
    try {
      setLoading(true);
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      
      await program.methods
        .increment()
        .accounts({
          counter: counterAccount,
        })
        .rpc();
        
      await fetchCount();
      setLoading(false);
    } catch (error) {
      console.error("Error incrementing:", error);
      setLoading(false);
    }
  };

  const decrement = async () => {
    try {
      setLoading(true);
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      
      await program.methods
        .decrement()
        .accounts({
          counter: counterAccount,
        })
        .rpc();
        
      await fetchCount();
      setLoading(false);
    } catch (error) {
      console.error("Error decrementing:", error);
      setLoading(false);
    }
  };

  const fetchCount = async () => {
    if (!counterAccount) return;
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.counter.fetch(counterAccount);
      setCount(account.count.toString());
    } catch (error) {
      console.error("Error fetching count:", error);
    }
  };

  useEffect(() => {
    if (wallet.connected && counterAccount) {
      fetchCount();
    }
  }, [wallet.connected, counterAccount]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96">
        <h1 className="text-3xl font-bold text-center mb-8">Solana Counter</h1>
        
        <div className="flex justify-center mb-6">
          <WalletMultiButton className="btn" />
        </div>

        {wallet.connected && !counterAccount && (
          <button
            onClick={createCounterAccount}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Initialize Counter
          </button>
        )}

        {counterAccount && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Current Count</h2>
              <div className="text-4xl font-bold text-purple-600">{count}</div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={decrement}
                disabled={loading}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                Decrement
              </button>
              <button
                onClick={increment}
                disabled={loading}
                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                Increment
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center mt-4 text-gray-600">
            Processing transaction...
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterApp;