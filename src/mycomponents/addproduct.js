import { useState } from "react";
import axios from 'axios';

function AddProduct()
{
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [eircode, setEircode] = useState('');
    const [course, setCourse] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Name: "+ name+ "Price:"+ price+ "Description"+ description+"Eircode"+ eircode+"Course"+ course);

        const product =
        {
            name:name,
            price:price,
            description:description,
            eircode: eircode,
            course:course
        }

        axios.post('http://localhost:4000/api/menu', product)
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err.data));
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
                    onChange={(e) => {setEircode(e.target.value)}}
                    />
                </div>
                <div className="form-group">
                    <label>Product Course: </label>
                    <input type="text"
                    className="form-control"
                    value={course}
                    onChange={(e) => {setCourse(e.target.value)}}
                    />
                </div>
                <input type="submit" value="Add Product"></input>
            </form>

        </div>
    )
}

export default AddProduct;