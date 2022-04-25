// Lib Imports
import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Helpers
import ScrollToTop from 'helpers/ReactRouter/ScrollToTop';

// Components
import { Navbar, Header, SubHeader, Footer, Content } from './components/index.js';
import { SignIn, SignUp, SignOut, UserProfile } from 'pages/index.js';

// Styles
import 'App.scss';

export default class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Header />
                <Navbar />
                <SubHeader />

                <div className="content-wrapper">
                    <ScrollToTop />
                    <Container className="content">
                        <Routes>
                            <Route path="/" element={<Content />} />
                            <Route path="/sign-in" element={<SignIn />} />
                            <Route path="/sign-up" element={<SignUp />} />
                            <Route path="/sign-out" element={<SignOut />} />
                            <Route path="/profile" element={<UserProfile />} />
                        </Routes>
                    </Container>
                </div>

                <div className='footer-wrapper'>
                    <Footer />
                </div>
            </BrowserRouter>
        )
    }
}