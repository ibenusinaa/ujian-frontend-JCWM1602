import React from 'react'
import axios from 'axios'
import Link from 'react-router-dom'
import LinkAPIProduct from '../Supports/Constants/linkAPIProduct'

export default class TransactionHistory extends React.Component{

    state = {
        dataTrans: null,
        transDetail: null,
        showModal: false
    }

    componentDidMount(){
        this.getDataTransaction()
    }

    getDataTransaction = () =>{
        let id = localStorage.getItem('id')
        if(id){
            axios.get(`http://localhost:2000/transactions?idUser=${id}`)
            .then((res)=>{
                this.setState({dataTrans: res.data})
                console.log(this.state.dataTrans)
            })
            .catch((err)=>{
                console.log(err)
            })
        }
    }

    paymentRedirect = (idTransaction) =>{
        window.location = `/checkout/${idTransaction}`
    }

    paymentCancel = (idTransaksi) => {
        let idTransaction = idTransaksi
        let idProduk
        let jumlahItem
        if(idTransaction){
            axios.patch(`http://localhost:2000/transactions/${idTransaction}`, {status: 'cancelled'})
            .then((res) => {
                console.log(res.data)
                
                res.data.detail.forEach((value) => {
                    idProduk = value.idProduct
                    jumlahItem = value.productQuantity
                    
                    axios.get(LinkAPIProduct + '/' + idProduk)
                    .then((res) => {
                        console.log(res)
                        let stockAwal = res.data.stock
                        axios.patch(LinkAPIProduct + '/' + idProduk, {stock: stockAwal + jumlahItem})
                        .then((res) => {
                            console.log(res)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                    
                  
                    this.getDataTransaction()
                    
                })


            })
            .catch((err) => {
                console.log(err)
            })
        }
    }

 
    render(){
        if(this.state.dataTrans === null){
            return(
                null
            )
        }
        return(
            <>
                <div className="container">
                    <div className = 'd-flex'>
                        <div className='bg-white mt-1 col-12 rounded'>
                            <div className='mt-2'>
                                <h3>Purchase History</h3>
                            </div>
                            <hr />
                            <div className='border border-black rounded my-3 mt-2 mb-5 col-12 bg-light'>
                                {  
                                    this.state.dataTrans.map((value, index) => {
                                        return(
                                            <div key={index} className='border border-black rounded my-3 shadow-sm bg-white'>
                                                <div className='row justify-content-between align-items-center'>
                                                    <div className='p-3 d-flex'>
                                                        <div className='ml-4 mr-2'>Belanja tanggal:</div> 
                                                        <div className='mx-2'>{value.createdAt}</div>
                                                        {
                                                            value.status === 'paid'?
                                                                <div className='mx-2 bg-success rounded text-white d-flex justify-content-center' style={{width: '60px', height: '25px'}}>Selesai</div>
                                                            :
                                                                value.status === 'unpaid'?
                                                                    <div className='d-flex justify-content-center'>
                                                                        <div className='mx-2 bg-warning rounded text-white d-flex justify-content-center' style={{width: '120px', height: '25px'}}>
                                                                            Belum dibayar
                                                                        </div>
                                                                        <div className='mx-2 border bg-info border-black rounded text-white d-flex justify-content-center clickable-element' 
                                                                            style={{width: '130px', height: '25px'}}
                                                                            onClick={() => this.paymentRedirect(value.id)}>
                                                                            Bayar Sekarang?
                                                                        </div>
                                                                        <div className='mx-2 border bg-danger border-black rounded text-white d-flex justify-content-center clickable-element' 
                                                                            style={{width: '130px', height: '25px'}}
                                                                            onClick={() => this.paymentCancel(value.id)}>
                                                                            Batalkan?
                                                                        </div>
                                                                    </div>
                                                                :
                                                                    <div className='d-flex justify-content-center'>
                                                                        <div className='mx-2 bg-danger rounded text-white d-flex justify-content-center ' style={{width: '120px', height: '25px'}}>
                                                                            Cancelled
                                                                        </div>
                                                                    </div>
                                                        }
                                        
                                                    </div>

                                                </div>
                                                {
                                            
                                                        this.state.dataTrans[index].detail.map((value, i) => {
                                                            return(
                                                                <div className= 'mt-3'>
                                                                <div className='row'>
                                                                    <div className='col-2'>
                                                                        <img src={value.productImage} style={{width: '100%', height:'100%'}} />
                                                                    </div>
                                                                    <div className='col-8'>
                                                                        <h6>{value.productBrand}</h6>
                                                                        <p className='mt-n2'>{value.productName}</p>
                                                                        <p className='mt-n1'>
                                                                            {
                                                                            
                                                                                    `Rp${value.productPrice.toLocaleString('id-ID')} x ${value.productQuantity} item`
                                                                                
                                                                            }
                                                                            
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div> 
                                                            )
                                                        })
                                                    
                                                }                                                         
                                                <hr />
                                                <div className='d-flex justify-content-end mr-3'>
                                                    <div className='mx-5'>
                                                        <p className='font-weight-bold'>Total Belanja</p>
                                                    </div>
                                                    <div>
                                                        <p>Rp{value.total.toLocaleString('id-ID')}</p>
                                                    </div>
                                                </div>
                                            </div>   
                                        )
                                    })          
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}