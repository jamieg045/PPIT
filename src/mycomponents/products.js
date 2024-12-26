import { useEffect } from "react";
import ItemFinder, { BeverageFinder} from './itemfinder';

function Products(props) {
    return (
        <div className="products">
            {props.myProducts.map((product) => {
                return <ItemFinder key={product.product_id} myProduct={product} addToCart={props.addToCart}></ItemFinder>;
            })}
        </div>
    );
}

export function BeverageProducts(props)
{
    return (
        <div className="products">
            {props.myBeverages.map((beverage) => {
                return <BeverageFinder key={beverage.product_id} myBeverage={beverage} addToCart={props.addToCart}></BeverageFinder>;
            })}
        </div>
    );
}

export default Products;