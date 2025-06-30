
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Start from "./pages/Start";
import Home from "./pages/home";
import Admin from "./pages/Admin";
import ServiceProviderProfile from "./pages/ServiceProviderProfile";
import CommunityPage from "./pages/CommunityPage";
import UserContextProvider from "./context/UserContextProvider";
import  GetContect  from "./pages/GetContect";
import User from "./pages/User";
import BookingPage from "./pages/Booking";
import HomeSevice from "./pages/homeSevice";
import { ToastContainer } from "react-toastify";
import ServiceDetails from "./pages/ServiceDetails";
import "react-toastify/dist/ReactToastify.css";
//for protecting routes
import UserProtector from "./Protector/User.Protector";
import ServiceProviderProtector from "./Protector/ServiceProvider.Protector";
import AdminProtector from "./Protector/Admin.Protector"
import UserOrSp from "./Protector/UserOrSp.Protector";
import React from 'react'
import ErrorPage from "./pages/ErrorPage";

function App() {
 
  return (
    <UserContextProvider>
      <ToastContainer />
      <Routes>
        <Route
          path="/Home"
          element={
               <Home />
          }
        />
        <Route 
          path="/login" 
          element={
              <Login />
          } 
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Start/>} />
        <Route 
          path="/admin" 
          element={
              <AdminProtector>
                <Admin/>
              </AdminProtector>
            }
          />
        <Route
          path="/services"
          element={
            <UserProtector>
               <CommunityPage />
            </UserProtector>   
          }
        />
        <Route path="/GetContect"  element={<GetContect/>}/>
        <Route
          path="/booking/:uid/:sid"
          element={
            <UserProtector>
               <BookingPage />
            </UserProtector>   
          }
        />
        <Route
          path="/homeSevice/:id"
          element={
            <UserProtector>
               <HomeSevice />
            </UserProtector>   
          }
        />
        <Route
          path="/user/:id"
          element={
            <UserProtector>
               <User />
            </UserProtector>   
          }
        />
        <Route
          path="/Service-provider-Profile/:id"
          element={
            <ServiceProviderProtector>
               <ServiceProviderProfile />
            </ServiceProviderProtector>   
          }
        />
        <Route
          path="/Service-provider-Profile-Details/:id"
          element={
            <UserOrSp>
               <ServiceDetails />
            </UserOrSp>   
          }
        />
        <Route 
          path="/error" 
          element={<ErrorPage />} 
        />
      </Routes>
    </UserContextProvider>
  );
}

export default App;