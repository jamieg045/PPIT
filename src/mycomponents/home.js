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
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/api/menu')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }, []);



  return (
    <div>
      <h2>Menu</h2>
      <Products myProducts={products}></Products>
    </div>
  )
}

export default Home;