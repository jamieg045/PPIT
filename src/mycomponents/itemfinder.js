import {useEffect, useState} from "react";
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";

function ItemFinder(props)
{
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        console.log("Item"+ props.myproduct);
    }, []);

    const handleAddToCart = () => {
        props.addToCart(props.myProduct.product_id);

        setAnimate(true);
        setTimeout(() => setAnimate(false), 500);

        if(navigator.vibrate)
        {
            navigator.vibrate(100);
        }
    }

    return (
        <div className="products">
        <Card className="product">
        <Card.Body>
          <Card.Title>{props.myProduct.name}</Card.Title>
          <Card.Subtitle className="details">{props.myProduct.description}</Card.Subtitle>
          <Card.Text className="price">€{props.myProduct.price}</Card.Text>
          </Card.Body>
          <button onClick={handleAddToCart} className={`button ${animate ? "button-animate": ""}`}>Add to Cart</button>
          </Card>
          </div>
    )
}

export function BeverageFinder(props)
{
    const [animate, setAnimate] = useState(false);


       useEffect(() => {
        console.log("Item"+ props.mybeverage);
    }, []);

    const handleAddToCart = () => {
        props.addToCart(props.myBeverage.product_id);

        setAnimate(true);
        setTimeout(() => setAnimate(false), 500);

        if(navigator.vibrate)
        {
            navigator.vibrate(100);
        }
    }

    return (
        <div className="products">
        <Card className="product">
        <Card.Body>
          <Card.Title>{props.myBeverage.name}</Card.Title>
          <Card.Subtitle className="details">{props.myBeverage.description}</Card.Subtitle>
          <Card.Text className="price">€{props.myBeverage.price}</Card.Text>
          </Card.Body>
          <button onClick={handleAddToCart} className={`button ${animate ? "button-animate": ""}`}>Add to Cart</button>
          </Card>
          </div>
    )
}

export default ItemFinder;