// Lib Imports
import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Helpers
import ScrollToTop from 'helpers/react-router/ScrollToTop';

// Components
import { Navbar, Header, SubHeader, Footer, Content } from './components/index.js';
import { SignIn, SignUp, SignOut, UserProfile } from 'pages/index.js';

import { ListSidebar } from 'layout';
import { ProblemList, ProblemDetails } from 'pages/problem'
import { Submit } from 'pages/submit';
import { SubmissionList, SubmissionDetails } from 'pages/submission'
import PDFViewer from 'components/PDFViewer/PDFViewer';

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
          {/* <ScrollToTop /> */}
          <Container className="content">
            <Routes>
              <Route path="/" element={<Content />} />
              <Route path="/sign-in" element={<SignIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/sign-out" element={<SignOut />} />
              <Route path="/profile" element={<UserProfile />} />

              <Route path="/test/pdf" element={ <PDFViewer /> } />

              <Route path="/problem" element={
                <ListSidebar mainContent={<ProblemList />}/>
              } />
              <Route path="/problem/:shortname" 
                element={<ListSidebar mainContent={<ProblemDetails />} />}
              />
              <Route path="/problem/:shortname/submit" 
                element={<ListSidebar mainContent={<Submit />} />}
              />

              <Route path="/submission" element={
                <ListSidebar mainContent={<SubmissionList />}/>
              } />
              <Route path="/submission/:id" element={
                <ListSidebar mainContent={<SubmissionDetails />}/>
              } />

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