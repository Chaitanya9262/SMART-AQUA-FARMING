# from flask import Flask, request, jsonify
# import joblib

# app = Flask(__name__)

# model = joblib.load("model.pkl")
# scaler = joblib.load("scaler.pkl")

# @app.route("/predict", methods=["POST"])
# def predict():
#     data = request.json

#     features = [[
#         data["DO"],
#         data["pH"],
#         data["Alkalinity"],
#         data["Hardness"],
#         data["Nitrite"],
#         data["H2S"],
#         data["Salinity"],
#         data["Ammonia"],
#         data["Temperature"]
#     ]]

#     features = scaler.transform(features)

#     prediction = model.predict(features)

#     return jsonify({
#         "disease": prediction[0]
#     })

# if __name__ == "__main__":
#     app.run(port=8000, debug=True)


from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

model = joblib.load("model.pkl")
scaler = joblib.load("scaler.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # ✅ FIXED KEYS (IMPORTANT)
        features = [[
            data.get("oxygen", 0),      # DO
            data.get("ph", 0),
            data.get("alkalinity", 0),
            data.get("hardness", 0),
            data.get("nitrite", 0),
            data.get("h2s", 0),
            data.get("salinity", 0),
            data.get("ammonia", 0),
            data.get("temperature", 0)
        ]]

        features = scaler.transform(features)

        prediction = model.predict(features)

        return jsonify({
            "disease": prediction[0]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(port=8000, debug=True)