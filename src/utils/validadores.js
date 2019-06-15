export const validarEmail = (email) => {   
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
    if(reg.test(email) === false)
    {    
        return false;
    }
    else {
        return true;
    }
}