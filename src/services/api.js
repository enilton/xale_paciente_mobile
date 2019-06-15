
import axios from 'axios'; 

const api = axios.create({    
    //verificar situacao desse host
    //baseURL: 'https://xale-service-desenvolvimento.herokuapp.com/api'

    baseURL: 'http://192.168.1.3:3000/api/'
}); 

export default api;