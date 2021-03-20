import { Product } from '../hooks/cart';

export function cartTotal(products: Product[]): number {
  if (products.length === 0) return 0;

  const total = products
    .map(item => item.quantity * item.price)
    .reduce((t, item) => item + t);

  return total;
}

export function cartQuantity(products: Product[]): number {
  if (products.length === 0) return 0;

  const total = products
    .map(item => item.quantity)
    .reduce((t, item) => item + t);

  return total;
}
