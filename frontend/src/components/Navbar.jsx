import "../styles/Navbar.css";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

function Navbar({
                    title = "Dashboard",
                    subtitle = "Intelligent ML-Driven AI Gateway",
                    showSearch = false
                }) {

    return (

        <div className="navbar">

            <div className="navbarLeft">

                <h1>{title}</h1>

                <p>{subtitle}</p>

            </div>

            <div className="navbarRight">

                {showSearch && (
                    <div className="searchBox">

                        <FaSearch />

                        <input
                            type="text"
                            placeholder="Search..."
                        />

                    </div>
                )}

                <FaBell className="navIcon"/>

                <FaUserCircle className="profileIcon"/>

            </div>

        </div>

    );

}

export default Navbar;