import React from 'react'
import Header from './_components/Header'
import { SplashCursor } from '../../components/ui/splash-cursor'

function Dashboardlayout({children}) {
  return (
    <div>
      <SplashCursor/>
      <Header/>
      <div className ='mx-5 md:mx-20 lg:mx-36'>

      {children}
      </div>
    </div>
  )
}

export default Dashboardlayout