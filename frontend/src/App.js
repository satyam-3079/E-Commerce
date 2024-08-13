import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Shop from './Pages/Shop'
import ShopCategory from './Pages/ShopCategory'
import Product from './Pages/Product'
import Cart from './Pages/Cart'
import LoginSignup from './Pages/LoginSignup'
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/banner_mens.png'
import women_banner from './Components/Assets/banner_women.png'
import kid_banner from './Components/Assets/banner_kids.png'
import Admn from './Components/Admn/Admn'
import AddProduct from './Components/Admn/Components/AddProduct/AddProduct';
import ListProduct from './Components/Admn/Components/ListProduct/ListProduct';
import { useEffect, useState } from 'react';
import Nav from './Components/Admn/Components/Navbar/Navbar'
import Protected from './Components/Protected/Protected';
import Open from './Components/Protected/Open';
import Openn from './Components/Protected/Openn';

function App() {
  const [admin,setAdmin]=useState(false)
  useEffect(()=>{
    if(localStorage.getItem("role")==="admin"){
      setAdmin(true)
    }
  },[])
  return (
    <div className="App">
      {
       admin? <Nav/>:<Navbar/>
      }
      <Routes>
        <Route path='/' element={<Openn Component={Shop}/>}/>
        <Route path='/mens' element={<ShopCategory banner={men_banner} category="men"/>}/>
        <Route path='/womens' element={<ShopCategory banner={women_banner} category="women"/>}/>
        <Route path='/kids' element={<ShopCategory banner={kid_banner} category="kid"/>}/>
        <Route path='/product' element={<Product/>}>
          <Route path=':productId' element={<Product/>}/>
        </Route>
        <Route path='/cart' element={<Open Component={Cart}/>}/>
        <Route path='/login' element={<LoginSignup/>}/>
        
        <Route path='/loginasadmin/' element={<Protected Component={Admn}/>}/>  
        <Route path='/signupasadmin/' element={<Protected Component={Admn}/>}> 
         </Route>
         <Route path='/addproduct' element={<Protected Component={AddProduct}/>} />
         <Route path='/listproduct' element={<Protected Component={ListProduct}/>} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
