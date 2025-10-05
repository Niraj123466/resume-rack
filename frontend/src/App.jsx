import './index.css';  // Or your main CSS file
import PrivateRoute from "./components/PrivateRoute";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Upload from "./pages/Upload";
import Footer from "./components/Footer";
import Signup from './pages/Signup';
import Login from './pages/Login';
import Subscribe from './pages/Subscribe';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <>
        
        <Router>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/upload" element={
                            <PrivateRoute>
                                <Upload />
                            </PrivateRoute>
                        } />
                        <Route path="/subscribe" element={<Subscribe />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
        <Toaster position="top-right" reverseOrder={false} />
        </>
    );
}

export default App;
