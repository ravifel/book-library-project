import './styles/custom.css';
import Routes from './routes';
import { FavoritesProvider } from './components/FavoritesContext.jsx';
import { CartProvider } from './components/CartContext.jsx';

function App() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <Routes />
      </CartProvider>
    </FavoritesProvider>
  );
}

export default App;