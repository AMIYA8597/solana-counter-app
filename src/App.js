import { Toaster } from 'react-hot-toast';
import { WalletContextProvider } from './WalletContextProvider';
import CounterApp from './components/CounterApp';
import '@solana/wallet-adapter-react-ui/styles.css';

function App() {
  return (
    <WalletContextProvider>
      <Toaster position="top-right" />
      <CounterApp />
    </WalletContextProvider>
  );
}

export default App;

































// import { WalletContextProvider } from './WalletContextProvider';
// import CounterApp from './components/CounterApp';

// function App() {
//   return (
//     <WalletContextProvider>
//       <CounterApp />
//     </WalletContextProvider>
//   );
// }

// export default App;