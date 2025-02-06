import React from "react";
import "./Navbar.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Store/authh";

const Navbar = () => {
  const { isLoggedIn  } = useAuth();
  console.log("login or not ", isLoggedIn);
   

  return (
    <>
      <header
        id="header"
        className="header d-flex align-items-center sticky-top"
      >
        <div className="container-fluid container-xl position-relative d-flex align-items-center">
          <NavLink
            to="index.html"
            className="logo d-flex align-items-center me-auto"
          >
            {/* <!-- Uncomment the line below if you also wish to use an image logo --> */}

            <h1 className="sitename">Product</h1>
          </NavLink>

          <nav id="navmenu" className="navmenu">
            <ul>
              {isLoggedIn ? (
                <>
                 <li>
                 <NavLink to="/EnquiryDashboard">EnquiryDashboard</NavLink>
               </li>
                <li>
                  <NavLink to="/logout">Logout</NavLink>
                </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/login">Login</NavLink>
                  </li>
                  <li>
                    <NavLink to="/register">Register</NavLink>
                  </li>
                </>
              )}

            
            </ul>
          </nav>

        </div>
      </header>
    </>
  );
};
export default Navbar;
