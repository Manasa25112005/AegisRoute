import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
data = pd.read_csv("gateway_dataset.csv")

# Convert categorical columns to numeric
data["GatewayName"] = data["GatewayName"].map({
    "OpenAI": 0,
    "Gemini": 1,
    "Claude": 2
})

data["Status"] = data["Status"].map({
    "UP": 1,
    "DOWN": 0
})

# Features
X = data[[
    "GatewayName",
    "ResponseTime",
    "FailureCount",
    "Cost",
    "CircuitOpen",
    "Status"
]]

# Target
y = data["Selected"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train Decision Tree
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)

# Test Accuracy
predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("Accuracy :", accuracy)

# Save model
joblib.dump(model, "gateway_model.pkl")

print("Model saved successfully!")