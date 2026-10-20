# student_management

step 1 Create the backend
Open the VS Code terminal and run these commands from your main project folder.

mkdir student_management
cd student_management
mkdir backend
cd backend

python -m venv .venv
.\.venv\Scripts\python.exe -m pip install fastapi "uvicorn[standard]" mysql-connector-python email-validator

step 2 create backend/requirements.txt and main.py

step 3 create react frontend
Open a second terminal in VS Code. Return to the main student_management folder and run:
npm create vite@latest frontend -- --template react
cd frontend
npm install

step 4 runthe project step by step

Make sure your MySQL Server service is running.
Terminal 1 — Start the backend
In VS Code, open a terminal in student_management/backend. 
cd backend
.\.venv\Scripts\python.exe -m uvicorn main:app --reload


If it starts successfully, you should see a message showing that the server is running on port 8000.
Open the API documentation to test the backend:
FastAPI API documentation

Terminal 2 — Start the frontend
Open another terminal in VS Code. Run:
cd frontend
npm run dev


Vite will display a local URL. Open the URL, usually:
React Student Management webpageKeep both terminals running while you use the project.

step 5  Check the database
Once MySQL is running:
1. Open MySQL Workbench.
2. Connect to your local MySQL Server.
3. Open a new SQL query tab.
4. Run this SQL:
CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;


The students table will be created automatically when your FastAPI backend starts.




