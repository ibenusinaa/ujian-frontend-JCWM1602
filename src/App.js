
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './Components/Navbar'
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import LandingPage from './Pages/LandingPage';
import Login from './Pages/Login';
import TransactionHistory from './Pages/transactionhistory';

// css
import './Supports/Stylesheets/anything.css'

export default class App extends React.Component{
  render(){
    return(
      <>
        <BrowserRouter>
        <Navbar />
          <Switch>
            <Route exact path ='/' component= {LandingPage} />
            <Route path ='/login' component={Login} />
            <Route path ='/cart' component={Cart} />
            <Route path ='/checkout' component={Checkout} />
            <Route path ='/transactionhistory' component={TransactionHistory} />
          </Switch>
        </BrowserRouter>
      </>
    )
  }
}
