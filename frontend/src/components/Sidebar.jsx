import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.jpeg";
import {
    FaHome,
    FaServer,
    FaChartBar,
    FaBrain,
    FaHeartbeat,
    FaInfoCircle
} from "react-icons/fa";

import "../styles/Sidebar.css";

function Sidebar() {

    const menu = [

        { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },

        { name: "Gateway Management", path: "/gateway-management", icon: <FaServer /> },

        { name: "Analytics", path: "/analytics", icon: <FaChartBar /> },

        { name: "Prediction", path: "/prediction", icon: <FaBrain /> },

        { name: "Health Monitoring", path: "/health-monitoring", icon: <FaHeartbeat /> },

        { name: "About", path: "/about", icon: <FaInfoCircle /> }

    ];

    return (

        <div className="sidebar">

            <div className="logo">
                <img
                    src={logo}
                    alt="AegisRoute"
                    className="sidebarLogo"
                />
            </div>

            <div className="menu">

                {menu.map((item) => (

                    <NavLink

                        key={item.name}

                        to={item.path}

                        className={({ isActive }) =>
                            isActive ? "menuItem active" : "menuItem"
                        }

                    >

                        <span className="icon">{item.icon}</span>

                        <span>{item.name}</span>

                    </NavLink>

                ))}

            </div>

        </div>

    );

}

export default Sidebar;