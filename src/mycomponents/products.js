import { useEffect } from "react";
import ItemFinder, { BeverageFinder } from './itemfinder';

function Products(props)
{

    return props.myProducts.map(
        (product) => {
            return <ItemFinder key={product.product_id} myProduct={product} addToCart={props.addToCart}></ItemFinder>
        }
    )
}

export function BeverageProducts(props)
{
    return props.myBeverages.map(
        (beverage) => {
            return <BeverageFinder key={beverage.product_id} myBeverage={beverage} addToCart={props.addToCart}></BeverageFinder>
        }
    )
}

export default Products;