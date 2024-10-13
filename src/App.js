import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './mycomponents/home';
import Login from './mycomponents/login';
import AddProduct from './mycomponents/addproduct';
import Cart from './mycomponents/cart';
import Log from './mycomponents/log';
import Fail from './mycomponents/fail';
import Beverage from './mycomponents/beverage';
import AddBeverage from './mycomponents/addbeverage';
import MapComponent from './mycomponents/mapcomponent';
import Grocery from './mycomponents/grocery';
import { LocationContext, LocationProvider } from './mycomponents/locationcontext';
import { Link } from 'react-router-dom';
import Success from './mycomponents/success';
import ForgotPassword from './mycomponents/forgotpassword';
import ResetPassword from './mycomponents/resetpassword';
import axios from 'axios';

function App() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  console.log('Logged in user:', user);
  const [cartCount, setCartCount] = useState(0);
  const [locationClassification, setLocationClassification] = useState(null);

  useEffect(() => {
    // Load cart from sessionStorage and calculate item count
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(itemCount);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('cart');
    window.location.replace('/');
  };

  const fetchLocationClassification = (eircode) => {
    axios.get(`http://192.168.1.1:4000/api/data/${eircode}`)
    .then((response) => {
      setLocationClassification(response.data.LocationClassification);
    })
    .catch((error) => {
      console.log('Error fetching location classification', error);
    })
  }

  useEffect(() => {
    if (user?.eircode) {
      fetchLocationClassification(user.eircode); // Fetch classification based on user eircode
    }
  }, [user?.eircode]);

  return (
    <LocationProvider>
      <Router>
        <div className="App">
          <Navbar bg="primary" data-bs-theme="dark">
            <Container>
              <Navbar.Brand>IHPOS</Navbar.Brand>
              {user ? (
                <>
                  {user.role === 'admin' || user.role === 'customer' ? (
                    <LocationContext.Consumer>
                      {({ selectedLocation }) => (
                        selectedLocation ? (
                          <>
                            <Nav className="me-auto">
                              {locationClassification !== 'Grocery' || 'Pub' && (
                                <Nav.Link as={Link} to={`/menu/${selectedLocation.Eircode}`}>Food</Nav.Link>
                              )}
                              <Nav.Link as={Link} to={`/drinks/${selectedLocation.Eircode}`}>Drinks</Nav.Link>
                            </Nav>
                            <Nav>
                              <Link to="/cart" className="nav-link">
                                Cart ({cartCount})
                              </Link>
                            </Nav>
                          </>
                        ) : (
                          <p>Select a location...</p>
                        )
                      )}
                    </LocationContext.Consumer>
                  ) : (
                    // This block for employees, supervisors, and managers
                    <>
                      <Nav className="me-auto">
                        <Nav.Link as={Link} to={`/menu/${user.eircode}`}>Food</Nav.Link>
                        <Nav.Link as={Link} to={`/drinks/${user.eircode}`}>Drinks</Nav.Link>
                        {user.role === 'manager' && (
                          <>
                            <Nav.Link as={Link} to="/add">Add New Food Product</Nav.Link>
                            <Nav.Link as={Link} to={`/addbeverage/${user.eircode}`}>Add New Beverage</Nav.Link>
                          </>
                        )}
                      </Nav>
                      <Nav>
                        <Link to="/cart" className="nav-link">
                          Cart ({cartCount})
                        </Link>
                      </Nav>
                    </>
                  )}
                  <Nav>
                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  </Nav>
                </>
              ) : null}
            </Container>
          </Navbar>
          <Routes>
            <Route path="/" element={<Log />} exact />
            <Route path="/register" element={<Login />} />
            <Route path="/add/:eircode" element={<AddProduct setCartCount={setCartCount} />} exact />
            <Route path="/addbeverage/:eircode" element={<AddBeverage setCartCount={setCartCount} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/fail" element={<Fail />} />
            <Route path="/map" element={<MapComponent />} />
            <Route path="/menu/:eircode" element={<Home setCartCount={setCartCount} />} />
            <Route path="/drinks/:eircode" element={<Beverage setCartCount={setCartCount} />} />
            <Route path="/success" element={<Success />} />
            <Route path="/fail" element={<Fail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword></ResetPassword>} />
          </Routes>
        </div>
      </Router>
    </LocationProvider>
  );
}

export default App;