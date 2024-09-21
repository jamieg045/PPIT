import React from 'react';
import Products, { GroceryProducts } from './products';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cart from './cart';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Grocery() {
  const [groceries, setGroceries] = useState([]);
  const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem('cart')) || []);
  const navigate = useNavigate();
  const {eircode} = useParams();

  useEffect(() => {
    if(eircode) {
    axios.get(`http://192.168.1.1:4000/api/groceries/${eircode}`)
      .then((response) => {
        setGroceries(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [eircode]);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Function to add product to cart
  const addToCart = (productId) => {
    const existingItemIndex = cart.findIndex(item => item.product_id === productId);
    if (existingItemIndex !== -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity++;
        setCart(updatedCart);
    } else {
      const productToAdd = groceries.find(product => product.product_id === productId);
      if (productToAdd) {
          setCart([...cart, { ...productToAdd, quantity: 1 }]);
      }
    }
    sessionStorage.setItem('cart', JSON.stringify(cart));
};

// Function to remove product from cart
const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.product_id !== productId);
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
};

// Function to increase product quantity in cart
const increaseQuantity = (productId) => {
    const updatedCart = cart.map(item =>
        item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
};

// Function to decrease product quantity in cart
const decreaseQuantity = (productId) => {
    const updatedCart = cart.map(item =>
        item.product_id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart));
};


  return (
    <div>
      <div className='home-container'>
      <h2>Grocery Menu</h2>
      <GroceryProducts myGroceries={groceries} addToCart={addToCart}></GroceryProducts>
            <Cart cart={cart} removeFromCart={removeFromCart} increaseQuantity={increaseQuantity} decreaseQuantity={decreaseQuantity} />
    </div>
    </div>
  )
}

export default Grocery;