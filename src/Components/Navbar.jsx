
import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import LinkAPIUser from './../Supports/Constants/linkAPIUser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';

export default class Navbar extends React.Component{

    state = {
        email: null,
        bag : null
    }

    componentDidMount(){
        this.getEmail()
        this.getBag()
    }

    getEmail = () => {
        let id= localStorage.getItem('id')
        let email
        if(id){
            axios.get(LinkAPIUser + '/' + id)
            .then((res) => {
                email = res.data.email
                this.setState({email: email})
                
                
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    getBag = () => {
        let id = localStorage.getItem('id')

        
        if(id){
            axios.get(`http://localhost:2000/carts/?idUser=${id}`)
            .then((res) => {
                console.log(res)
                this.setState({bag: res.data.length})
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    onLogout = () =>{
        let confirm = window.confirm('Anda Yakin Mau Logout?')

        if(confirm){
            localStorage.removeItem('id')
            window.location = '/'
        }
    } 
    render(){
        return(
            <>
                <div className="bg-light">
                    <div className="container">
                        <div className="d-flex justify-content-between">
                            <div className='my-2'>
                                <Link to = '/'>UJIAN FRONT END JCWM 1602 IBNU SINA</Link>
                            </div>
                            <div className='row'>
                                {
                                    this.state.email?
                                        <>
                                            <div className='my-2'>
                                               <Link to = '/transactionhistory'>
                                                {this.state.email}/
                                                </Link> 
                                            </div>
                                            <div className='my-2 mx-2 clickable-element' onClick ={this.onLogout}>
                                                Logout
                                            </div>
                                            <div className ='my-2 ml-3'>
                                                <Link to = '/cart' >
                                                    <FontAwesomeIcon icon={faShoppingBag} />
                                                </Link>
                                            </div>
                                            <div>
                                                {this.state.bag}
                                            </div>
                                        </>
                                    :
                                        <>
                                            <div className='m-2'>
                                               <Link to ='/login'> login </Link>
                                            </div>
                                        </>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}