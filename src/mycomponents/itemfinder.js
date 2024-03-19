import {useEffect, useState} from "react";
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";

function ItemFinder(props)
{
    useEffect(() => {
        console.log("Item"+ props.myproduct);
    }, []);

    return (
        <div>
        <Card style={{ width: '18rem', alignContent: '' }}>
        <Card.Body>
          <Card.Title>{props.myProduct.food_name}</Card.Title>
          <Card.Subtitle>{props.myProduct.food_description}</Card.Subtitle>
          <Card.Text>{props.myProduct.food_price}</Card.Text>
          </Card.Body>
          <Link to={'/cart/' +props.myProduct.food_name} className='btn btn-primary'>Add to Cart</Link>
          </Card>
          </div>
    )
}

export default ItemFinder;