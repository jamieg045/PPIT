import React, { useState, useEffect } from 'react';
import Products from './products';
import axios from 'axios';
import Cart from './cart';
import { useParams } from 'react-router-dom';

function Starters({ setCartCount }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem('cart')) || []);
  const { eircode } = useParams();

  useEffect(() => {
    if (eircode) {
      console.log(`Fetching menu for eircode: ${eircode}`);
      axios
        .get(`http://192.168.1.1:4000/api/starter/${eircode}`)
        .then((response) => {
          console.log('API response:', response.data);
          setProducts(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [eircode]);

  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }, [cart]);

  const updateCartCount = () => {
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(itemCount);
  };

  const addToCart = (productId) => {
    const existingItemIndex = cart.findIndex((item) => item.product_id === productId);
    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity++;
      setCart(updatedCart);
    } else {
      const productToAdd = products.find((product) => product.product_id === productId);
      if (productToAdd) {
        setCart([...cart, { ...productToAdd, quantity: 1 }]);
      }
    }
    updateCartCount();
  };

  return (
    <div>
      <div className="home-container">
        <h2>Food Menu</h2>
        <Products myProducts={products} addToCart={addToCart} />
      </div>
    </div>
  );
}

export default Starters;