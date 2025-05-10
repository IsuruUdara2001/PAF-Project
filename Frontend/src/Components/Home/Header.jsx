import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../Modals/AuthModal";

const Header = () => {
  const navigate = useNavigate();
  const [isAuthModalOpened, setIsAuthModalOpened] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null); // To track the hovered link

  // Inline styles for links
  const linkStyle = {
    color: "black", // Default color
    transition: "color 0.3s ease", // Smooth transition
  };

  const hoverStyle = {
    color: "white", // Hover color
  };

  return (
    <header
      style={{
        backgroundColor: "#d7e3fc", // Light blue background using inline CSS
      }}
    >
      <nav>
        <div className="nav__header">
          <div className="nav__logo">
            <Link to="#">
              <img src="assets/logo.png" alt="logo" />
              
            </Link>
          </div>
          <div className="nav__menu__btn" id="menu-btn">
            <span>
              <i className="ri-menu-line"></i>
            </span>
          </div>
        </div>
        <ul className="nav__links" id="nav-links">
          <li
            className="link"
            onMouseEnter={() => setHoveredLink("contact")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <Link
              to="/"
              style={hoveredLink === "contact" ? hoverStyle : linkStyle}
            >
              
            </Link>
          </li>
          <li
            className="link"
            onMouseEnter={() => setHoveredLink("browse")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <Link
              to="#browse-skills"
              style={hoveredLink === "browse" ? hoverStyle : linkStyle}
            >
             
            </Link>
          </li>
          <li
            className="link"
            onMouseEnter={() => setHoveredLink("share")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <Link
              to="/community"
              onClick={() => {
                if (!localStorage.getItem("userId")) {
                  setIsAuthModalOpened(true);
                }
              }}
              style={hoveredLink === "share" ? hoverStyle : linkStyle}
            >
              
            </Link>
          </li>
          <li className="link">
           
          </li>
        </ul>
      </nav>
      <div className="section__container header__container" id="home">
        <div>
        <img
  src="assets/Layer2.jpg"
  alt="header"
  style={{
    height: "90vh",
    width: "auto",
    display: "block",
    marginLeft: "auto"
  }}
/>


        </div>
        <div className="header__content">
          <h4>Unlock Your Potential </h4>
          <h1 className="section__header"> Learn, Grow, Succeed!</h1>
          <p style={{ color: "black" }}>
            Discover and develop a diverse array of skills, from programming and graphic design to baking,
            woodworking, digital marketing, and beyond. Sign up now to begin learning from experts or share
            your own knowledge with a vibrant community of learners.
          </p>

          <div className="header__btn">
            <button
              onClick={() => {
                if (localStorage.getItem("userId")) {
                  navigate("/community");
                } else {
                  setIsAuthModalOpened(true);
                }
              }}
              className="btn"
            >
              Start Your Skill-Building Adventure
            </button>
          </div>
        </div>
      </div>
      <AuthModal
        onClose={() => {
          setIsAuthModalOpened(false);
        }}
        isOpen={isAuthModalOpened}
      />
    </header>
  );
};

export default Header;
