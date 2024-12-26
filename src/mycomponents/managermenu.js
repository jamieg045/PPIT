import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ManagerMenu({ eircode }) {
    const [showProductTypePrompt, setShowProductTypePrompt] = useState(false);
    const [actionType, setActionType] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [productList, setProductList] = useState([]);
    const navigate = useNavigate();

    const handleAddProduct = () => {
        setActionType('add');
        setShowProductTypePrompt(true);
    };

    const handleEditProduct = () => {
        setActionType('edit');
        setShowProductTypePrompt(true);
    };

    const handleProductTypeSelection = (type) => {
        setShowProductTypePrompt(false);
        setSelectedType(type);
        if (actionType === 'add') {
            navigate(type === 'Food' ? `/add/${eircode}` : `/addbeverage/${eircode}`);
        } else if (actionType === 'edit') {
            fetchProductList(type);
        }
    };

    const fetchProductList = async (type) => {
        try {
            // Determine the appropriate endpoint based on the type
            const endpoint = type === 'Food'
                ? `http://192.168.1.1:4000/api/menu/${eircode}`
                : `http://192.168.1.1:4000/api/drinks/${eircode}`;
    
            // Make the API request
            const response = await axios.get(endpoint);
    
            // Update the state with the fetched product list
            setProductList(response.data);
        } catch (error) {
            console.error('Error fetching product list:', error);
        }
    };

    const handleEditClick = (product) => {
        const targetRoute = selectedType === 'Food'
            ? `/edit/${eircode}/${product.product_id}`
            : `/editbeverage/${eircode}/${product.product_id}`;
        navigate(targetRoute);
    };

    return (
        <div className="manage-menu-controller">
            <h1>Manage Menu</h1>
            <button className="btn btn-primary" onClick={handleAddProduct}>
                Add New Product
            </button>
            <button className="btn btn-secondary" onClick={handleEditProduct}>
                Edit Products
            </button>

            {showProductTypePrompt && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1000,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "5px",
                            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                            zIndex: 1001,
                        }}
                    >
                        <h2>Select Product Type</h2>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleProductTypeSelection('Food')}
                        >
                            Food
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handleProductTypeSelection('Beverage')}
                        >
                            Beverage
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => setShowProductTypePrompt(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {actionType === 'edit' && productList.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h2>{`Edit ${selectedType} Items`}</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Name</th>
                                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Price (€)</th>
                                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Category</th>
                                <th style={{ padding: '10px', border: '1px solid #dee2e6' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productList.map((product) => (
                                <tr key={product.product_id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                    <td style={{ padding: '10px' }}>{product.name}</td>
                                    <td style={{ padding: '10px' }}>{product.price.toFixed(2)}</td>
                                    <td style={{ padding: '10px' }}>{product.category}</td>
                                    <td style={{ padding: '10px' }}>
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleEditClick(product)}
                                            style={{ marginRight: '10px' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                                    axios.delete(`http://192.168.1.1:4000/api/${selectedType.toLowerCase()}/${eircode}/${product.id}`)
                                                        .then(() => fetchProductList(selectedType))
                                                        .catch(err => console.error('Error deleting product:', err));
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {actionType === 'edit' && productList.length === 0 && selectedType && (
                <p>No products found for the selected type.</p>
            )}
        </div>
    );
}

export default ManagerMenu;