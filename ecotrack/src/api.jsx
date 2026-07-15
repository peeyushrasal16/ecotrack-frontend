import axios from 'axios'

export const api=axios.create({ //return object of axios and it has base url
    baseURL:'http://localhost:8080'
});

api.interceptors.request.use((config)=>{
   let token= localStorage.getItem("token")
   if(token)
    configs.headers.Authorization=`Bearer ${token}` 
    return config
},(error)=>Promise.reject(error),

)