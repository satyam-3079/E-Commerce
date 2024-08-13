import React, { useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'

const Open = (props) => {
    const navigate = useNavigate();
    useEffect(()=>{
        let tok = localStorage.getItem('auth-token')
        let rol = localStorage.getItem('role')
        if(!tok){
            navigate('/login')
        }
    },[])

    const {Component} = props

  return (
    <div>
        <Component/>
    </div>
  )
}

export default Open