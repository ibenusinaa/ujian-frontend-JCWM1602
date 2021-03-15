import axios from 'axios'
import React from 'react'
import LinkAPIUser from '../Supports/Constants/linkAPIUser'
import EmailValidator from './../Supports/Functions/emailValidator'
import PasswordValidator from './../Supports/Functions/passwordValidator'
export default class Login extends React.Component{

    state = {
        error: null
    }

    componentDidMount(){
        let id = localStorage.getItem('id')

        if(id){
            window.location = '/'
        }
    }

    validasiEmail = () => {
        let inputEmail = this.refs.email.value
        if(inputEmail[0] > 0 || inputEmail[0] <= 0){
            this.setState({error: 'Masukkan format email yang sesuai'})
        }else{
            let hasilValidasiEmail = EmailValidator(inputEmail)
            if(hasilValidasiEmail === true){
                this.setState({email: inputEmail, error: null})
            }else{
                this.setState({error: 'Email tidak sesuai'})
            }
        }

    }

    validasiPassword = () => {
        let inputPassword = this.refs.password.value


        if(inputPassword.length >= 6){
            if(inputPassword.includes('1') === true || inputPassword.includes('2') === true || 
            inputPassword.includes('3') === true || inputPassword.includes('4') === true || inputPassword.includes('5') === true || 
            inputPassword.includes('6') === true || inputPassword.includes('7') === true || inputPassword.includes('8') === true || 
            inputPassword.includes('9') === true || inputPassword.includes('10') === true){
                this.setState({error: null})

            }else{
                this.setState({error: 'password minimal 6 karakter dan harus mengandung angka'})
            }
               
        }else{
            this.setState({error: 'password minimal 6 karakter dan harus mengandung angka'})
        }
    
    }


    loginCheck = () =>{
        console.log('masuk')
        let email = this.refs.email.value
        let password = this.refs.password.value
        
        axios.get(LinkAPIUser + '?email=' + email + '&password=' + password)
        .then((res) => {
            console.log(res)
            if(res.data.length === 1){
                localStorage.setItem('id', res.data[0].id)
                window.location = '/'
            }else{
                axios.post(LinkAPIUser, {email: email, password: password, role: 'user'})
                .then((res) => {
                    console.log(res)
                    localStorage.setItem('id', res.data.id)
                    window.location = '/'
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })
        
    }

    render(){
        return(
            <>
                <div className="bg-info">
                    <div className="container">
                        <div className='d-flex justify-content-center'>
                            <div className="card my-5 w-50">
                                <h5 className="card-header">Login</h5>
                                <div className="card-body">
                                    <h6>Insert your email address</h6>
                                    <input type='text' ref='email' placeholder='your email address' className='form form-control' onChange = {this.validasiEmail}/>
                                    <h6 className='my-2'>Insert your password</h6>
                                    <input type='text' ref='password' placeholder='your password' className='form form-control' onChange = {this.validasiPassword}/>
                                    <p className ='text-danger ml-2'>
                                        {
                                            this.state.error?
                                                this.state.error
                                            :
                                                null
                                        }
                                    </p>
                                    <button disabled={this.state.error !== null} className='btn btn-success' onClick={this.loginCheck}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}