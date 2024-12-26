import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

function Cart({setCartCount}) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const isTakeaway = sessionStorage.getItem('Takeaway') === 'True';

  useEffect(() => {
    // Load cart from sessionStorage when the component mounts
    const storedCart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const storedusername = JSON.parse(sessionStorage.getItem('user')) || { username: 'Unknown' };
    
    setCart(storedCart);
    setUser(storedusername);
    updateCartCount(storedCart);
  }, []);

  const updateCartCount = (cart) => {
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(itemCount);
  }

  const handleCheckout = async () => {
    try {

      const eircode = cart.length > 0 ? cart[0].eircode : 'Unknown';
      const stripe = await loadStripe('pk_test_51P3McW09IVIuY12XuwY2OjzI7EBnj5CuUxyfU2EL1cwXLUOsok2SbmjGCrOZUHaccj18JKsPmRaBgaRZnqV6jGCf00RRGNTWX7');
      const response = await axios.post('http://192.168.1.1:4000/api/create-checkout-session', { products: cart, username: user.username, eircode: eircode, is_takeaway: isTakeaway});
      const session = response.data;
      await stripe.redirectToCheckout({ sessionId: session.id });
      setCart([]);
      sessionStorage.removeItem('cart');
      updateCartCount([]);
    } catch (error) {
      console.error('Error initiating checkout:', error);
    }
  };

  const increaseQuantity = (productId) => {
    const updatedCart = cart.map(item =>
      item.product_id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart)); // Save updated cart
    updateCartCount(updatedCart);
  };

  const decreaseQuantity = (productId) => {
    const updatedCart = cart.map(item =>
      item.product_id === productId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart)); // Save updated cart
    updateCartCount(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.product_id !== productId);
    setCart(updatedCart);
    sessionStorage.setItem('cart', JSON.stringify(updatedCart)); // Save updated cart
    updateCartCount(updatedCart);
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Cart</h2>
      {cart.length > 0 ? (
        <div>
          {cart.map((item) => (
            <div key={item.product_id}>
              <p>{item.name}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: €{item.price * item.quantity}</p>
              <button onClick={() => increaseQuantity(item.product_id)}>+</button>
              <button onClick={() => decreaseQuantity(item.product_id)}>-</button>
              <button onClick={() => removeFromCart(item.product_id)}>Remove</button>
            </div>
          ))}
          <p>Total Price: €{totalPrice.toFixed(2)}</p>
          <button 
          onClick={() => {
            handleCheckout()
          }
        }
        className="btn btn-primary"
        >
            Proceed to Checkout
          </button>
        </div>
      ) : (
        <p>Cart is empty</p>
      )}
    </div>
  );
}

export default Cart;