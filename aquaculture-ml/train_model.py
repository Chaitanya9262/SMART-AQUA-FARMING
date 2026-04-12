import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
import joblib

# Load dataset
data = pd.read_csv("dataset.csv")

# ✅ Convert multiple disease columns → single label
def get_disease(row):
    if row["WSS"] == 1:
        return "WSSV"
    elif row["AHPND"] == 1:
        return "AHPND"
    elif row["TSV"] == 1:
        return "TSV"
    elif row["YHV"] == 1:
        return "YHV"
    else:
        return "Healthy"

data["disease"] = data.apply(get_disease, axis=1)

# ✅ Features (use ALL important parameters)
X = data[[
    "DO", "pH", "Alkalinity", "Hardness",
    "Nitrite", "H2S", "Salinity", "Ammonia", "Temperature"
]]

# Target
y = data["disease"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scaling
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Model
model = RandomForestClassifier(n_estimators=200)
model.fit(X_train, y_train)

# Accuracy
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("🔥 Accuracy:", accuracy)

# Save
joblib.dump(model, "model.pkl")
joblib.dump(scaler, "scaler.pkl")

print("✅ Model trained successfully")