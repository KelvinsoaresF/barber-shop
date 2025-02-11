

"use client"

import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'
import Main from '../components/Main'
import Login from '@/pages/Login'
import Services from '@/pages/Services'
import Register from '@/pages/Register'


export default function AppRoutes() {
    return (
            <Routes>
                <Route path="/" element={ <Main />}/>
                <Route path="/Services" element={ <Services /> }/>
                <Route path="/Login" element={ <Login /> } />
                <Route path="/Register" element={ <Register /> }  />
                {/* <Route /> */}
            </Routes>
         
    )
}