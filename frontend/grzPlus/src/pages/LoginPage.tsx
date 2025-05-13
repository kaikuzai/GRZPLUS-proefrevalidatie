import Footer from "../components/Footer/Footer";
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
      <Footer />
    </>
  );
};

export default LoginPage;
