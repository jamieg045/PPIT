import { useState } from "react";
import axios from 'axios';
import { useNavigate , useParams} from "react-router-dom";
import { useEffect } from "react";

function AddBeverage() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const {eircode}= useParams();
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

        axios.get(`http://192.168.1.1:4000/api/drinkcategories`)
        .then((response) => {
            setCategories(response.data);
        })
        .catch((error) => {
            console.error('Error fetching categories:', error);
        });
    }, [eircode]);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Name: " + name + "Price:" + price + "Description" + description + "Eircode" + eircode + "Category" + category);

        const product =
        {
            name: name,
            price: price,
            description: description,
            eircode: eircode,
            category: category
        }

        axios.post('http://localhost:4000/api/drinks', product)
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err.data));
            navigate(`/manager-mode`);

    }

    return (
        <div>
            <h1>Insert Beverage Product</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Product Name: </label>
                    <input type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => { setName(e.target.value) }}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Product Price: </label>
                    <input type="number"
                        className="form-control"
                        value={price}
                        onChange={(e) => { setPrice(e.target.value) }}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Product Description: </label>
                    <input type="text"
                        className="form-control"
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
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
                    <label>Product Category: </label>
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

export default AddBeverage;