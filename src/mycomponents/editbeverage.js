import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function EditBeverage()
{
    let {product_id} = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [price, setPrice] = useState();
    const [description, setDescription] = useState();
    const [eircode, setEircode] = useState();
    const [category, setCategory] = useState();

    useEffect(() => {
        //axios is a promised based web client
        //make a HTTP Request with GET method and pass as part of the
        //url.
        axios.get('http://localhost:4000/api/drinks/' + product_id)
            .then((response) => {
                // Assign Response data to the arrays using useState.
                setName(response.data.name);
                setPrice(response.data.price);
                setDescription(response.data.description);
                setEircode(response.data.eircode);
                setCategory(response.data.category);
            })
            .catch(function (error) {
                console.log("Error fetching product:", error);
            })
    }, []);
    const handleSubmit = (event) => {
        event.preventDefault();
        const newProduct = {
            product_id: product_id,
            name: name,
            price: price,
            description: description,
            eircode: eircode,
            category: category
        };
        axios.put('http://localhost:4000/api/drinks/' + product_id, newProduct)
            .then((res) => {
                console.log(res.data);
                navigate('/menu');
            });
    }

    return (
        <div>
             <form onSubmit={handleSubmit}>
             <div className="form-group">
            <h1>Edit Beverage Product</h1>
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
                    <label>Product Category: </label>
                    <input type="text"
                    className="form-control"
                    value={category}
                    onChange={(e) => {setCategory(e.target.value)}}
                    />
                </div>
                <input type="submit" value="Edit Product"></input>
            </form>
        </div>
    )
}