import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../idl.json';

const programID = new PublicKey('HYpYfKbHBsr2KtsviGF5miA47kykMvqCjYdoAC6ckgDa');

export const getProvider = (connection, wallet) => {
  if (!wallet) return null;
  return new AnchorProvider(connection, wallet, AnchorProvider.defaultOptions());
};

export const createCounter = async (provider, wallet) => {
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
    
  return account.publicKey;
};

export const incrementCounter = async (provider, counterAccount) => {
  const program = new Program(idl, programID, provider);
  await program.methods
    .increment()
    .accounts({
      counter: counterAccount,
    })
    .rpc();
};

export const decrementCounter = async (provider, counterAccount) => {
  const program = new Program(idl, programID, provider);
  await program.methods
    .decrement()
    .accounts({
      counter: counterAccount,
    })
    .rpc();
};

export const fetchCount = async (provider, counterAccount) => {
  const program = new Program(idl, programID, provider);
  const account = await program.account.counter.fetch(counterAccount);
  return account.count.toString();
};