from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    features = [[
        data["DO"],
        data["pH"],
        data["Alkalinity"],
        data["Hardness"],
        data["Nitrite"],
        data["H2S"],
        data["Salinity"],
        data["Ammonia"],
        data["Temperature"]
    ]]

    features = scaler.transform(features)

    prediction = model.predict(features)

    return jsonify({
        "disease": prediction[0]
    })

if __name__ == "__main__":
    app.run(port=8000, debug=True)