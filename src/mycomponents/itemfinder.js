import {useEffect, useState} from "react";
import Card from 'react-bootstrap/Card';
//import { useNavigate } from "react-router-dom";

function ItemFinder(props)
{
    //const navigate = useNavigate();
    useEffect(() => {
        console.log("Item"+ props.myproduct);
    }, []);

    const handleAddToCart = () => {
        props.addToCart(props.myProduct.food_id);
        //navigate('/cart')
    }

    return (
        <div className="products">
        <Card className="product">
        <Card.Body>
          <Card.Title>{props.myProduct.food_name}</Card.Title>
          <Card.Subtitle className="details">{props.myProduct.food_description}</Card.Subtitle>
          <Card.Text className="price">€{props.myProduct.food_price}</Card.Text>
          </Card.Body>
          <button onClick={handleAddToCart} className="button">Add to Cart</button>
          </Card>
          </div>
    )
}

export default ItemFinder;