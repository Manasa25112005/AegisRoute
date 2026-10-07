import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PredictionCard from "../components/PredictionCard";

import "../styles/Layout.css";
import "../styles/Cards.css";

function Prediction() {

    return (

        <div className="appLayout">

            <Sidebar />

            <div className="mainContent">

                <Navbar
                    title="Prediction"
                    subtitle="AI-powered gateway selection and routing prediction"
                />

                <div className="predictionPage">
                    

                    <PredictionCard />

                </div>

            </div>

        </div>

    );

}

export default Prediction;