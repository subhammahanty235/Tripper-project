
import React, { useState } from 'react'
import { CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import './Loginpage.css'
import { useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Loginpage = () => {
    const navigate = useNavigate();
    const [clickedregisterLink, setclickedregisterLink] = useState(window.innerWidth<=600 ? true : false);

    
    const [loading, setLoading] = useState(false)

    
    
    const showhideclick = () => {
        
        setclickedregisterLink(!clickedregisterLink)
        
    }
    //    states to store user's inputs
    const [logintonewTrip, setLogIntoNewTrip] = useState({
        name: "", emailId: "", password: "", tripName: ""
    })
    const [logintoexistingTrip, setLogIntoexistingTrip] = useState({
        name: "", emailId: "", password: "", tripId: ""
    })
    const onNewFilled = (e) => {
        setLogIntoNewTrip({ ...logintonewTrip, [e.target.name]: e.target.value })
    }
    const onExistingFilled = (e) => {
        setLogIntoexistingTrip({ ...logintoexistingTrip, [e.target.name]: e.target.value })
    } 
    // functions to send data to backend
    const loginToNewTrip_func = async (e) => {

        e.preventDefault();

        let ApiLink = process.env.REACT_APP_BACKEND_URL
        setLoading(true);
        const response = await fetch(`${ApiLink}/login/new-trip/`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: logintonewTrip.name, password: logintonewTrip.password, emailId: logintonewTrip.emailId, tripName: logintonewTrip.tripName })

        })
        const response_data = await response.json();
        setLoading(false)
        // clear the from
        setLogIntoNewTrip({
            name: "", emailId: "", password: "", tripName: ""
        })
        console.log(response_data)
        if (response_data.flag === true) {
            toast("Logged IN : Redirecting....")

            const res = await fetch(`${ApiLink}/sendmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: logintonewTrip.emailId, text: `dear ${logintonewTrip.name} , You have sucessfully created a new trip name ${logintonewTrip.tripName}. Trip Id generated for your trip id : ${response_data.tripid}. Shre this trip id to your friend to join them to your trip. Enjoy` })

            })
            localStorage.setItem('travel_Bill_splitter-login_details', response_data.authtoken);
            toast("Created successfully! redirecting..")
            navigate('/')
        }

        // console.log(logintonewTrip)


    }


    const loginToExistingTrip_func = async (e) => {
        e.preventDefault();
        setLoading(true)
        let ApiLink = process.env.REACT_APP_BACKEND_URL
        const response = await fetch(`${ApiLink}/login/existing-trip/`, {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: logintoexistingTrip.name, password: logintoexistingTrip.password, emailId: logintoexistingTrip.emailId, tripid: logintoexistingTrip.tripId })

        })
        // console.log(response)
        const response_data = await response.json();
        // clear the form
        console.log(response_data)
        
        if (response_data === false) {
            setLogIntoexistingTrip({
                name: "", emailId: "", password: "", tripId: ""
                
            })
            console.log("wrong pw")
            toast("Wrong Credentials , Try Again")
            setLoading(false)
        }
        else {
            setLogIntoexistingTrip({
                name: "", emailId: "", password: "", tripId: ""
            })

            if (response_data.flag === true) {
                localStorage.setItem('travel_Bill_splitter-login_details', response_data.authtoken);
                toast("Logged IN : Redirecting....")
                const res = await fetch(`${ApiLink}/sendmail`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: logintoexistingTrip.emailId, text: `dear ${logintoexistingTrip.name} , you have successfully logged in to your trip ` })

                })
                localStorage.setItem('travel_Bill_splitter-login_details', response_data.authtoken);

                // navigate('/')
                navigate('/')
            }
            setLoading(false)
        }




    }
   
    return (
        <>
            <div className="container  p-4">
                <h4 className={`text-center ${clickedregisterLink === true? 'logoleft' : 'logoright'} `}><span className='text-light'>T</span>ripper</h4>
                <div className="row main mt-5">

                    {/* <!-- sign up form --> */}

                    <div className={`col-md-6 p-5 ${clickedregisterLink === true} ?'d-block':'d-none'`}  id="signUp">
                        <h5 className="text-center header-text">Login and register new trip</h5>
                        <form className="d-flex justify-content-center mt-4">
                            <div className="w-75 ">
                                <div className="form-group">
                                    <label htmlFor="" >Trip Name</label>
                                    <input type="text" name='tripName' onChange={onNewFilled} value={logintonewTrip.tripName} />
                                </div>
                                <div className="form-group my-2">
                                    <label htmlFor="" >Your Name</label>
                                    <input type="text" name='name' onChange={onNewFilled} value={logintonewTrip.name} />
                                </div>
                                <div className="form-group my-2">
                                    <label htmlFor="" >Create a new password</label>
                                    <input type="password" name='password' onChange={onNewFilled} value={logintonewTrip.password} />
                                </div>
                                <div className="form-group my-2">
                                    <label htmlFor="">email Id</label>
                                    <input type="email" name='emailId' onChange={onNewFilled} value={logintonewTrip.emailId} />
                                </div>

                                <button className='button' type="submit" onClick={loginToNewTrip_func}>{loading === true ? <CircularProgress /> : 'Login'}</button>
                                <div className="d-flex justify-content-between mt-5">
                                    <a className="links" id="loginLink" onClick={showhideclick}>Have a Trip Id? Login with that id</a>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* <!-- Login Form  --> */}


                    <div className={`col-md-6 p-5 ${clickedregisterLink === true ? 'd-none' : 'd-block'} `} id="login">
                        <h5 className=" text-center header-text">Login with existing trip id</h5>
                        <form className="d-flex justify-content-center mt-4">
                            <div className="w-75 ">
                                <div className="form-group">
                                    <label htmlFor="">Name</label>
                                    <input type="text" name='name' onChange={onExistingFilled} value={logintoexistingTrip.name} />
                                </div>
                                <div className="form-group my-2">
                                    <label htmlFor="">Email Id</label>
                                    <input type="email" name='emailId' onChange={onExistingFilled} value={logintoexistingTrip.emailId} />
                                </div>
                                <div className="form-group my-2">
                                    <label htmlFor=""> Create Password/Enter Old Password </label>
                                    <input type="password" name='password' onChange={onExistingFilled} value={logintoexistingTrip.password} />
                                </div>
                                <div className="form-group my-2">
                                    <label htmlFor="">Trip Id</label>
                                    <input type="text" name='tripId' onChange={onExistingFilled} value={logintoexistingTrip.tripId} />
                                </div>
                                <button className='button' type="submit" onClick={loginToExistingTrip_func}>{loading === true ? <CircularProgress /> : 'Login'}</button>
                                <div className="d-flex justify-content-between mt-5">
                                    <a className="links" id="registerLink" onClick={showhideclick}>Want to create a new Trip?</a>

                                </div>
                            </div>
                        </form>
                    </div>
                    <div id="overlay" className={`${clickedregisterLink === true ? 'overlay1' : 'overlay2'}`}>
                        {/* <div id="overlay"> */}

                    </div>
                </div>

            </div>
            <ToastContainer />
        </>
    )
}

export default Loginpage