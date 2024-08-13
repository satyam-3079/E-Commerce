import React, { createContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";


const url = process.env.REACT_APP_BASE_URL
export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [admin, setAdmin] = useState(false);
    const [all_product, setAll_Product] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch products
                const res = await axios.get(`${url}/allproducts`);
                setAll_Product(res.data);

                // Fetch cart items if authenticated
                if (localStorage.getItem('auth-token') && localStorage.getItem("role") === "user") {
                    const cartRes = await fetch(url+'/getcart', {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'auth-token': `${localStorage.getItem('auth-token')}`,
                            'Content-Type': 'application/json',
                        },
                        body: ""
                    });
                    const cartData = await cartRes.json();
                    setCartItems(cartData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();

    }, []); // Empty dependency array to run only on mount

    const addToCart = async(itemId) => {
        setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        if (localStorage.getItem('auth-token') && localStorage.getItem("role") === "user") {
            const toastid= toast.loading("Loading...")
            try{
                const response=await fetch(url+'/addtocart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 'itemId': itemId })
                })
                const data=await response.json()
                if(!data.success){
                    throw new Error()
                }
                toast.success("Item Added successful")
            }
            catch(error) {
                toast.error("Something Went Wrong")
            }
            toast.dismiss(toastid)
        }
    }

    const removeFromCart = async(itemId) => {
        setCartItems(prev => ({ ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) }));
        if (localStorage.getItem('auth-token') && localStorage.getItem("role") === "user") {
            const toastid=toast.loading("Loading..")
            try{
                const response=await fetch(url+'/removefromcart', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'auth-token': `${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 'itemId': itemId })
                });
                const data=await response.json();
                if(data.success){
                    toast.success("Removed item Successful");
                }
                else{
                    throw new Error();
                }
            }
            catch(err){
                toast.error("Something Went Wrong")
            }
            toast.dismiss(toastid)
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find(product => product.id === Number(item));
                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                }
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    }

    const contextValue = {
        getTotalCartItems,
        getTotalCartAmount,
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        admin,
        setAdmin
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
