const form = document.getElementById("predictionForm");
const result = document.getElementById("result");
const button = document.getElementById("predictButton");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    result.textContent = "";
    button.disabled = true;
    button.textContent = "Predicting...";

    const studentData = {
        gender: document.getElementById("gender").value,
        race_ethnicity: document.getElementById("race").value,
        parental_level_of_education:
            document.getElementById("education").value,
        lunch: document.getElementById("lunch").value,
        test_preparation_course:
            document.getElementById("preparation").value,
        reading_score: Number(document.getElementById("reading").value),
        writing_score: Number(document.getElementById("writing").value)
    };

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail
                    ? JSON.stringify(data.detail)
                    : "Prediction request failed."
            );
        }

        result.textContent =
            "Predicted Math Score: " + data.predicted_math_score;

    } catch (error) {
        result.textContent =
            "Error: " + error.message +
            " Check whether the FastAPI backend is running.";
    } finally {
        button.disabled = false;
        button.textContent = "Predict Math Score";
    }
});