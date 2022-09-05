import React, { useState } from 'react'
import './homepage.css'
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loadingscreen from './Loadingscreen';
import Logo from '../../media/logo.png'

const Homepage = () => {
    let selectedusers = []
    let otherUsers = []
    const navigate = useNavigate()
    const [mydata, setMyData] = useState({});
    const [tripData, setTripData] = useState({})
    // const [selectedmem, setSelectedMem] = useState(selectedusers);
    const [loading, setLoading] = useState(false)
    const [username, setUserName] = useState("")
    const [otherUser, setOtherUses] = useState(otherUsers)
    const Api_Link = process.env.REACT_APP_BACKEND_URL

    const [newtranDetails, setnewtranDetails] = useState({
        expenseTitle: "", amount: 0
    })


    // function to add members to payment list by checking the checkbox -->
    const onaddtolist = (e) => {
        if (e.target.checked) {
            selectedusers.push(e.target.value)
        }
        else {
            if (selectedusers.length === 1) {
                selectedusers.pop()
            }
            else {
                for (var i = 0; i < selectedusers.length; i++) {
                    if (selectedusers[i] === e.target.value) {
                        selectedusers.splice(i, 1);
                        break

                    }
                }

            }
        }
    }
    // <----

    const getuserdata = async (userid) => {
        const id = await fetch(`${Api_Link}/user/searchdetails/${mydata.expenseDetailstopay.paidBy}`)
        const data = await id.json();
        
        setUserName(data.name)
    }

    
    const getMyDetails = async () => {
        setLoading(true)
        const data = await fetch(`${Api_Link}/user/me`, {
            method: "POST",
            headers: {
                "auth-token": localStorage.getItem('travel_Bill_splitter-login_details'),
                "Content-Type": "application/json",
            },


        })

        const maindata = await data.json()
        setMyData(maindata.user);
        setTripData(maindata.trip);
        setLoading(false)

    }

    const onfilled = (e) => {
        setnewtranDetails({ ...newtranDetails, [e.target.name]: e.target.value })
    }
    const new_Transaction = async () => {

        
        const transaction = await fetch(`${Api_Link}/user/new-transaction`, {
            method: "PUT",
            headers: {
                "auth-token": localStorage.getItem('travel_Bill_splitter-login_details'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                expenseTitle: newtranDetails.expenseTitle,
                users: selectedusers,
                amount: newtranDetails.amount,
                tripId: tripData._id
            })
        })

        let res = await transaction.json()
        setnewtranDetails({ expenseTitle: "", amount: 0 })
        
        if (res === true) {
            toast("Sucessfully added")
            toast("Paid sucessfully! Please Refresh")
            const res =await fetch(`${Api_Link}/sendmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email:mydata.emailId , text: `Transaction added . paid : Payment splitted with : ${selectedusers} , amount : ${newtranDetails.amount} , Transaction date : ${Date.now} , Paid For : ${newtranDetails.expenseTitle
                })}` })

            })
        }
        else {
            toast("Can't add , maybe some error occured")
        }
    }


    // log out function
    const logOut = () => {
        localStorage.removeItem('travel_Bill_splitter-login_details')
        navigate('login')
    }

    useEffect(() => {
        if (!localStorage.getItem('travel_Bill_splitter-login_details')) {
            navigate('/login')
        }
    })
    // const addtoOtherUsers = async () => {
    //     let len = tripData.users?.length
    //     for (let i = 0; i < len; i++) {
    //         let data = await fetch(`http://localhost:5000/api/v1/user/searchdetails/${tripData.users[i]}`, {
    //             method: "GET"
    //         });
    //         data = await data.json()
    //         //    data ="subham"
    //         // console.log(data)
    //         otherUsers.push("subham")

    //         // console.log(otherUsers)
    //     }
    // }

    const pay_bill = async (data) => {
        const transaction = await fetch(`${Api_Link}/user/paymoney`, {
            method: "POST",
            headers: {
                "auth-token": localStorage.getItem('travel_Bill_splitter-login_details'),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                amount: data.amount,

                payingTo: data.paidBy,
                tripId: tripData._id,
                payingfor: data.expenseTitle,
            })
        })

        let tra = await transaction.json()
        
        if (tra === true) {
            toast("Paid sucessfully! Please Refresh")
            const res =await fetch(`${Api_Link}/sendmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email:mydata.emailId , text: `Bill paid : Paid To : ${data.paidBy} , amount : ${data.amount} , Transaction date : ${Date.now} , Paid For : ${data.expenseTitle
                })}` })

            })
            
        }
        else {
            toast("Unsucessful! Some error occured")
        }

    }

    useEffect(() => {
        getMyDetails();
        
        // addtoOtherUsers();

        // addtoOtherUsers()
        // console.log(otherUser)
        // console.log(tripData.users?.length);
        // console.log(tripData)

    }, [])

    return (loading === false ?
        <div className="mainsection">

            <div className="header container">
                <nav className="navbar">
                    <div className="tripDetails d-flex flex-column mx-3">
                        <p className='tripname p-0 m-0'>Trip Name : {tripData.tripName}</p>
                        <p className='tripid p-0'>Trip ID: {tripData.tripID}</p>

                    </div>
                    <h1 className='logo'>Tripper</h1>
                    <div className="userandlogout d-flex mb-3">
                        <h5 className='tripname p-0 m-0'>User: {mydata.name}</h5>
                        <button className='btn btn-outline-success btn-sm mx-2' onClick={logOut}>logout</button>
                    </div>
                </nav>
            </div>

            <div className="bodysection container">
                <div className="paidForm">
                    <div className="mainform">
                        <h5 className='text-center mt-3 text'>Enter Details About Your Payment</h5>
                        <div className="inputs m-4">
                            <div className="form-group">
                                <label htmlFor="" >I have bought :</label>
                                <input type="text" name='expenseTitle' onChange={onfilled} value={newtranDetails.expenseTitle} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="" >Of amount</label>
                                <input type="text" name='amount' onChange={onfilled} value={newtranDetails.amount} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="" >And i am tagging </label>
                                <div className="tagbox my-3 my-3">

                                    {
                                    

                                        tripData.users?.map((user) => {

                                            if (user != mydata.name)
                                                return (
                                                    <div key={user} className="selectBox">
                                                        <p>{user}</p>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" value={user} onChange={onaddtolist} id="flexCheckChecked" />

                                                        </div>

                                                    </div>
                                                )

                                        })
                                    

                                    }
                                </div>
                                <div className='buttonbox'>
                                    <button className='submitbutton' onClick={new_Transaction}>Submit</button>
                                </div>
                            </div>

                        </div>


                    </div>
                </div>
                <div className="allTripdetails">
                    <div className="mainsectionBudget">
                        <div className="totaltripbudget"><h3>Total Trip Budget is : {tripData.budgetTotal}</h3></div>
                        <div className="cards">
                            <div className="totalIPaid">
                                <div className="innerdivtotalIPaid">
                                    <h5 className='text-center'>Total Money I have paid For Others </h5>
                                    <h4 className='text-center'>{mydata.totalAmountpaid}</h4>
                                    <span><button className="btn btn-sm btn-outline-success" data-bs-toggle="modal" data-bs-target="#mypaymentsmodal">Show Details</button></span>
                                </div>
                            </div>
                            <div className="totalIHaveToPay">
                                <div className="innertotaltopay">
                                    <h5 className='text-center'>Total Money I have to return </h5>
                                    <h4 className='text-center'>{mydata.totalAmountToPay}</h4>
                                    <span><button className="btn btn-sm btn-outline-success" data-bs-toggle="modal" data-bs-target="#ihavetopaymodal">Show Details</button></span>
                                </div>
                            </div>
                            <div className="totalIrecieved">
                                <div className="innerdivtotalIrecieved">
                                    <h5 className='text-center'>Total Money I have Recieved from Others</h5>
                                    <h4 className='text-center'>{mydata.totalAmountRecieved}</h4>
                                    <span><button className="btn btn-sm btn-outline-success" data-bs-toggle="modal" data-bs-target="#totalmoneyipaidtooth">Show Details</button></span>
                                </div>
                            </div>
                            <div className="paidToOthers">
                                <div className="innerdivtotalpaidToOthers">
                                    <h5 className='text-center'>Total Money I have returned to Others </h5>
                                    <h4 className='text-center'>{mydata.totalAmountPaidToOthers}</h4>
                                    <span><button className="btn btn-sm btn-outline-success" data-bs-toggle="modal" data-bs-target="#totalmoneyirecieved">Show Details</button></span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            {/* modals to show details of transactions , payments */}
            {/* modal for my payments to others --->*/}
            <div className="modal fade" id="mypaymentsmodal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Total Money I have paid For others</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mainmodalbody">
                                <h4>All Payments</h4>
                                {mydata.allPaymentDetailsofPaid?.map((data) => {


                                    return <div className="card">

                                        <div className="card-body">
                                            <p>Transaction date: {moment(data.date).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                            <h5 className="card-title">Total Amount : {data.amount}</h5>
                                            <p className="card-text">Bought : {data.expensetitle}</p>
                                            <div className='m-2 d-flex'>Tagged Members : {data.users.map((user) => {
                                                if (data.returnedMoney.includes(user)) {
                                                    return <div key={user} className="greenbox mx-3">{user}</div>
                                                }
                                                else {
                                                    return <div key={user} className="redbox mx-3">{user}</div>
                                                }

                                            })}</div>
                                        </div>
                                    </div>
                                })
                                }

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                        </div>
                    </div>
                </div>
            </div>
            {/* <--- modal for the money i have to pay  */}
            <div className="modal fade" id="ihavetopaymodal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Total Money I have to return</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mainmodalbody">
                                <h4>All Payments</h4>
                                {/* table */}


                                <table className="table">
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">👉</th>
                                            <th scope="col">Expense Name</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">To</th>
                                            <th scope='col'>Pay/Paid</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            mydata.expenseDetailstopay?.map((data) => {
                                                return <tr>
                                                    <th scope="row">👉</th>
                                                    <td>{data.expenseTitle}</td>
                                                    <td>{data.amount}</td>
                                                    <td>{data.paidBy}</td>
                                                    {/* <td><button value={data}  onClick={()=>{pay_bill(data)}} className="btn btn-outline-success btn-sm">{data.paidByMe === true ? 'Paid' : 'Pay'}</button> </td> */}
                                                    <td>{data.paidByMe === false ? <button className="btn btn-outline-success btn-sm" onClick={() => { pay_bill(data) }}>Pay Now</button> : <button className="btn btn-outline-primary btn-sm" disabled>Paid</button>}</td>
                                                </tr>
                                            })
                                        }

                                    </tbody>
                                </table>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                        </div>
                    </div>
                </div>
            </div>
            {/* <--- modal for money i have to pay */}
            {/* <--- modal for money i have paid others */}
            <div className="modal fade" id="totalmoneyipaidtooth" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content ">
                        <div className="modal-header">
                            <h5 className="modal-title" id="totalmoneyipaidtooth">Total Money I have recived from Others</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mainmodalbody">
                                <h4>All Payments</h4>
                                {/* card */}
                                <table className="table">
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">👉</th>
                                            <th scope="col">Expense Name</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">recieved from</th>
                                            <th scope='col'>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>


                                        {
                                            mydata.paymentRecievedDetails?.map((data) => {
                                                return <tr>
                                                    <th scope="row">👉</th>
                                                    <td>{data.recievedFor}</td>
                                                    <td>{data.amountRecieved}</td>
                                                    <td>{data.recievedFrom}</td>
                                                    <td>{moment(data.paidDate).fromNow()} </td>
                                                </tr>
                                            })
                                        }


                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                        </div>
                    </div>
                </div>
            </div>
            {/* <--- modal for my pament to others */}

            {/* <--- modal for money i have paid others */}
            <div className="modal fade" id="totalmoneyirecieved" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="totalmoneyipaidtooth">Total Money I have recieved from Others</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mainmodalbody">
                                <h4>All Payments</h4>
                                {/* card */}
                                <table className="table">
                                    <thead className="thead-light">
                                        <tr>
                                            <th scope="col">👉</th>
                                            <th scope="col">Expense Name</th>
                                            <th scope="col">Amount</th>
                                            <th scope="col">Paid to</th>
                                            <th scope='col'>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            mydata.myPaymentsToOthers?.map((data) => {
                                                return <tr>
                                                    <th scope="row">👉</th>
                                                    <td>{data.paidFor}</td>
                                                    <td>{data.amount}</td>
                                                    <td>{data.paidTo}</td>
                                                    <td>{moment(data.date).fromNow()} </td>
                                                </tr>
                                            })
                                        }

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                        </div>
                    </div>
                </div>
            </div>
            {/* <--- modal for my pament to others */}
            <ToastContainer />
        </div>



        :<Loadingscreen/>)
}

export default Homepage