import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom'
import Home from './mycomponents/home';
import Login from './mycomponents/login';
import AddProduct from './mycomponents/addproduct';
import Cart from './mycomponents/cart';
import Log from './mycomponents/log';
import Success from './mycomponents/success';
import Fail from './mycomponents/fail';
import Beverage from './mycomponents/beverage';
import AddBeverage from './mycomponents/addbeverage';

function App() {
  const isLoggedin = sessionStorage.getItem('user');

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    window.location.replace('/');
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar bg="primary" data-bs-theme="dark">
          <Container>
            <Navbar.Brand>IHPOS</Navbar.Brand>
            {isLoggedin ? (
              <Nav className="me-auto">
              <Nav.Link href="/menu">Food</Nav.Link>
              <Nav.Link href="/drinks">Drinks</Nav.Link>
              <Nav.Link href="/add">Add New Food Product</Nav.Link>
              <Nav.Link href="/addbeverage">Add New Beverage</Nav.Link>
              <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
            </Nav>
            ) : null}
          </Container>
        </Navbar>
        <Routes>
          <Route path='/' element={<Log></Log>} exact />
          <Route path='/login' element={<Login></Login>} />
          <Route path='/add' element={<AddProduct></AddProduct>} exact />
          <Route path='/addbeverage' element={<AddBeverage></AddBeverage>}></Route>
          <Route path='/cart' element={<Cart></Cart>}></Route>
          <Route path='/menu' element={<Home></Home>}></Route>
          <Route path ='/success' element={<Success></Success>}></Route>
          <Route path='/fail' element={<Fail></Fail>}></Route>
          <Route path='/drinks' element={<Beverage></Beverage>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;