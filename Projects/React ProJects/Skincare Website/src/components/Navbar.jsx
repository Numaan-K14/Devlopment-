import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-left">
        <img src="/images/logo.webp" alt="logo" className="logo" />
      </div>

      <ul className="nav-links">
        <li>Home</li>
        <li>Products</li>
        <li>Contact</li>
      </ul>

      <div className="nav-right">
        <button className="btn btn-outline">Login</button>
        <button className="btn btn-filled">Sign Up</button>
      </div>
    </div>
  )
}

export default Navbar
