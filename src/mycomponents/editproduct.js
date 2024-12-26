import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

function EditProduct({props, onProductAdded})
{
    let {product_id} = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const {eircode} = useParams();
    const [category, setCategory] = useState('');
    const [locationName, setLocationName] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get(`http://192.168.1.1:4000/api/data/${eircode}`)
        .then((response) => {
            setLocationName(response.data.LocationName);
        })
        .catch((error) => {
            console.error('Error fetching location Name:', error);
        });

        axios.get(`http://192.168.1.1:4000/api/foodcategories`)
        .then((response) => {
            setCategories(response.data);
        })
        .catch((error) => {
            console.error('Error fetching categories:', error);
        });

        axios.get(`http://192.168.1.1:4000/api/menu/${product_id}`)
        .then((response) => {
            setName(response.data.name);
            setPrice(response.data.price);
            setDescription(response.data.description);
            setLocationName(response.data.locationName);
            setCategory(response.data.category);
        })
        .catch(function (error) {
            console.log(error);
        })
    }, [eircode]);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Name: "+ name+ "Price:"+ price+ "Description"+ description+"Eircode"+ eircode+"Course"+ category);

        const product =
        {
            product_id: product_id,
            name:name,
            price:price,
            description:description,
            eircode: eircode,
            category:category
        }

        axios.put(`http://192.168.1.1:4000/api/menu/${product_id}`, product)
        .then((res) => { 
            onProductAdded();
            navigate(`/manager-mode`);
        })
        .catch((err) => console.log(err.data));
        
    }

    return (
        <div>
            <h1>Update Food Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name: </label>
                    <input type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => {setName(e.target.value)}}
                    required
                    />
                </div>
                <div className="form-group">
                    <label>Product Price: </label>
                    <input type="number"
                    className="form-control"
                    value={price}
                    onChange={(e) => {setPrice(e.target.value)}}
                    required
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
                    <label>Location Name: </label>
                    <input type="text"
                    className="form-control"
                    value={locationName}
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
                <input type="submit" value="Update Product"></input>
            </form>

        </div>
    )
}

export default EditProduct;