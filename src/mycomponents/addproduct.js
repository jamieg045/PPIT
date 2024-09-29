import { useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

function AddProduct()
{
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const {eircode}= useParams();
    const [category, setCategory] = useState('');

    // Example of ENUM values for product categories
    const categories = ['Starter', 'Main Course', 'Dessert', 'Sides', 'Sandwich', 'Pizza'];

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Name: "+ name+ "Price:"+ price+ "Description"+ description+"Eircode"+ eircode+"Course"+ category);

        const product =
        {
            name:name,
            price:price,
            description:description,
            eircode: eircode,
            category:category
        }

        axios.post('http://localhost:4000/api/menu', product)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err.data));
        navigate(`/menu/${eircode}`)
        
    }

    return (
        <div>
            <h1>Insert Food Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name: </label>
                    <input type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => {setName(e.target.value)}}
                    />
                </div>
                <div className="form-group">
                    <label>Product Price: </label>
                    <input type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => {setPrice(e.target.value)}}
                    />
                </div>
                <div className="form-group">
                    <label>Product Description: </label>
                    <input type="text"
                    className="form-control"
                    value={description}
                    onChange={(e) => {setDescription(e.target.value)}}
                    />
                </div>
                <div className="form-group">
                    <label>Location Eircode: </label>
                    <input type="text"
                    className="form-control"
                    value={eircode}
                    disabled
                    />
                </div>
                <div className="form-group">
                    <label>Product Course: </label>
                    <select
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <input type="submit" value="Add Product"></input>
            </form>

        </div>
    )
}

export default AddProduct;