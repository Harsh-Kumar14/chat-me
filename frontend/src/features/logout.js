import React from 'react'
import api from '../../utils/axios';

async function logout() {
  try{
    const {data}=await api.get("/api/auth/logout")
    console.log(data);
  }
  catch(error){
    console.error("Logout error:", error)
  }
}

export default logout
