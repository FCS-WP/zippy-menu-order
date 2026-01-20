import React from 'react'

const Loader = ({ loading }) => {

  return (
    <div className={`fixed bg-[#ffffffd6] flex items-center justify-center top-0 left-0 w-[100dvw] h-[100dvh] z-10 ${loading ? '' : 'hidden'}`}>
        <div className="loader-wrapper">
            <p id="loader-text">Loading....<span id="lol" /></p>
        </div>
    </div>
  )
}

export default Loader