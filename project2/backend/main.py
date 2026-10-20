
import pandas as pd
import joblib

from fastapi import FastAPI
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load the trained model and training columns
model = joblib.load("model.pkl")
model_columns = joblib.load("model_columns.pkl")


class StudentData(BaseModel):
    gender: str
    race_ethnicity: str
    parental_level_of_education: str
    lunch: str
    test_preparation_course: str
    reading_score: int = Field(ge=0, le=100)
    writing_score: int = Field(ge=0, le=100)


@app.get("/")
def home():
    return {"message": "Student Score Prediction API is running"}


@app.post("/predict")
def predict(data: StudentData):

    student = pd.DataFrame([{
        "gender": data.gender,
        "race/ethnicity": data.race_ethnicity,
        "parental level of education":
            data.parental_level_of_education,
        "lunch": data.lunch,
        "test preparation course":
            data.test_preparation_course,
        "reading score": data.reading_score,
        "writing score": data.writing_score
    }])

    student = pd.get_dummies(
        student,
        columns=[
            "gender",
            "race/ethnicity",
            "parental level of education",
            "lunch",
            "test preparation course"
        ],
        drop_first=True
    )

    student = student.reindex(
        columns=model_columns,
        fill_value=0
    )

    prediction = model.predict(student)[0]

    return {
        "predicted_math_score": round(float(prediction), 2)
    }
