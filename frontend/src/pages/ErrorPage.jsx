import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../assets/commponents/Navbar";
import AboutUsSection  from "../assets/commponents/AboutUsSection ";

export default function ErrorPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const errorMessage = location.state?.message || "Something went wrong.";

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.heading}>🚫 Oops! An Error Occurred</h1>
          <p style={styles.message}>{errorMessage}</p>
          <div style={styles.buttonContainer}>
            <button style={styles.button} onClick={() => navigate(-1)}>
              🔙 Go Back
            </button>
            <button
              style={{ ...styles.button, backgroundColor: "#007BFF" }}
              onClick={() => navigate("/")}
            >
              🏠 Go Home
            </button>
          </div>
        </div>
      </div>

      <AboutUsSection/> 
    </>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "70vh",
    backgroundColor: "#f8f9fa",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    maxWidth: "500px",
    textAlign: "center",
  },
  heading: {
    fontSize: "28px",
    color: "#dc3545",
    marginBottom: "20px",
  },
  message: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "30px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#6c757d",
    color: "white",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};
