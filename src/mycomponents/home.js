import React from 'react';
import Products from './products';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cart from './cart';
import { useNavigate } from 'react-router-dom';
import ItemFinder from './itemfinder';

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

  // Function to add product to cart
  const addToCart = (productId) => {
    const existingItemIndex = cart.findIndex(item => item.food_id === productId);
    if (existingItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity++;
        setCart(updatedCart);
    } else {
      const productToAdd = products.find(product => product.food_id === productId);
      if (productToAdd) {
          setCart([...cart, { ...productToAdd, quantity: 1 }]);
      }
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
};

// Function to remove product from cart
const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.food_id !== productId);
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
};

// Function to increase product quantity in cart
const increaseQuantity = (productId) => {
    const updatedCart = cart.map(item =>
        item.food_id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
};

// Function to decrease product quantity in cart
const decreaseQuantity = (productId) => {
    const updatedCart = cart.map(item =>
        item.food_id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
};


  return (
    <div>
      <h2>Food Menu</h2>
      <Products myProducts={products} addToCart={addToCart}></Products>
      <h2>Cart</h2>
            <Cart cart={cart} removeFromCart={removeFromCart} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} />
    </div>
  )
}

export default Home;