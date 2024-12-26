import React from 'react';
import Products, { BeverageProducts } from './products';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Cart from './cart';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Beverage({ setCartCount }) {
  const [beverages, setBeverages] = useState([]);
  const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem('cart')) || []);
  const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category
  const [availableCategories, setAvailableCategories] = useState([]);
  const {eircode} = useParams();
  const [locationName, setLocationName] = useState('');
  const [addToCartAnimation, setAddToCartAnimation] = useState(false);

  const fetchCategoryBeverages = (category) => {
    if (eircode) {
      const categoryEndpoint = `http://192.168.1.1:4000/api/drinks/${category}/${eircode}`;
      console.log(`Fetching ${category} for eircode: ${eircode}`);
      axios
        .get(categoryEndpoint)
        .then((response) => {
          console.log('API response:', response.data);
          setBeverages(response.data);
          setSelectedCategory(category); // Update selected category
        })
        .catch((error) => {
          console.log(error);
          
        });
    }
  };

  useEffect(() => {
    if (eircode) {
      console.log(`Fetching menu for eircode: ${eircode}`);
      axios.get(`http://192.168.1.1:4000/api/drinks/${eircode}`)
        .then((response) => {
          console.log('API response:', response.data);
          setBeverages(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [eircode]);

  useEffect(() => {
    if (eircode) {
      // Fetch location name based on eircode
      axios
        .get(`http://192.168.1.1:4000/api/data/${eircode}`)
        .then((response) => {
          setLocationName(response.data.LocationName);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [eircode]);

  useEffect(() => {
    if(eircode) {
      axios.get(`http://192.168.1.1:4000/api/drinks/${eircode}`)
      .then((response) => {
        const fetchedProducts = response.data;
        setBeverages(fetchedProducts);
        const availableCategories = categories.filter(category => {
          return fetchedProducts.some(product=> product.category === category)
        });
        setAvailableCategories(availableCategories);
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
      const productToAdd = beverages.find((product) => product.product_id === productId);
      if (productToAdd) {
        setCart([...cart, { ...productToAdd, quantity: 1 }]);
      }
    }
    updateCartCount();

    if(navigator.vibrate)
    {
      navigator.vibrate(200);
    }

    setAddToCartAnimation(true);
    setTimeout(() => setAddToCartAnimation(false), 500);
  };
  const categories = ['Stout', 'Lager', 'Red Ale','Cider', 'IPA', 'Beer Bottle', 'Liquer', 'Split', 'Baby', 'Dashes','Cocktail'];

  return (
    <div>
      <div className="home-container">
      <h1>Welcome to {locationName}</h1>
        <h2>Drinks Menu</h2>
        <div className="category-buttons">
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => fetchCategoryBeverages(category.toLowerCase().replace(" ", ""))} // Fetch products for selected category
              className={category === selectedCategory ? 'active' : ''}
            >
              {category}
            </button>
          ))}
        </div>
        {selectedCategory ? (
        <BeverageProducts myBeverages={beverages} addToCart={(productId) => { addToCart(productId); }} addToCartAnimation={addToCartAnimation} />
      ) : (
        <p>Please select a category to view items.</p>
      )}
      </div>
    </div>
  );
}

export default Beverage;