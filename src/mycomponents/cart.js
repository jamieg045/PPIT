
function Cart()
{
    const cart = JSON.parse(sessionStorage.getItem('cart'));
    return (
        <div>
            <h1>Cart</h1>
            <ul>
                {cart.map(item => (
                    <li key={item.id}>
                        {item.name} Quantity: {item.quantity}
                    </li>
                ))}
            </ul>
        </div>

    )
}

export default Cart;