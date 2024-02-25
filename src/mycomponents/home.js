import React from 'react';
import Products from './products';
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

function Home()
{
    const products = [
        {
                "food": [
                      {
                        "name": "Roast of the Day ✊",
                        "price": 15,
                        "info": "Served with mashed potatoe and fresh vegetables on side.",
                        "img": "https://devdactic.fra1.digitaloceanspaces.com/foodui/1.png"
                      },
                      {
                        "name": "Catch of the Day",
                        "price": 17,
                        "info": "Served with mashed potatoe and fresh vegetables on side.",
                        "img": "https://devdactic.fra1.digitaloceanspaces.com/foodui/2.png"
                      },
                      {
                        "name": "Soup of the Day",
                        "price": 6.50,
                        "info": "Served with homemade brown bread or freshly baked white rolls.",
                        "img": "https://devdactic.fra1.digitaloceanspaces.com/foodui/3.png"
                      },
                      {
                        "name": "Chef's Special",
                        "price": 15,
                        "info": "Don't miss it! Ask your server",
                        "img": "https://devdactic.fra1.digitaloceanspaces.com/foodui/4.png"
                      }
                    ]
                  },
                      {
                          "name": "Seafood Chowder",
                          "price": 9.50,
                          "info": "Served with homemade brown bread."
                      },
                      {
                        "name": "Starter Chicken Wings",
                        "price": 9.50,
                        "info": "Served with our unique spicy sauce with celery sticks and blue cheese dip."
                      },
                      {
                          "name": "Starter Caesar Salad (with chicken)",
                          "price": 11.50,
                          "info": "Served with baby gem, smoked bacon, garlic croutons, parmesan shavings topped with homemade Caesar dressing."
                      },
                      {
                          "name": "Starter Caesar Salad (with prawns)",
                          "price": 11.50,
                          "info": "Served with baby gem, smoked bacon, garlic croutons, parmesan shavings topped with homemade Caesar dressing."
                      },
                      {
                        "name": "Starter Black Pudding Fritters",
                        "price": 8,
                        "info": "Served with baby gem lettuce topped with homemade apple sauce"
                      },
                      {
                        "name": "Goat's Cheese Crostini",
                        "price": 10,
                        "info": "Tomato sauce, chilli, garlic, and onions",
                        "img": "https://devdactic.fra1.digitaloceanspaces.com/foodui/5.png"
                      },
                      {
                          "name": "Starter Vegetable Spring Rolls",
                          "price": 8,
                          "info": "Served with green leaves and sweet chilli sauce",
                        "img": "https://devdactic.fra1.digitaloceanspaces.com/foodui/6.png"
                      },
                  {
                        "name": "Four Cheese Pizza",
                        "price": 14,
                        "info": "Plain cheese pizza on stone baked base with unique tomato sauce",
                        "img": "https://devdactic.fra1.digitaloceanspaces.com/foodui/7.png"
                      },
                      {
                        "name": "Cajun Chicken Pizza",
                        "price": 14,
                        "info": "Cajun chicken with cheese on stone baked base with unique tomato sauce",
                        "img": "https://devdactic.fra1.digitaloceanspaces.com/foodui/8.png"
                      },
                      {
                        "name": "Pepperoni Pizza",
                        "price": 14,
                        "info": "Seasoned with spiced pepperoni slices on stone baked base with unique tomato sauce",
                        "img": "https://devdactic.fra1.digitaloceanspaces.com/foodui/8.png"
                  },
                      {
                        "name": "Cajun Chicken Goujon Wrap",
                        "price": 12,
                        "info": "Served with cajun mayo, fries and seasonal salad",
                        "img": "https://devdactic.fra1.digitaloceanspaces.com/foodui/9.png"
                      },
                      {
                        "name": "Toasted Special",
                        "price": 9.50,
                        "info": "Baked ham, cheddar cheese, red onion, tomato. Served with fries and seasonal salad",
                        "img": "https://devdactic.fra1.digitaloceanspaces.com/foodui/10.png"
                      }
                    ];

            return (
                <div>
                    <h2>Menu</h2>
                    <Products myProducts={products}></Products>
                </div>
            )
}

export default Home;