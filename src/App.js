import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './homecomponents/HomePage'; // Keep this import
import Login from './logincomponents/Login';
import Signup from './signupcomponents/SignUp';
import About from './aboutcomponents/About';
import Upload from './uploadcomponents/Upload';
import UserInfo from './userinfocomponents/UserInfo';
import ForgotPassword from './forgotpasswordcomponents/ForgotPassword';
import ResetPassword from './resetpasswordcomponents/ResetPassword';
import { UserProvider } from './UserContext'; // Import the UserProvider
import Misp from './misp/Misp';
import AlienVault from './alien/Alien';
import Feedly from './feedly/Feedly';


function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<HomePage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/about' element={<About />} />
          <Route path='/upload' element={<Upload />} />
          <Route path='/userinfo' element={<UserInfo />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
          <Route path="/nist" element={<Misp />} />
          <Route path="/alienvault" element={<AlienVault />} />
          <Route path="/feedly" element={<Feedly />} />
         

        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
