
import { useEffect, useState } from "react";

// Address of our FastAPI backend
const API_URL = "http://127.0.0.1:8000";

function App() {
    // Store the list of students
    const [students, setStudents] = useState([]);

    // Store form input values
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState("");

    // Store success or error messages
    const [message, setMessage] = useState("");

    // Load students when the page opens
    useEffect(() => {
        loadStudents();
    }, []);

    // GET: Fetch students from FastAPI
    async function loadStudents() {
        try {
            const response = await fetch(`${API_URL}/students`);

            if (!response.ok) {
                throw new Error("Unable to load students");
            }

            const data = await response.json();
            setStudents(data);
        } catch (error) {
            setMessage("Cannot connect to backend or database.");
        }
    }

    // POST: Send new student details to FastAPI
    async function addStudent(event) {
        event.preventDefault();

        try {
            const response = await fetch(`${API_URL}/students`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },

                // Send form data as JSON
                body: JSON.stringify({
                    name: name,
                    email: email,
                    department: department
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    typeof data.detail === "string"
                        ? data.detail
                        : "Please check your input"
                );
            }

            setMessage("Student added successfully!");

            // Clear the form
            setName("");
            setEmail("");
            setDepartment("");

            // Refresh the table
            await loadStudents();
        } catch (error) {
            setMessage(error.message);
        }
    }

    // DELETE: Remove a student using their ID
    async function deleteStudent(id) {
        try {
            const response = await fetch(
                `${API_URL}/students/${id}`,
                { method: "DELETE" }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Delete failed");
            }

            setMessage("Student deleted successfully!");

            // Reload the student list
            await loadStudents();
        } catch (error) {
            setMessage(error.message);
        }
    }

    return (
        <div className="page">
            <header className="header">
                <h1>Student Management System</h1>
                <p>Add, view and delete student records</p>
            </header>

            <main className="container">
                {/* Form to add a new student */}
                <section className="card">
                    <h2>Add Student</h2>

                    <form onSubmit={addStudent}>
                        <label>Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter student name"
                            required
                        />

                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            required
                        />

                        <label>Department</label>
                        <input
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            placeholder="Enter department"
                            required
                        />

                        <button type="submit">Add Student</button>
                    </form>

                    {/* Show status messages */}
                    {message && <p className="message">{message}</p>}
                </section>

                {/* Display saved students */}
                <section className="card">
                    <h2>Student Records ({students.length})</h2>

                    {students.length === 0 ? (
                        <p>No student records available.</p>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Department</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.id}>
                                            <td>{student.id}</td>
                                            <td>{student.name}</td>
                                            <td>{student.email}</td>
                                            <td>{student.department}</td>
                                            <td>
                                                <button
                                                    className="delete-button"
                                                    onClick={() =>
                                                        deleteStudent(student.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;
