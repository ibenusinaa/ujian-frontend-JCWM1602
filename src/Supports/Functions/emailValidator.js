function EmailValidator(inputEmail){
    // Email dipisah berdasarkan @
    let emailSplit = inputEmail.split('@')

    // Kalo emailSplit > 2 element -> false
    if(emailSplit.length !== 2) return false
    let emailName = emailSplit[0]
    let hostingEmail = emailSplit[1]

    // Kalo diawali dengan angka -> false
    if(emailName[0] >= 0) return false

    // Hosting dipisah berdasarkan .
    let hostingEmailSplit = hostingEmail.split('.')
    console.log(hostingEmailSplit)

    if(hostingEmailSplit.length <= 1) return false
    for(let i = 0; i < hostingEmailSplit.length; i++){
        if(hostingEmailSplit[i] === '' || hostingEmailSplit[i] === ' '){
            return false
        }
    }

    return true
}

export default EmailValidator