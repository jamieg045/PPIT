import React from "react";


function Cart({ cart, removeFromCart, increaseQuantity, decreaseQuantity }) {
    return (
        <div>
            <h1>Cart</h1>
            {cart.map((item => (
                <div key={item.id}>
                    <p>{item.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price}</p>
                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                    <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
            )))
            }
        </div>
    )
}

export default Cart;