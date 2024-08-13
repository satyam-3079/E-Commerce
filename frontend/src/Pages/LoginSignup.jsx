import React, { useContext, useState } from 'react'
import './CSS/LoginSignup.css'
import { ShopContext } from '../Context/ShopContext';
import {useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
const url = process.env.REACT_APP_BASE_URL
const LoginSignup = () => {
  // const [admin,setAdmin]=useState(false);
  const { admin, setAdmin } = useContext(ShopContext)
  const navigate = useNavigate();

  const [state, setState] = useState("Login")
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',

  })

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const login = async () => {
    let responseData;

    const toastid = toast.loading('Loading...')
    try {
      await fetch(url+'/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData, admin),
      })
        .then((resp) => resp.json())
        .then((data) => responseData = data)

      if (responseData.success) {
        toast.success('Login Successfull ')
        localStorage.setItem('auth-token', responseData.token);
        localStorage.setItem('role', responseData.user);
        window.location.replace("/");
      }
      else{
        throw new Error()
      }
    }
    catch(err) {
      toast.error("Something Went Wrong")
    }

    toast.dismiss(toastid)
  }
  const signup = async () => {
    let responseData;
    const toastid=toast.loading("Loading...")
    try{
      await fetch(url+'/signup', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData, admin),
      }).then((resp) => resp.json()).then((data) => responseData = data)

      if (responseData.success) {
        toast.success("SignUp successful..!")
        localStorage.setItem('auth-token', responseData.token);
        localStorage.setItem('role', responseData.user);
        window.location.replace('/loginasadmin')
    } 
    else {
      throw new Error()
    }
  }
    catch(err){
      toast.error("Something Went Wrong")
    }
    toast.dismiss(toastid)
  }
  const loginHandleer = () => {
    if (admin === false) {
      // isNotAdmin()
      state === 'Login' ? login() : signup()
    }
    else {
      // isAdmin()
      state === 'Login' ? loginasadmin() : signupasadmin()
      setAdmin(true)
      // return <Navigate to={"/loginasadmin"}/>
    }
  }

  const loginasadmin = async () => {
    let responseData;
    const toastid=toast.loading("Loading...")
    try{
      await fetch(url+'/loginasadmin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      }).then((resp) => resp.json()).then((data) => responseData = data)
  
      if (responseData.success) {
        toast.success("Admin Login Successful")
        localStorage.setItem('auth-token', responseData.token);
        localStorage.setItem('role', responseData.user);
        window.location.replace('/loginasadmin')
      } else {
        throw new Error()
      }
    }
    catch(error){
      toast.error("Something Went Wrong")
    }
    toast.dismiss(toastid)
  }
  const signupasadmin = async () => {
    let responseData;
    const toastid=toast.loading("Loading")
    try{
      await fetch(url+'/signupasadmin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      }).then((resp) => resp.json()).then((data) => responseData = data)
  
      if (responseData.success) {
        toast.success("Admin SignUp successful")
        localStorage.setItem('auth-token', responseData.token);
        localStorage.setItem('role', responseData.user);
        window.location.replace('/loginasadmin')
      } else {
        throw new Error()
      }
    }
    catch(error){
      toast.error("Something Went Wrong")
    }
    toast.dismiss(toastid)

  }


  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === 'Sign Up' ? <input type="text" value={formData.username} name='username' onChange={changeHandler} placeholder='Your Name' /> : null}
          <input type="email" name='email' onChange={changeHandler} value={formData.email} placeholder='Email Address' />
          <input type="password" onChange={changeHandler} name='password' value={formData.password} placeholder='password' />
        </div>
        <button onClick={loginHandleer}>{state}</button>
        {state === 'Sign Up' ?
          <p className="loginsignup-login">Already have an Account ? <span style={{ cursor: 'pointer' }} onClick={() => { setState('Login') }}>Login Here</span></p> :
          <p className="loginsignup-login">Don't have an Account ? <span style={{ cursor: 'pointer' }} onClick={() => { setState('Sign Up') }}>Create Account</span></p>
        }
        <div className="loginsignup-agree">
          <input type="checkbox" onChange={(e) => { setAdmin(e.target.checked); console.log(e.target.checked) }} name='' id='' />
          <p>Login as Admin</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup