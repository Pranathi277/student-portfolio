import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import "../styles/login.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return alert("Please enter your email");

    setLoading(true);
    try {
      const result = await apiService.forgotPassword(email);
      if (result.success) {
        alert(result.message);
        setStep(2);
      } else {
        alert(result.message || "Error sending OTP");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match!");
    }

    setLoading(true);
    try {
      const result = await apiService.resetPassword({ email, otp, newPassword });
      if (result.success) {
        alert(result.message || "Password reset successfully! You can now login.");
        navigate("/");
      } else {
        alert(result.message || "Invalid OTP or error resetting password");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="logo-box">🔒</div>
        <h2>Reset Password</h2>
        <p className="subtitle">Recover your Student Projects account</p>

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <label>Registered Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <p className="forgot" onClick={() => navigate("/")} style={{cursor: 'pointer', textAlign: 'center', marginTop: '15px'}}>
              Back to Login
            </p>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <label>Enter OTP</label>
            <input
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset & Save Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
