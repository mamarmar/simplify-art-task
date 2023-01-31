import axios from "axios";
import React from "react";
import "./App.css";

export default function App() {
  const [errorMessage, setErrorMessage] = React.useState("");
  const [successfulMessage, setSuccessfulMessage] = React.useState("");
  const [formData, setFormData] = React.useState({
    number: "",
    exp_month: "",
    exp_year: "",
    cvc: "",
  });

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  async function saveCard(e) {
    e.preventDefault();
    try {
        await axios.post("http://localhost:5000/create-card", formData);
        setErrorMessage("");
        setSuccessfulMessage("You card details have been saved.");
        setTimeout(()=> {
          window.location.reload()
        }, 1500);
    } catch (err) {
        setErrorMessage(err.response.data);
    }
  }

  return (
    <div className="App">
      <form onSubmit={saveCard}>
        <h1>Credit Card Details</h1>
        <input
          required
          type="number"
          placeholder="Card Number"
          onChange={handleChange}
          name="number"
          value={formData.number}
        />
        <input
          required
          type="number"
          placeholder="Expiry Month"
          onChange={handleChange}
          name="exp_month"
          value={formData.exp_month}
        />
        <input
          type="number"
          required
          placeholder="Expiry Year"
          onChange={handleChange}
          name="exp_year"
          value={formData.exp_year}
        />
        <input
          required
          type="number"
          placeholder="CVC"
          onChange={handleChange}
          name="cvc"
          value={formData.cvc}
        />
        <button>Submit</button>
        <p className="errorMsg">{errorMessage ? errorMessage : ""}</p>
        <p className="successMsg">{successfulMessage ? successfulMessage: ""}</p>
      </form>
      
    </div>
  );
}
