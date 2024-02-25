import { useEffect } from "react";
import ItemFinder from './itemfinder';

function Products(props)
{

    return props.myProducts.map(
        (product) => {
            return <ItemFinder myProduct={product}></ItemFinder>
        }
    )
}

export default Products;