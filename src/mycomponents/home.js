import React from 'react';
import Products from './products';
import { useState, useEffect } from 'react';
import axios from 'axios';
// const Home = () => (
//   <IonPage>
//     <IonHeader>
//       <IonToolbar>
//         <IonTitle>Home</IonTitle>
//       </IonToolbar>
//     </IonHeader>
//     <IonContent>
//       <IonButton expand="full">Click Me</IonButton>
//     </IonContent>
//   </IonPage>
// );

function Home() {
  const [products, setProducts, cart, setCart] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/menu')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);

  const addToCart = (products) => {
    setCart([cart, products]);
  }

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
  }




  return (
    <div>
      <h2>Menu</h2>
      <Products myProducts={products}></Products>
    </div>
  )
}

export default Home;