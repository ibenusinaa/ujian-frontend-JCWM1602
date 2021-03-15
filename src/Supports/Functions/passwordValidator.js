function PasswordValidator(inputPassword){
    let angka = '1234567890'

    if(inputPassword.length >= 6){
        for(let i =0; i<inputPassword.length; i++){
            if(inputPassword.includes(angka[i]) === true)
                return true
                
            else{
                return false
            }
        }     
    }else{
        return false
    }

}
