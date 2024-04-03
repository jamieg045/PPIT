
import React from 'react';

function Cart({ cart = [], removeFromCart, increaseQuantity, decreaseQuantity }) {
    // Calculate total price of the cart
    const totalPrice = cart.reduce((total, item) => total + (item.food_price * item.quantity), 0);

    return (
        <div>
            <h1>Cart</h1>
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
                    <p>Total Price: €{totalPrice.toFixed(2)}</p> {/* Display total price */}
                </div>
            ) : (
                <p>Cart is empty</p>
            )}
        </div>
    );
}

export default Cart;