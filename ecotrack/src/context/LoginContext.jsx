import { Children, createContext, useEffect, useState } from "react";

export const loginContext=createContext(null)

export const LoginProvider=({children})=>{
const [user,setUser]=useState(null);
const [token,setToken]=useState(null);
const [isAuthenticated,setAuthenticated]=useState(false);

useEffect(()=>{
  const storedToken=  localStorage.getItem("token");
  const stordUser=localStorage.getItem("user");

  if(storedToken && stordUser)
  {
    setToken(storedToken)
    setUser(JSON.parse(stordUser))
    setAuthenticated(true)
  }
},[])

const login=(userData,jwtToken)=>{
    localStorage.setItem("token",jwtToken)
    localStorage.setItem("user",JSON.stringify(userData));
    setUser(userData);
setToken(jwtToken);
setAuthenticated(true);
}



const logout=()=>{
    localStorage.clear()
    setUser(null)
    setToken(null)
    setAuthenticated(false)
}

return (<loginContext.Provider 
value={{user,token,isAuthenticated,login,logout}}>
    {children}
</loginContext.Provider>)

}