import React from 'react'
import './navbar.css'
const NavBar = () => {
  return (
    <div className='navbar__container'>
      <p>THG</p>
      <button 
      className='navbar__container-btn'
      onClick={()=> {window.open("https://github.com/endr1thashani/THG")}}
      >
        GitHub
      </button>
    </div>
  )
}

export default NavBar
