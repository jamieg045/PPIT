
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import Products from './products';

function Cart({ cart = [], removeFromCart, increaseQuantity, decreaseQuantity }) {
    // Calculate total price of the cart
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const handleCheckout = async () =>{
        try {
            const stripe = await loadStripe("pk_test_51P3McW09IVIuY12XuwY2OjzI7EBnj5CuUxyfU2EL1cwXLUOsok2SbmjGCrOZUHaccj18JKsPmRaBgaRZnqV6jGCf00RRGNTWX7");
            const response = await axios.post('http://localhost:4000/api/create-checkout-session', { products: cart });
            const session = response.data;
            await stripe.redirectToCheckout({ sessionId: session.id });
            sessionStorage.removeItem('cart');
        } catch (error) {
            console.error('Error initiating checkout:', error);
            // Handle error
        }
    }


    return (
        <div>
            <br></br>
            {cart.length > 0 ? (
                <div>
                    {cart.map(item => (
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
                    <button onClick={handleCheckout} className="btn btn-primary">
                        Checkout
                    </button>
                </div>
            ) : (
                <p>Cart is empty</p>
            )}
        </div>
    );
}

export default Cart;