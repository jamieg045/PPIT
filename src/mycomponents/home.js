import React from 'react';
import Products from './products';
import { IonIcon } from '@ionic/react';
import {cart} from 'ionicons/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
  const [products, setProducts] = useState([]);
  const [Cart, setCart] = useState(JSON.parse(sessionStorage.getItem('cart')) || []);


  useEffect(() => {
    axios.get('http://localhost:4000/api/menu')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  const addToCart = (productId) => {
    const productToAdd = products.find(product => product.id == productId);
    if (!productToAdd) return;

    const existingCartItem = Cart.find(item => item.id == productId);
    if (existingCartItem) {
      const updatedCart = Cart.map(item =>
        item.id == productId ? { item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      setCart([Cart, { productToAdd, quantity: 1 }]);
    }
    sessionStorage.setItem('cart', JSON.stringify(Cart));
  }

  return (
    <div>
      <h2>Menu</h2>
      <IonIcon icon={cart} />
      <Products myProducts={products} addToCart={addToCart}></Products>
      <span>{Cart.quantity}</span>
    </div>
  )
}

export default Home;