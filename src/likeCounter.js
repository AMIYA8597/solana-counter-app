import { Connection, PublicKey, Keypair, clusterApiUrl, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import idl from './like_counter_idl.json'; // This assumes you have generated an IDL file for your smart contract

const programId = new PublicKey('CtRtg25MyiVLPE9ypxb6BoqriQtVRVEz1gPaYUVHH7ox'); // Replace with your actual program ID

const opts = {
  preflightCommitment: "processed",
};

const getProvider = () => {
  const connection = new Connection(clusterApiUrl('devnet'), opts.preflightCommitment);
  const wallet = window.solana; // Assumes you've connected a Phantom wallet
  const provider = new AnchorProvider(connection, wallet, opts.preflightCommitment);
  return provider;
};

export const initializeCounter = async () => {
  const provider = getProvider();
  const program = new Program(idl, programId, provider);

  const counterAccount = Keypair.generate();

  const tx = await program.rpc.initialize({
    accounts: {
      counterAccount: counterAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [counterAccount],
  });

  console.log("Transaction signature", tx);

  return counterAccount.publicKey.toString();
};

export const addLike = async (counterAddress) => {
  const provider = getProvider();
  const program = new Program(idl, programId, provider);

  await program.rpc.addLike({
    accounts: {
      counterAccount: new PublicKey(counterAddress),
    },
  });

  console.log("Like added!");
};

export const getLikes = async (counterAddress) => {
  const provider = getProvider();
  const program = new Program(idl, programId, provider);

  const likes = await program.account.counterAccount.fetch(new PublicKey(counterAddress));
  console.log("Current Likes:", likes.likes.toString());
  return likes.likes.toString();
};