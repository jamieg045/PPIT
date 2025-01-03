import React, { useState, useEffect } from 'react';
import Products from './products';
import axios from 'axios';
import Cart from './cart';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'bootstrap';

function Home({ setCartCount }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(JSON.parse(sessionStorage.getItem('cart')) || []);
  const [selectedCategory, setSelectedCategory] = useState(''); // State for selected category
  const [availableCategories, setAvailableCategories] = useState([]);
  const { eircode } = useParams();
  const [locationName, setLocationName] = useState('');
  const [addToCartAnimation, setAddToCartAnimation] = useState(false);
  const [hasFoodItems, setHasFoodItems] = useState(null);
  const navigate = useNavigate();
  const isTakeaway = sessionStorage.getItem('Takeaway') === 'True';

  const fetchCategoryProducts = (category) => {
    if (eircode) {
      const categoryEndpoint = `http://192.168.1.1:4000/api/menu/${category}/${eircode}`;
      console.log(`Fetching ${category} for eircode: ${eircode}`);
      axios
        .get(categoryEndpoint)
        .then((response) => {
          console.log('API response:', response.data);
          setProducts(response.data);
          setSelectedCategory(category); // Update selected category
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    axios.get(`http://192.168.1.1:4000/api/menu/check-food/${eircode}`)
    .then(response => {
      setHasFoodItems(response.data.hasFoodItems);
      if(!response.data.hasFoodItems)
      {
        navigate(`/drinks/${eircode}`);
      }
    })
    .catch(err => {
      console.error('Error checking food menu:', err);
      setHasFoodItems(false);
    });
  }, [eircode, navigate]);

  useEffect(() => {
    if (eircode) {
      console.log(`Fetching menu for eircode: ${eircode}`);
      axios
        .get(`http://192.168.1.1:4000/api/menu/${eircode}`)
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
      axios.get(`http://192.168.1.1:4000/api/menu/${eircode}`)
      .then((response) => {
        const fetchedProducts = response.data;
        setProducts(fetchedProducts);

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
      const productToAdd = products.find((product) => product.product_id === productId);
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

  const categories = ['Starter', 'Main Course', 'Dessert', 'Sides', 'Pizza', 'Sandwich'];
  if(hasFoodItems === null)
    {
      return <p>Loading menu...</p>
    }

    if(isTakeaway)
    {
      console.log('Takeaway order in progress');
    } else
    {
      console.log('Dine-in or other order types');
    }
  return (
    hasFoodItems && (
    <div>
      <div className="home-container">
        <h1>Welcome to {locationName}</h1>
        <h2>Food Menu</h2>
        <div className="category-buttons">
          {availableCategories.map((category) => (
            <button
              key={category}
              onClick={() => fetchCategoryProducts(category.toLowerCase().replace(" ", ""))} // Fetch products for selected category
              className={category === selectedCategory ? 'active' : ''}
            >
              {category}
            </button>
          ))}
        </div>
        {selectedCategory ? (
        <Products myProducts={products} addToCart={(productId) => { addToCart(productId); }} addToCartAnimation={addToCartAnimation} />
      ) : (
        <p>Please select a category to view items.</p>
      )}
      </div>
    </div>
  ));
}

export default Home;