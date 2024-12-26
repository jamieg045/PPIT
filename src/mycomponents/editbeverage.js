import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

function EditBeverage({ onProductUpdated }) {
    const { product_id, eircode } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [locationName, setLocationName] = useState('');
    const [categories, setCategories] = useState([]);

    // Fetch data
    useEffect(() => {
        // Fetch location name
        axios.get(`http://192.168.1.1:4000/api/data/${eircode}`)
            .then((response) => setLocationName(response.data.LocationName))
            .catch((error) => console.error('Error fetching location name:', error));

        // Fetch categories
        axios.get(`http://192.168.1.1:4000/api/drinkcategories`)
            .then((response) => setCategories(response.data))
            .catch((error) => console.error('Error fetching categories:', error));

        // Fetch product details
        axios.get(`http://192.168.1.1:4000/api/drinks/products/${product_id}`)
            .then((response) => {
                console.log('API Response:', response.data);
                const product = response.data;
                setName(product.name || '');
                setPrice(product.price || 0);
                setDescription(product.description || '');
                setCategory(product.category || '');
            })
            .catch((error) => console.error('Error fetching product details:', error));
    }, [product_id, eircode]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedProduct = {
            product_id,
            name,
            price,
            description,
            eircode,
            category,
        };

        axios.put(`http://192.168.1.1:4000/api/drinks/products/${product_id}`, updatedProduct)
            .then((res) => {
                if (onProductUpdated) onProductUpdated();
                navigate(`/manager-mode`);
            })
            .catch((error) => console.error('Error updating product:', error));
    };

    return (
        <div>
            <h1>Update Beverage Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name || ''}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Product Price:</label>
                    <input
                        type="number"
                        className="form-control"
                        value={price || ''}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Product Description:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={description || ''}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Location Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={locationName}
                        disabled
                    />
                </div>
                <div className="form-group">
                    <label>Product Category:</label>
                    <select
                        className="form-control"
                        value={category || ''}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Update Product</button>
            </form>
        </div>
    );
}

export default EditBeverage;
