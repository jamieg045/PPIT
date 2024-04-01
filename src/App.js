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

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar bg="primary" data-bs-theme="dark">
          <Container>
            <Navbar.Brand href="/">IHPOS</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/menu">Home</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/add">Add New Food Product</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <Routes>
          <Route path='/' element={<Log></Log>} exact />
          <Route path='/login' element={<Login></Login>} />
          <Route path='/add' element={<AddProduct></AddProduct>} exact />
          <Route path='/cart' element={<Cart></Cart>}></Route>
          <Route path='/menu' element={<Home></Home>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
