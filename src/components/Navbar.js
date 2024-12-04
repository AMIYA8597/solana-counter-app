import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-purple-600">Solana Counter dApp</h1>
          </div>
          <div className="flex items-center">
            <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 transition-colors" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;