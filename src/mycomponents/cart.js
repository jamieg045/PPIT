import { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";

function Cart()
{
    const {food_id} = useParams();
    const [cartItems, setCartItems] = useState([]);


    useEffect(() => {
        axios.get('http://localhost:4000/api/cart' + food_id)
        .then((response) => {
            setCartItems(response.data);
        })
        .catch((error) => {
            console.log('Error fetching cart items', error);
        });
    }, []);
    return (
        <div>
            <h1>Cart</h1>
            <ul>
                {cartItems.map((item, index) => (
                    <li key={index}>
                        <div>Name: {item.name}</div>
                        <div>Price: {item.price}</div>
                    </li>
                ))}
            </ul>
        </div>

    )
}

export default Cart;