import React, { useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router'

function Verification() {

  
  
  
  const [UrlToken, SetUrlToken] = useState(null)
  const [token, SetToken] = useState(null)
  const [ searchParams ] = useSearchParams()


  SetUrlToken(searchParams.get('token'))

  

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