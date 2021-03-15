import React from 'react'
import axios from 'axios'
import swal from 'sweetalert';

import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import LinkAPIProduct from '../Supports/Constants/linkAPIProduct';

export default class Cart extends React.Component{

    state = {
        dataProducts: null,
        dataCarts: null,
        totalItem: 0,
        totalPrice: 0,
        showModal: false
    }

    componentDidMount(){
        this.getDataFromCarts()
    }

    getDataFromCarts = () => {
        let id = localStorage.getItem('id')

        if(id){
            axios.get(`http://localhost:2000/carts?idUser=${id}`)
            .then((res) => {
                console.log(res.data)
                let LinkProduct = ''
                res.data.forEach((value, index) => {
                    LinkProduct += `id=${value.idProduct}&`
                    console.log(LinkProduct)
                })

                res.data.sort((a,b) => {
                    return a.idProduct - b.idProduct
                })
                this.setState({dataCarts: res.data})
                console.log(this.state.dataCarts)
                
                axios.get(`http://localhost:2000/products?${LinkProduct}`)
                .then((res) => {
                    this.setState({dataProducts: res.data})
                    console.log(this.state.dataProducts)
                    this.getOrderSummary()
                })
                .catch((err) => {
                    console.log(err)
                })
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

    getOrderSummary = () => {
        let totalItem = 0
        let totalPrice = 0

        this.state.dataCarts.forEach((value, index) => {
            totalItem += value.quantity
            totalPrice += (this.state.dataProducts[index].price * value.quantity)

        })
        this.setState({totalItem: totalItem, totalPrice: totalPrice})
        console.log(this.state.totalItem)
        console.log(this.state.totalPrice)
    }

    updateQuantityProduct = (button, idProdCart, quantity, idProdDB, stokProdDB) => {
        let quantitySebelumnya = quantity
        let quantityBaru
        if(button === 'Plus'){
            quantityBaru = quantitySebelumnya + 1
        }else{
            quantityBaru = quantitySebelumnya - 1
        }

        axios.patch('http://localhost:2000/carts/' + idProdCart, {quantity: quantityBaru})
        .then((res) => {
            console.log(res)
            // axios.patch('http://localhost:2000/products/' + idProdDB, {stock : })
            this.getDataFromCarts()
        })
        .catch((err) => {
            console.log(err)
        })
    }

    deleteProduct = (idProdCart, qtyProd, stockProd, idProdDB) => {

        console.log(idProdCart, qtyProd, stockProd)
        swal({
            title: "Are you sure want to delete this product?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if(willDelete){
                axios.delete(`http://localhost:2000/carts/${idProdCart}`)
                .then((res) => {
                    // axios.patch(LinkAPIProduct + '/' + idProdDB, {stock: stockProd + qtyProd})
                    // .then((res) => {
                    //     console.log(res)
                    // })
                    // .catch((err) => {
                    //     console.log(err)
                    // })
                    // swal({
                    //     title: "Product delete succesfull!",
                    //     icon: "success",
                    //     button: "Ok",
                    // });

                    this.getDataFromCarts()
                    window.location='http://localhost:3000/cart'
                    
                })
                .catch((err) => {
                    swal({
                        title: {err},
                        icon: "cancel",
                        button: "Ok",
                    });
                })
            } else {
              
            }
          });
    }

    createTransaction = () => {
        let id = localStorage.getItem('id')
        let date = new Date()
        console.log(date)
        date = date.toString()

        let newDate = date.split(' ')[2] + '-' + date.split(' ')[1] + '-'  + date.split(' ')[3] + '-' + date.split(' ')[4]

        let totalPrice = this.state.totalPrice

        let detailItems = this.state.dataCarts.map((value, index) => {
            return{
                productName: this.state.dataProducts[index].name,
                productPrice: this.state.dataProducts[index].price,
                productQuantity: value.quantity,
                productImage: this.state.dataProducts[index].img,
                idProduct : value.idProduct

            }
        })

        const dataToSend = {
            idUser : id,
            status : 'unpaid',
            createdAt: newDate,
            total: totalPrice,
            detail: detailItems
        }
        swal({
            title: "Yakin ingin melakukan Checkout?",
            text: "Ketika kamu klik Yes, segera lakukan pembayaran maksimal hari ini",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                axios.post('http://localhost:2000/transactions', dataToSend)
                .then((res) => {
                    console.log(res)
                    let idTransaction = res.data.id
                    //buat redirect aja
        
                    this.state.dataCarts.forEach((value, index) => {
                        let stokSebelumnya = this.state.dataProducts[index].stock
                        let stokSekarang = stokSebelumnya - value.quantity
        
                        axios.patch(`http://localhost:2000/products/${value.idProduct}`, {stock: stokSekarang})
                        .then((res) => {
                            axios.delete(`http://localhost:2000/carts/${value.id}`)
                            .then((res) =>{
                                window.location = '/checkout/' + idTransaction
                            })
                            .catch((err) =>{
                                console.log(err)
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    })
        
                })
                .catch((err) => {
                    console.log(err)
                })
            } else {
              swal("gajadi checkout");
            }
          });
       
    }


    showCart = () => {
        if(this.state.dataCarts && this.state.dataProducts){
          return this.state.dataCarts.map((value, index) =>{
                return(
                    <div key={index} className='row p-2'>
                        <div className ='col-4 '>
                            <img src={this.state.dataProducts[index].img} className='ml-3' style={{height:'100%', width:'100%'}} />
                        </div>
                        <div className ='col-8'>
                            <div className='ml-3'>
                                <h4>{this.state.dataProducts[index].name}</h4>
                                <h5>{
            
                                        `Rp${this.state.dataProducts[index].price.toLocaleString()}`
                                        
                                    }
                                </h5>
                            </div>
                            <div className='ml-3 d-flex align-items-center'>
                            Jumlah item: 
                            
                            <button disabled={value.quantity === 1? true : false} className='btn btn-warning ml-2 d-flex align-items-center' style={{height: '25px'}} onClick={() => this.updateQuantityProduct('Minus', value.id, value.quantity, this.state.dataProducts[index].id, this.state.dataProducts[index].stock)}>
                                -
                            </button> 
                            
                            <span className='mx-3'>
                                    {value.quantity}
                            </span>
                            <button disabled={value.quantity === this.state.dataProducts[index].stock? true : false} className='btn btn-warning d-flex align-items-center' style={{height: '25px'}} onClick={() => this.updateQuantityProduct('Plus', value.id, value.quantity, this.state.dataProducts[index].id, this.state.dataProducts[index].stock)}>
                                    +
                            </button>
                            </div>
                            <div className='mt-3 ml-3'>
                                <button className='btn btn-danger' onClick={() => this.deleteProduct(value.id, value.quantity, this.state.dataProducts[index].stock, value.idProduct)}>
                                    Delete
                                </button>
                            </div>
    
                        </div>
                        
                    </div>
                
                ) 
            })
        }
    }

    render(){
        return(
            <>
                <div className="bg-success">
                    <div className="container">
                        <div className="d-flex">
                            {/* row kiri */}
                            <div className="col-8">
                                <div className="bg-white my-5 col-12">
                                    <h3>
                                        Shopping Cart
                                    </h3>
                                    <hr />
                                    {   
                                        this.showCart()
                                    }
                                </div>
                            </div>
                            {/* row kanan */}
                            <div className="col-4">
                                <div className="bg-white my-5 col-12">
                                    <div className='col-12'>
                                        <h3>
                                            Order Summary
                                        </h3>
                                        <hr />
                                    </div>
                                    <div className='d-flex justify-content-between col-12'>
                                        <div>
                                            Item Total
                                        </div>
                                        <div>
                                            {this.state.totalItem}
                                        </div>
                                    </div>
                                    <div className='d-flex justify-content-between col-12 mt-2'>
                                        <div>
                                            <h6>
                                                Order Total
                                            </h6>
                                        </div>
                                        <div>
                                            Rp{this.state.totalPrice.toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 d-flex justify-content-center'>
                                    <input type='button' value='Checkout' className='btn btn-light w-50' onClick ={this.createTransaction}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}