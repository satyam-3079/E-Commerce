import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'
import Sidebar from '../Sidebar/Sidebar';
import toast from 'react-hot-toast';
const url= process.env.REACT_APP_BASE_URL

const AddP = () => {

  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  })

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  }
  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value })
  }
  const Add_Product = async (e) => {
    let responseData;
    let product = productDetails;
    let formData = new FormData();
    formData.append('product', image);
    let toastid=toast.loading('Loading...')
    try{
      await fetch(url+'/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData
      }).then((resp) => resp.json()).then((data) => { responseData = data })
      if (responseData.success) {
        product.image = responseData.image_url;
        await fetch(url+'/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product)
        }).then((resp) => { return resp.json() }).then((data) => {
          if(data.success) { 
            toast.success('Product Added SUccessfully')
           }
          else{
            throw new Error()
          }
        })
      }
    }
    catch(err){
      toast.error("Something Went Wrong")
    }
    toast.dismiss(toastid)
    
  }
  return (
    <div className='add-product'>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type Here' />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='type here' />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='type here' />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
          <option value="woman">Woman</option>
          <option value="men">Men</option>
          <option value="kid">Kids</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={image ? URL.createObjectURL(image) : upload_area} className='addproduct-thumbnail-img' alt="" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>
      <button onClick={() => { Add_Product() }} className='addproduct-btn'>ADD</button>
    </div>
  )
}

export default AddP