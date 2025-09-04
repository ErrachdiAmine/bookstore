import React from 'react'

function Verification() {



  return (
    <>
    <form>
        <div>
            <ul className='flex flex-col gap-5'>
                <h1 className='font-bold'>We sent you a verification code, please check your email!</h1>
                <li><input type="number" name="passphrase" id="passphrase" placeholder='received code' className='formInput'/></li>
                <li><button type='submit' className='border-transparent rounded bg-green-100 p-1.5 m-3 w-20'>Verify</button></li>
            </ul>

        </div>
    </form>
    
    
    
    
    </>
  )
}

export default Verification