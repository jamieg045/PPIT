import { useEffect } from "react";
import ItemFinder from './itemfinder';

function Products(props)
{

    return props.myProducts.map(
        (product) => {
            return <ItemFinder key={product.food_id} myProduct={product} addToCart={props.addToCart}></ItemFinder>
        }
    )
}

export default Products;