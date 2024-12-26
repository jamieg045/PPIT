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
import { LocationContext, LocationProvider } from './mycomponents/locationcontext';
import { Link } from 'react-router-dom';
import Success from './mycomponents/success';
import ForgotPassword from './mycomponents/forgotpassword';
import ResetPassword from './mycomponents/resetpassword';
import axios from 'axios';
import QRScanner from './mycomponents/QRScanner';
import RedirectHandler from './mycomponents/redirecthandler';
import Booking from './mycomponents/booking';
import ManagerOptions from './mycomponents/manageroptions';
import ManagerMode from './mycomponents/managermode';
import ManagerMenu from './mycomponents/managermenu';
import ManagerEmployees from './mycomponents/manageremployees';
import TablePlan from './mycomponents/tableplan';
import LocationSettings from './mycomponents/locationsettings';
import EditProduct from './mycomponents/editproduct';
import EditBeverage from './mycomponents/editbeverage';

function App() {
  const user = JSON.parse(sessionStorage.getItem('user')) || null;
  console.log('Logged in user:', user);
  const tableNumber = JSON.parse(sessionStorage.getItem('tablenumber')) || null;
  const [cartCount, setCartCount] = useState(0);
  const [locationClassification, setLocationClassification] = useState(null);
  const [hasFoodItems, setHasFoodItems] = useState(true);

  useEffect(() => {
    // Load cart from sessionStorage and calculate item count
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(itemCount);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('cart');
    sessionStorage.removeItem('tablenumber');
    window.location.replace('/');
  };

  const fetchLocationClassification = (eircode) => {
    if(!eircode) return;
    axios.get(`http://192.168.1.1:4000/api/data/${eircode}`)
    .then((response) => {
      setLocationClassification(response.data.LocationClassification);
    })
    .catch((error) => {
      console.log('Error fetching location classification', error);
    })
  }

  const checkFoodAvailability = (eircode) => {
    axios.get(`http://192.168.1.1:4000/api/menu/check-food/${eircode}`)
        .then((response) => {
            console.log('Food availability response:', response.data);
            setHasFoodItems(response.data.hasFoodItems);
        })
        .catch((error) => {
            console.error('Error checking food availability:', error);
            setHasFoodItems(false); // Default to false if an error occurs
        });
};

  useEffect(() => {
    if (user?.eircode) {
      fetchLocationClassification(user.eircode); // Fetch classification based on user eircode
      checkFoodAvailability(user.eircode);
    }
  }, [user?.eircode]);

  return (
    <LocationProvider>
      <Router>
        <div className="App">
          <Navbar bg="primary" data-bs-theme="dark">
            <Container>
              <Navbar.Brand>IHPOS</Navbar.Brand>
              {user && <RedirectHandler hasFoodItems={hasFoodItems} eircode={user?.eircode} /> ? (
                <>
                  {['Admin', 'Customer'].includes(user.role) ? (
                    <LocationContext.Consumer>
                      {({ selectedLocation }) => (
                        selectedLocation ? (
                          <>
                            <Nav className="me-auto">
                              {locationClassification !== 'Pub' && hasFoodItems && (
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
                      {locationClassification !== 'Pub' && hasFoodItems && (
                        <Nav.Link as={Link} to={`/menu/${user.eircode}`}>Food</Nav.Link>
                      )}
                        <Nav.Link as={Link} to={`/drinks/${user.eircode}`}>Drinks</Nav.Link>
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
            <Route path="/" element={<Log />} />
            <Route path="/register" element={<Login />} />
            <Route path="/add/:eircode" element={<AddProduct setCartCount={setCartCount} onProductAdded={() => checkFoodAvailability(user?.eircode)} />} exact />
            <Route path="/edit/:eircode" element={<EditProduct setCartCount={setCartCount} onProductAdded={() => checkFoodAvailability(user?.eircode)} />} exact />
            <Route path="/addbeverage/:eircode" element={<AddBeverage setCartCount={setCartCount} />} />
            <Route path="/editbeverage/:eircode/:product_id" element={<EditBeverage setCartCount={setCartCount} />} />
            <Route path="/cart" element={<Cart setCartCount={setCartCount}/>} />
            <Route path="/fail" element={<Fail />} />
            <Route path="/map" element={<MapComponent />} />
            <Route path="/menu/:eircode" element={<Home setCartCount={setCartCount} />} />
            <Route path="/drinks/:eircode" element={<Beverage setCartCount={setCartCount} />} />
            <Route path="/success" element={<Success />} />
            <Route path="/fail" element={<Fail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword></ResetPassword>} />
            <Route path='/scan-qr' element={<QRScanner />} />
            <Route path='/booking/:eircode' element={<Booking></Booking>} />
            <Route path="/manager-options" element={<ManagerOptions eircode={user?.eircode} />} />
            <Route path="/manager-mode" element={<ManagerMode />} />
            <Route path="/manage-menu" element={<ManagerMenu eircode={user?.eircode} />} />
            <Route path="/manage-employees" element={<ManagerEmployees eircode={user?.eircode} />} />
            <Route path="/table-plan" element={<TablePlan eircode={user?.eircode} />} />
            <Route path="/location-settings" element={<LocationSettings eircode={user?.eircode} />} />
            {/* <Route path="/reports" element={<Reports eircode={user?.eircode} />} /> */}
          </Routes>
        </div>
      </Router>
    </LocationProvider>
  );
}

export default App;