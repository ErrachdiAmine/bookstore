import React, { useState } from 'react'
import axios from 'axios'

function Verification() {

  
  
  
  const [UrlToken, SetUrlToken] = useState(null)
  const [token, SetToken] = useState(null)

  
  

  return (
    <>
    <form>
        <div className='font-bold text-4xl center-form'>
            Please wait while we verify your email...
        </div>
    </form>
    
    
    
    
    </>
  )
}

export default Verification