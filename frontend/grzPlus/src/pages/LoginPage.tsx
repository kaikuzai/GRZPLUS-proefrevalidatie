import LoginCard from "../components/LoginCard/LoginCard";
import Navbar from "../components/Navbar/Navbar";
import "../styles/LoginPage.css";

const LoginPage = () => {
  return (
    <>
      <Navbar />
      <div className="login-card-container">
        <LoginCard />
      </div>
    </>
  );
};

export default LoginPage;
