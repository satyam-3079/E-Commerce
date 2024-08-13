import React, { useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'

const Openn = (props) => {
    const navigate = useNavigate();
    useEffect(()=>{
        let tok = localStorage.getItem('auth-token')
        let rol = localStorage.getItem('role')
        if(rol==='admin'){
            navigate('/loginasadmin')
        }
    },[])

    const {Component} = props

  return (
    <div>
        <Component/>
    </div>
  )
}

export default Openn