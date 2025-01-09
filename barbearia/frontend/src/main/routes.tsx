

"use client"

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Main from '../components/Main'
import Login from '@/pages/Login'
import Services from '@/pages/Services'
import Register from '@/pages/Register'


export default function AppRoutes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={ <Main />}/>
                <Route path="/services" element={ <Services /> }/>
                <Route path="/login" element={ <Login /> } />
                <Route path="/register" element={ <Register /> }  />
                {/* <Route /> */}
            </Routes>
        </Router>
    )
}