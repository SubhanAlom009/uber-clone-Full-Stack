import React from 'react'
import uberLogo from '../assets/images/uber-pic.png'
import uberFrontImg from "../assets/images/uber-front-page-image.jpg"
import { Link } from 'react-router-dom';

function Start() {
  return (
    <div className='flex h-screen bg-cover bg-center bg-no-repeat flex-col justify-between' style={{backgroundImage: `url(${uberFrontImg})`}}>
        <div className='p-6'>
          <img src={uberLogo} className='w-24 ' alt="Logo" />
        </div>
        <div className='bg-[#eeeeee] pb-6 space-y-6 px-6 py-6 rounded-lg'>
          <p className='font-bold text-center text-4xl'>Get started with uber</p>
          <Link to={'/login'} className='flex bg-black text-white justify-center px-2 py-3.5 rounded-lg cursor-pointer'>
            <input type="button" value="Continue" className='font-semibold text-lg' />
          </Link>
        </div>
    </div>
  )
}

export default Start
