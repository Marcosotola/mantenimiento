import React from 'react'

const Preventivos = () => {
  return (
    <>
      <h1 className='text-center m-5 text-primary'>PREVENTIVOS</h1>
      <div className="container d-flex justify-content-around text-light mt-5">
        <a href="/Renault">
          <button type="button" class="btn btn-secondary btn-lg ">RENAULT</button>
        </a>
        <a href="/Holcim">
          <button type="button" class="btn btn-secondary btn-lg ">HOLCIM</button>
        </a>
      </div>
      <div className='mt-5'>
        <hr />
      </div>
    </>
  )
}

export default Preventivos
