
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import Products from './products';

function Cart({ cart = [], removeFromCart, increaseQuantity, decreaseQuantity }) {
    // Calculate total price of the cart
    const totalPrice = cart.reduce((total, item) => total + (item.food_price * item.quantity), 0);
    const handleCheckout = async () =>{
        const stripe = await loadStripe("pk_test_51P3McW09IVIuY12XuwY2OjzI7EBnj5CuUxyfU2EL1cwXLUOsok2SbmjGCrOZUHaccj18JKsPmRaBgaRZnqV6jGCf00RRGNTWX7")
        console.log('Cart before sending to backend:', cart);
        const body = {
            products: cart
        }
        const headers = {
            "Content-Type":"application/json"
        }
        const response = await fetch('http://localhost:4000/api/create-checkout-session', {
            method:"POST",
            headers:headers,
            body:JSON.stringify(body)
        })

        const session = await response.json();
        const result = stripe.redirectToCheckout({
            sessionId:session.id
        })
        {

        }
    }


    return (
        <div>
            <br></br>
            {cart.length > 0 ? (
                <div>
                    {cart.map(item => (
                        <div key={item.food_id}>
                            <p>{item.food_name}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Price: €{item.food_price * item.quantity}</p>
                            <button onClick={() => increaseQuantity(item.food_id)}>+</button>
                            <button onClick={() => decreaseQuantity(item.food_id)}>-</button>
                            <button onClick={() => removeFromCart(item.food_id)}>Remove</button>
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