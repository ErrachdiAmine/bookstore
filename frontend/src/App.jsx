import { useState } from 'react'
import './App.css'
import { Outlet, NavLink } from 'react-router-dom'

function App() {


  return (
    <>
    <main>
      <Outlet />
    </main>
    </>
    
  )
}

export default App
