import FormGrid from "../components/FormGridV2/FormGrid";
import Navbar from "../components/Navbar/Navbar";

const FormSelection = () => {
  return (
    <div className="form-selection-container">
      <Navbar />
      <div className="form-selection-content">
        <FormGrid />
      </div>
    </div>
  );
};

export default FormSelection;
