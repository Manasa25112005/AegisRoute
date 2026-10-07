import { useEffect, useState } from "react";
import "../styles/Cards.css";

function RoutingHistory() {

    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);


    // =========================================
    // FETCH RECENT ROUTING DECISIONS
    // =========================================

    const fetchHistory = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/routing/decisions/recent"
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch routing decisions"
                );
            }

            const data = await response.json();

            setHistory(
                Array.isArray(data)
                    ? data
                    : []
            );

            setError("");

        } catch (err) {

            console.error(
                "Routing history error:",
                err
            );

            setError(err.message);

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // INITIAL LOAD + AUTO REFRESH
    // =========================================

    useEffect(() => {

        fetchHistory();

        const interval = setInterval(
            fetchHistory,
            5000
        );

        return () => {
            clearInterval(interval);
        };

    }, []);


    // =========================================
    // FORMAT TIME
    // =========================================

    const formatTime = (timestamp) => {

        if (!timestamp) {
            return "--";
        }

        const date =
            new Date(timestamp);

        if (Number.isNaN(date.getTime())) {
            return "--";
        }

        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                fractionalSecondDigits: 3,
                hour12: true
            }
        );

    };


    // =========================================
    // STATUS CLASS
    // =========================================

    const getStatusClass = (status) => {

        if (
            status &&
            status.toLowerCase() === "success"
        ) {

            return "successBadge";

        }

        return "warningBadge";

    };


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div className="historyCard">

                <div className="historyHeader">

                    <h3>
                        Recent Routing Decisions
                    </h3>

                </div>

                <p>
                    Unable to load routing decisions:
                    {" "}
                    {error}
                </p>

            </div>

        );

    }


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="historyCard">

                <div className="historyHeader">

                    <h3>
                        Recent Routing Decisions
                    </h3>

                </div>

                <p>
                    Loading routing decisions...
                </p>

            </div>

        );

    }


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="historyCard">

            <div className="historyHeader">

                <h3>
                    Recent Routing Decisions
                </h3>

                <span className="liveIndicator">
                    <span className="liveDot"></span>
                    Live Decisions
                </span>

            </div>


            <table className="historyTable">

                <thead>

                <tr>

                    <th>
                        Time
                    </th>

                    <th>
                        Request ID
                    </th>

                    <th>
                        Gateway
                    </th>

                    <th>
                        Latency
                    </th>

                    <th>
                        Status
                    </th>

                </tr>

                </thead>


                <tbody>

                {history.length === 0 ? (

                    <tr>

                        <td
                            colSpan="5"
                            style={{
                                textAlign: "center"
                            }}
                        >
                            No routing decisions yet.
                        </td>

                    </tr>

                ) : (

                    history.map((item) => (

                        <tr
                            key={
                                item.id ||
                                item.requestId
                            }
                        >

                            <td>
                                {formatTime(
                                    item.timestamp
                                )}
                            </td>


                            <td>
                                {item.requestId}
                            </td>


                            <td>
                                {item.gatewayName}
                            </td>


                            <td>
                                {Number(
                                    item.latency
                                ).toFixed(0)}
                                {" "}ms
                            </td>


                            <td>

                                <span
                                    className={
                                        getStatusClass(
                                            item.status
                                        )
                                    }
                                >
                                    {item.status}
                                </span>

                            </td>

                        </tr>

                    ))

                )}

                </tbody>

            </table>

        </div>

    );

}

export default RoutingHistory;