import { WalletContextProvider } from './WalletContextProvider';
import CounterApp from './CounterApp';

function App() {
  return (
    <WalletContextProvider>
      <CounterApp />
    </WalletContextProvider>
  );
}

export default App;