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
        <div>
        <Card style={{ width: '18rem', alignContent: '' }}>
        <Card.Body>
          <Card.Title>{props.myProduct.food_name}</Card.Title>
          <Card.Subtitle>{props.myProduct.food_description}</Card.Subtitle>
          <Card.Text>{props.myProduct.food_price}</Card.Text>
          </Card.Body>
          <button onClick={handleAddToCart} className="btn btn-primary">Add to Cart</button>
          </Card>
          </div>
    )
}

export default ItemFinder;