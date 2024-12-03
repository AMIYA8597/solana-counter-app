import { WalletContextProvider } from './WalletContextProvider';
import CounterApp from './components/CounterApp';

function App() {
  return (
    <WalletContextProvider>
      <CounterApp />
    </WalletContextProvider>
  );
}

export default App;