import React from 'react';
import Products from './products';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cart from './cart';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem('cart')) || []);
  const navigate = useNavigate();

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

    const existingCartItem = cart.find(item => item.id == productId);
    if (existingCartItem) {
      const updatedCart = cart.map(item =>
        item.id == productId ? { item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      setCart([cart, { product: productToAdd, quantity: 1 }]);
    }
    sessionStorage.setItem('cart', JSON.stringify([...cart, { product: productToAdd, quantity: 1 }]));
    navigate('/cart');
  }

  return (
    <div>
      <h2>Menu</h2>
      <Products myProducts={products} addToCart={addToCart}></Products>
    </div>
  )
}

export default Home;