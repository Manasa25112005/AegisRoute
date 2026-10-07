import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import symbol from "../assets/images/symbol.jpeg";

import "../styles/Layout.css";
import "../styles/About.css";

function About() {

    return (

        <div className="appLayout">

            <Sidebar />

            <div className="mainContent">

                <Navbar
                    title="About"
                    subtitle="About the AegisRoute AI Gateway Platform"
                />

                <div className="aboutPage">

                    {/* Project Introduction */}

                    <div className="aboutHero">

                        <img
                            src={symbol}
                            alt="AegisRoute"
                            className="aboutLogo"
                        />

                        <div>

                            <h1>AegisRoute</h1>

                            <p>
                                An intelligent AI gateway routing and management
                                platform designed to select the most suitable
                                AI provider based on real-time performance
                                conditions.
                            </p>

                        </div>

                    </div>


                    {/* Core Components */}

                    <h2 className="aboutSectionTitle">
                        Core Components
                    </h2>

                    <div className="aboutCards">

                        <div className="aboutCard">

                            <div className="aboutIcon">🧠</div>

                            <h3>Decision Tree</h3>

                            <p>
                                Predicts the most suitable gateway using
                                gateway performance and health features.
                            </p>

                        </div>


                        <div className="aboutCard">

                            <div className="aboutIcon">🔀</div>

                            <h3>Routing Engine</h3>

                            <p>
                                Selects and routes requests to the most
                                suitable available AI gateway.
                            </p>

                        </div>


                        <div className="aboutCard">

                            <div className="aboutIcon">⚡</div>

                            <h3>Circuit Breaker</h3>

                            <p>
                                Protects the system from unhealthy gateways
                                by managing CLOSED, OPEN and HALF-OPEN states.
                            </p>

                        </div>


                        <div className="aboutCard">

                            <div className="aboutIcon">📊</div>

                            <h3>Analytics</h3>

                            <p>
                                Provides visual insights into gateway latency,
                                success rate, cost and routing performance.
                            </p>

                        </div>

                    </div>


                    {/* Technology Stack */}

                    <h2 className="aboutSectionTitle">
                        Technology Stack
                    </h2>

                    <div className="technologyCard">

                        <span>React</span>

                        <span>JavaScript</span>

                        <span>Machine Learning</span>

                        <span>Decision Tree</span>

                        <span>Routing Engine</span>

                        <span>Circuit Breaker</span>

                        <span>Recharts</span>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default About;