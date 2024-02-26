import {useEffect, useState} from "react";
import Card from 'react-bootstrap/Card';

function ItemFinder(props)
{
    useEffect(() => {
        console.log("Item"+ props.myproduct);
    }, []);

    return (
        <div>
        <Card style={{ width: '18rem', alignContent: '' }}>
        <Card.Body>
          <Card.Title>{props.myProduct.name}</Card.Title>
          <Card.Text>{props.myProduct.price}</Card.Text>
          </Card.Body>
          </Card>
          </div>
    )
}

export default ItemFinder;