import React from 'react'
import axios from 'axios'
import LinkAPIProduct from './../Supports/Constants/linkAPIProduct'
import LinkAPICarts from './../Supports/Constants/linkAPICarts'
import { Link } from 'react-router-dom'
import Slider from "react-slick";
import swal from 'sweetalert';
import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export default class LandingPage extends React.Component{

    state = {
        dataProduct: null,
        showModal: false,
        quantity: 1,
        idProdukModal: null,
        indexProduk: null
    }

    componentDidMount(){
        this.getDataProduct()
    }

    getDataProduct = () =>{
        axios.get(LinkAPIProduct)
        .then((res) => {
            console.log(res)
            this.setState({dataProduct: res.data})
            console.log(this.state.dataProduct)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    showDataProduct = () =>{
        if(this.state.dataProduct){
            return this.state.dataProduct.map((value, index) => { 
                return(
                    <div key={index} className='mb-5' style={{width: '30rem'}}>
                        <div className = 'card mx-3'>
                            <img className="card-img-top" src={value.img} alt="foto" style={{height:'200px'}} />
                            <div className="card-body">
                                <p className="card-text mt-n3 font-weight-bold">{value.name}</p>
                                <p className="card-text mt-n2"> Rp{value.price.toLocaleString()}</p>
                                <div className="card-text mt-n3">{value.stock} stok tersisa</div>
                                <p className="card-text mt-2" style={{lineHeight: '14px'}}> {value.description}</p>
                                <div>
                                    <input type='button' value='Add To Cart' className='btn btn-outline-dark' onClick ={() => this.sendToModal(value.id, index)}/>
                                </div>
                            </div>
                        </div>
                    </div>       
                )
            
            })
        }
    }

    sendToModal = (value, index) =>{

        let idUser =localStorage.getItem('id')

        if(idUser){
            this.setState({idProdukModal: index})
            this.setState({indexProduk: value})
            // window.location = '/'
            this.setState({showModal: true})
        }else{
            swal("Halo kamu belum login", "Login dulu yuk", "warning");
        }


    }

    sendToBag = () => {
        console.log(this.state.quantity)
        
        let idProduct = this.state.indexProduk
        let idUser = localStorage.getItem('id')


        
        let dataToSend ={
            idProduct: idProduct,
            idUser: idUser,
            quantity: this.state.quantity
        }
        console.log(dataToSend)

        if(idUser){
            axios.get(LinkAPICarts + '?idProduct=' + idProduct)
            .then((res) => {

                if(res.data.length === 0){
                    axios.post(LinkAPICarts, dataToSend)
                    .then((res) => {
                        swal("Penambahan item berhasil!", "klik icon cart untuk melihat!", "success");
                        setTimeout(function(){window.location = '/'}, 3000);
                        // axios.get(LinkAPIProduct + '/' + idProduct)
                        // .then((res) => {
                        //     let stokAwal = res.data.stock
                        //     axios.patch(LinkAPIProduct + '/' + idProduct, {stock: stokAwal - this.state.quantity})
                        //     .then((res) => {


                        //     })
                        //     .catch((err) => {
                        //         console.log(err)
                        //     })
                        // })
                        // .catch((err) => {
                        //     console.log(err)
                        // })

                    })
                    .catch((err) => {
                        console.log(err)
                    })
                }else{
                    let quantity = this.state.quantity
                    let idProductonCarts = res.data[0].id
                    let quantityProductonCarts = res.data[0].quantity
                    axios.patch(LinkAPICarts + '/' + idProductonCarts, {quantity: quantityProductonCarts + quantity})
                    .then((res) => {
                        console.log(res)
                        swal("Penambahan item berhasil!", "klik icon cart untuk melihat!", "success");
                        setTimeout(function(){window.location = '/'}, 3000);
                        // axios.get(LinkAPIProduct + '/' + idProduct)
                        // .then((res) => {
                        //     let stokAwal = res.data.stock
                        //     axios.patch(LinkAPIProduct + '/' + idProduct, {stock: stokAwal - this.state.quantity})
                        //     .then((res) => {

    
                        //     })
                        //     .catch((err) => {
                        //         console.log(err)
                        //     })
                        // })
                        // .catch((err) => {
                        //     console.log(err)
                        // })
                        
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                }
            })
            .catch((err) => {
                console.log(err)
            })
        }else{
            
        }
   
    }
    render(){

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 4
          };

        return(
            <>
                <div className="bg-success">
                    <div className="container">
                        <div className="d-flex">
                            <div className='my-5 col-12'>
                                <Slider {...settings}>
                                    {
                                        this.state.dataProduct?

                                            this.showDataProduct()
                                        :
                                            null
                                    }
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
                                    {/* MODAL QUANTITY */}
                <Modal toggle={() => this.setState({showModal: false, quantity: 1})} isOpen={this.state.showModal}>
                    <ModalHeader className='d-flex justify-content-center'>Quanitity</ModalHeader>
                        <ModalBody>
                            {   
                                this.state.idProdukModal === null?
                                    'BINGUNG DIAPAIN SET STATENYA GA JALAN DI AWAL'
                                    
                                :
                                <>
                                <div>
                                    <h6>Jumlah item</h6>
                                    <div className='ml-3 d-flex align-items-center'>
                                        Jumlah item: 
                                        
                                        <button disabled={this.state.quantity === 1? true : false} className='btn btn-warning ml-2 d-flex align-items-center' style={{height: '25px'}} onClick={() => this.setState({quantity: this.state.quantity - 1})}>
                                            -
                                        </button> 
                                        
                                        <span className='mx-3'>
                                            {this.state.quantity}
                                        </span>
                                        <button disabled={this.state.quantity === this.state.dataProduct[this.state.idProdukModal].stock}className='btn btn-warning d-flex align-items-center' style={{height: '25px'}} 
                                                onClick={() => this.setState({quantity: this.state.quantity + 1})}>
                                                +
                                        </button>
                                        {
                                            this.state.quantity === this.state.dataProduct[this.state.idProdukModal].stock?
                                                alert('quantity sudah menyamai stok yang tersedia, kamu tidak bisa menambah item ini lagi')
                                            :
                                                null
                                        }
                                    </div>
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <input type='button' value='Add To Cart' className='btn btn-success mt-3' onClick={() => this.sendToBag()}/>
                                </div>
                            </>
                            }

                        </ModalBody>
                    <ModalFooter>
                            ujian frontend jcwm 1602
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}