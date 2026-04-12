function predictDisease(temp, ph, oxygen) {

    if (ph < 7 && oxygen < 4)
        return "White Spot Disease";

    if (temp > 32)
        return "Black Gill Disease";

    if (oxygen < 3)
        return "Low Oxygen Stress";

    return "Healthy";
}

module.exports = predictDisease;