from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)


# =====================================================
# LOAD TRAINED MODEL
# =====================================================

model = joblib.load("gateway_model.pkl")


# =====================================================
# PREDICTION API
# =====================================================

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    # Gateway encoding
    gateway = {
        "OpenAI": 0,
        "Gemini": 1,
        "Claude": 2
    }

    # Status encoding
    status = {
        "UP": 1,
        "DOWN": 0
    }

    gateway_name = data["GatewayName"]

    gateway_code = gateway[gateway_name]

    # =================================================
    # CREATE MODEL INPUT
    # =================================================

    df = pd.DataFrame([{
        "GatewayName": gateway_code,
        "ResponseTime": data["ResponseTime"],
        "FailureCount": data["FailureCount"],
        "Cost": data["Cost"],
        "CircuitOpen": data["CircuitOpen"],
        "Status": status[data["Status"]]
    }])


    # =================================================
    # ML PREDICTION
    # =================================================

    prediction = model.predict(df)

    predicted_gateway = int(prediction[0])


    # =================================================
    # ML CONFIDENCE
    # =================================================

    confidence = 0.0

    if hasattr(model, "predict_proba"):

        probabilities = model.predict_proba(df)[0]

        confidence = (
            float(max(probabilities)) * 100
        )

        print(
            gateway_name,
            "probabilities:",
            probabilities
        )

    else:

        print(
            gateway_name,
            "model does not support probabilities"
        )


    # =================================================
    # LOGGING
    # =================================================

    print("--------------------------------")
    print("Gateway:", gateway_name)
    print("Predicted Gateway:", predicted_gateway)
    print("Confidence:", confidence)
    print("--------------------------------")


    # =================================================
    # RETURN RESPONSE
    # =================================================

    return jsonify({

        "selected": predicted_gateway,

        "confidence": round(
            confidence,
            2
        ),

        # Java will calculate the final
        # performance-based routing score.
        "routingScore": 0.0

    })


# =====================================================
# START FLASK SERVER
# =====================================================

if __name__ == "__main__":

    app.run(
        port=5001
    )