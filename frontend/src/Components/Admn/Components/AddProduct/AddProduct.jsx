import React, { useState } from 'react'
import AddP from './AddP'
import Sidebar from '../Sidebar/Sidebar'


const AddProduct = () => {
  return (

    <div style={{display:'flex'}}>
      <Sidebar/>
      {/* <h1>vnv</h1> */}
      <AddP/>
    </div>
   
  )
}

export default AddProduct