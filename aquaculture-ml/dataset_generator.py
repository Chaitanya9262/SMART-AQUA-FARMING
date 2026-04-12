import pandas as pd
import random

data = []

for i in range(5000):

    temperature = round(random.uniform(26, 36), 1)
    ph = round(random.uniform(6.3, 8.5), 1)
    humidity = random.randint(60, 85)
    oxygen = round(random.uniform(2.0, 6.5), 1)

    # ✅ Improved disease logic
    if oxygen < 2.5 and temperature > 33:
        disease = "WSSV"
    elif ph < 6.5 and temperature > 32:
        disease = "AHPND"
    elif humidity > 82 and oxygen < 3.2:
        disease = "EHP"
    elif temperature < 27 and ph > 7.8:
        disease = "WFS"
    elif oxygen < 2.8:
        disease = "BGD"
    elif temperature > 35:
        disease = "RMS"
    elif ph > 8.5:
        disease = "Stress"
    else:
        disease = "Healthy"

    data.append([temperature, ph, humidity, oxygen, disease])

df = pd.DataFrame(data, columns=[
    "temperature", "ph", "humidity", "oxygen", "disease"
])

df.to_csv("dataset.csv", index=False)

print("✅ Dataset created")