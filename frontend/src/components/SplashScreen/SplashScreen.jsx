import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import splashImage from "../../assets/images/splash.jpeg"; // Change to .jpg if needed

import "./SplashScreen.css";

function SplashScreen() {

    const navigate = useNavigate();

    useEffect(() => {

        const timer = setTimeout(() => {

            navigate("/dashboard");

        }, 3000);

        return () => clearTimeout(timer);

    }, [navigate]);

    return (

        <div className="splash">

            <img
                src={splashImage}
                alt="AegisRoute"
                className="splashImage"
            />

            <p className="loadingText">
                Loading...
            </p>

            <div className="loader"></div>

        </div>

    );

}

export default SplashScreen;