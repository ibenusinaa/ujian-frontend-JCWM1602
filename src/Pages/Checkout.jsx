import React from 'react'
import axios from 'axios'
import swal from 'sweetalert'
export default class Checkout extends React.Component{

    state = {
        dataTransaction: null,
    }
    
    componentDidMount(){
        this.getDataTransaction()
    }
    
    getDataTransaction = () =>{

        let id = localStorage.getItem('id')
        let idTransaction = this.props.location.pathname.split('/')[2]
    
        axios.get(`http://localhost:2000/transactions/${idTransaction}`)
        .then((res)=>{
            console.log(res)
            if(id === res.data.idUser){
                this.setState({dataTransaction: res.data})
    
            }else{
                window.history.back()
            }
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    payment = () => {

        
        // get id
        let idTransaction = this.props.location.pathname.split('/')[2]

        // getDate buat createAt dia bayar di jam berapa
        let date = new Date()
        date = date.toString()

        let newDate = date.split(' ')[2] + '-' + date.split(' ')[1] + '-'  + date.split(' ')[3] + '-' + date.split(' ')[4]

        swal({
            title: "Yakin ingin melakukan Pembayaran?",
            text: "Ketika kamu klik Yes, segera lakukan pembayaran maksimal hari ini",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                axios.patch(`http://localhost:2000/transactions/${idTransaction}`, {status: 'paid', createdAt: newDate})
                .then((res)=>{
                    console.log(res)
                    swal({
                        title: "Payment Success!",
                        icon: "success",
                        button: "Yes",
                    });
                    
                    setTimeout(function(){window.location = '/userprofile/transactionhistory'}, 3000);
        
                })
                .catch((err)=>{
                    console.log(err)
                })
            } else {
              swal("Your imaginary file is safe!");
            }
          });

        // diupdate ke transactionnya

    }

    render(){
        if(this.state.dataTransaction === null){
            return(
                null
            )
        }
        return(
            <>
                <div className = 'bg-light'>
                    <div className ='container'>
                        <div className = 'row d-flex'>

                            {/* row kiri */}
                            <div className='col-12 col-sm-12 col-md-12 col-lg-7 col-xl-7'>
                                <div className='p-2 bg-white my-5'>
                                    <div className='col-12 mt-3'>
                                        <h3>
                                            Order Details
                                        </h3>
                                        <hr />
                                    </div>
                                    <div className = 'col-12'>
                                        <h6>Address</h6>
                                        <div>
                                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quasi dicta sed accusamus reprehenderit distinctio, 
                                            tenetur hic inventore consequuntur dignissimos magni voluptatum illum sint minima culpa tempore ea ducimus enim.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* ROW KANAN */}
                            <div className='col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5 mb-3'>
                                <div className='p-2 bg-white mt-5'>
                                    <div className='col-12 mt-3'>
                                            <h3>
                                                Items Summary
                                            </h3>
                                            <hr/>
                                    </div>
                                    {       
                                            this.state.dataTransaction.detail.map((value, index) => {
                                                return(
                                                    <div key={index} className='row col-12' >
                                                        <div className='col-4'>
                                                            <img src={value.productImage} style={{width:'100%'}} />
                                                        </div>
                                                        <div className='col-8'>
                                                            <p className='font-weight-bold'>{value.productBrand}</p>
                                                            <p className='mt-n3'>{value.productName}</p>
                                                            <p className='mt-n3'>jumlah item: {value.productQuantity}</p>
                                                            <p className='mt-n3'>
                                                                {
                                                                    value.productDiscount > 0?
                                                                        `Rp${(value.productPrice - ((value.productPrice * value.productDiscount)/100)).toLocaleString()}`
                                                                    :
                                                                        `Rp${value.productPrice.toLocaleString()}`
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                )
                                            })
                                        
                                    }
                                    <hr />
                                    <div className='col-12 d-flex justify-content-between'>
                                        <h5>Order Total</h5>
                                        <p>Rp{this.state.dataTransaction.total.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className='p-2 bg-white mt-1'>
                                    <div className='col-12 mt-3'>
                                            <h3>
                                                Payment Method
                                            </h3>
                                            <hr/>
                                    </div>
                                    <div className='d-flex justify-content-between'>
                                        <div className='mx-2'>
                                            <button className='btn'>
                                                <img src='https://cdn3.xsolla.com/paymentoptions/paystation/theme_33/60x44/3590.1592809756.png' alt='' />
                                            </button>
                                        </div>
                                        <div className='mx-2'>
                                            <button className='btn'>
                                            <img src='https://cdn3.xsolla.com/paymentoptions/paystation/theme_33/60x44/3547.1589911095.png' alt=''  />
                                            </button>
                                        </div>
                                        <div className='mx-2'>
                                            <button className='btn'>
                                            <img src='https://cdn3.xsolla.com/paymentoptions/paystation/theme_33/60x44/3584.1589347357.png' alt=''  />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <div className='mt-2 col-12'>
                                        <input type='button' value='Bayar' className ='btn btn-outline-dark w-100' onClick={this.payment} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

