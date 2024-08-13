import React from 'react'
import './Sidebar.css'
import {Link} from 'react-router-dom'
import add_product_icon from '../../assets/Product_Cart.svg'
import list_product_icon from '../../assets/Product_list_icon.svg'
import logout from '../../assets/image.png'

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Link to={'/addproduct'} style={{textDecoration:'none'}}>
            <div className="sidebar-item">
                <img src={add_product_icon} alt="" />
                <p>Add Product</p>
            </div>
        </Link>
        <Link to={'/listproduct'} style={{textDecoration:'none'}}>
            <div className="sidebar-item">
                <img src={list_product_icon} alt="" />
                <p>Product List</p>
            </div>
        </Link>
        <div className="sidebar-item">
            <button style={{width:"100%",border:"none",display:"flex", padding:"10px",alignItems:'center',justifyContent:"space-evenly"}}onClick={()=>{localStorage.removeItem('auth-token');localStorage.removeItem('role');window.location.replace('/')}}>
                <img src={logout} alt="" width={40} style={{}}/>
                <p style={{fontSize:"17px", fontFamily:"Poppins", color:"#551aa9"}}>Logout</p>
            </button>
        </div>

    </div>
  )
}

export default Sidebar