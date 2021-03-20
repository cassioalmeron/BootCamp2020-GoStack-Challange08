import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

export interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const localStorageProductsKey = '@GoMarketplace:products';

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // await AsyncStorage.clear();

      const localStorageProducts = await AsyncStorage.getItem(
        localStorageProductsKey,
      );

      if (localStorageProducts) setProducts(JSON.parse(localStorageProducts));

      console.log('load');
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      const index = products.findIndex(item => item.id === product.id);
      if (index < 0) {
        const productToAdd: Product = { ...product, quantity: 1 };
        const productsAdd = [...products, productToAdd];

        await AsyncStorage.setItem(
          localStorageProductsKey,
          JSON.stringify(productsAdd),
        );

        setProducts(productsAdd);
      } else {
        increment(product.id);
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const index = products.findIndex(item => item.id === id);
      products[index].quantity += 1;
      setProducts([...products]);
      AsyncStorage.setItem(localStorageProductsKey, JSON.stringify(products));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const index = products.findIndex(item => item.id === id);

      let productsToSave = [...products];

      if (products[index].quantity === 1) {
        productsToSave = productsToSave.filter(item => item.id !== id);
      } else {
        products[index].quantity -= 1;
      }

      setProducts(productsToSave);
      AsyncStorage.setItem(
        localStorageProductsKey,
        JSON.stringify(productsToSave),
      );
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
