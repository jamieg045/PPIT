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

function App() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [cartCount, setCartCount] = useState(0);

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

  return (
    <LocationProvider>
      <Router>
        <div className="App">
          <Navbar bg="primary" data-bs-theme="dark">
            <Container>
              <Navbar.Brand>IHPOS</Navbar.Brand>
              {user ? (
                <LocationContext.Consumer>
                  {({ selectedLocation }) => (
                    selectedLocation ? (
                      <>
                      <Nav className="me-auto">
                        <Nav.Link as={Link} to={`/menu/${selectedLocation.Eircode}`}>Food</Nav.Link>
                        <Nav.Link as={Link} to={`/drinks/${selectedLocation.Eircode}`}>Drinks</Nav.Link>
                        {user.role === 'manager' && (
                          <>
                            <Nav.Link as={Link} to={`/add/${selectedLocation.Eircode}`}>Add New Food Product</Nav.Link>
                            <Nav.Link as={Link} to={`/addbeverage/${selectedLocation.Eircode}`}>Add New Beverage</Nav.Link>
                          </>
                        )}
                        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        </Nav>
                      <Nav>
                      <Link to="/cart" className="nav-link">
                        Cart ({cartCount})
                      </Link>
                    </Nav>
                    </>
                    ) : null
                  )}
                </LocationContext.Consumer>
              ) : null}
            </Container>
          </Navbar>
          <Routes>
            <Route path="/" element={<Log />} exact />
            <Route path="/register" element={<Login />} />
            <Route path="/add/:eircode" element={<AddProduct setCartCount={setCartCount}/>} exact />
            <Route path="/addbeverage/:eircode" element={<AddBeverage setCartCount={setCartCount}/>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/fail" element={<Fail />} />
            <Route path="/map" element={<MapComponent />} />
            <Route path="/menu/:eircode" element={<Home setCartCount={setCartCount} />} />
            <Route path="/drinks/:eircode" element={<Beverage setCartCount={setCartCount} />} />
            <Route path="/success" element={<Success />} />
            <Route path="/fail" element={<Fail />} />
          </Routes>
        </div>
      </Router>
    </LocationProvider>
  );
}

export default App;