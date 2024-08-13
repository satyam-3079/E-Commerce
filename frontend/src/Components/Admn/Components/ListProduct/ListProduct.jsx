import React, { useEffect, useState } from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'
import Sidebar from '../Sidebar/Sidebar';
import toast from 'react-hot-toast';
const url = process.env.REACT_APP_BASE_URL

const ListProduct = () => {

  const [allProducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch(url+'/allproducts')
      .then((resp) => resp.json())
      .then((data) => {
        setAllProducts(data);
      })
  }

  useEffect(() => {
    fetchInfo();
  }, [])

  const remove_product=async(id)=>{
    const toastid= toast.loading('loading..')
    try{
      const response=await fetch(url+'/removeproduct',{
        method:'POST',
        headers:{
          Accept:'application/json',
          'Content-Type':'application/json'
        },
        body:JSON.stringify({id:id})
      })

      const data=await response.json();
      await fetchInfo()
      if(data.success){
        toast.success('Remove Product Successfully')
      }else{
        throw new Error()
      }
    }catch(err){
        toast.error('Failed')
    }
    toast.dismiss(toastid)
    
  }

  return (
    <div style={{display:'flex'}}>
      <Sidebar/>
      <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allProducts.map((product, inedx) => {
          return <div key={inedx}>
            <div className="listproduct-format-main listproduct-format">
              <img src={product.image} alt="" className="listproduct-product-icon" />
              <p>{product.name}</p>
              <p>${product.old_price}</p>
              <p>${product.new_price}</p>
              <p>{product.category}</p>
              <img onClick={()=>{remove_product(product.id)}} src={cross_icon} className='listproduct-remove-icon' alt="" />
            </div>
            <hr />
          </div>
        })}
      </div>
    </div>
    </div>
  )
}

export default ListProduct