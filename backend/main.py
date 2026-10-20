
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import mysql.connector

# Create the FastAPI application
app = FastAPI()

# Allow requests from our React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect Python to MySQL
def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Root@123",
        database="stud_db"
    )

# Define the data received from React
class Student(BaseModel):
    name: str
    email: EmailStr
    department: str

# Create the table automatically when FastAPI starts
@app.on_event("startup")
def create_table():
    db = connect_db()
    cursor = db.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL,
            department VARCHAR(100) NOT NULL
        )
    """)

    db.commit()
    cursor.close()
    db.close()

# GET API: Retrieve all students
@app.get("/students")
def get_students():
    db = connect_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("SELECT * FROM students ORDER BY id DESC")
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()

# POST API: Add a student
@app.post("/students", status_code=201)
def add_student(student: Student):
    db = connect_db()
    cursor = db.cursor()

    try:
        cursor.execute(
            """INSERT INTO students (name, email, department)
               VALUES (%s, %s, %s)""",
            (student.name, student.email, student.department)
        )

        db.commit()

        return {
            "message": "Student added successfully",
            "id": cursor.lastrowid
        }
    finally:
        cursor.close()
        db.close()

# DELETE API: Delete a student by ID
@app.delete("/students/{student_id}")
def delete_student(student_id: int):
    db = connect_db()
    cursor = db.cursor()

    try:
        cursor.execute(
            "DELETE FROM students WHERE id = %s",
            (student_id,)
        )
        db.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=404,
                detail="Student not found"
            )

        return {"message": "Student deleted successfully"}
    finally:
        cursor.close()
        db.close()
