import { useNavigate } from "react-router-dom";
import { formsDataExport } from "../../hooks/useAllForms";
import "./FromGrid.css";

const FormGrid = () => {
  const items = formsDataExport;

  const navigate = useNavigate();
  const handleFormNavigate = () => {
    navigate("/formulier");
  };

  return (
    <div className="grid-container">
      {items.map((item, index) => (
        <div key={index} className="grid-item" onClick={handleFormNavigate}>
          <img
            src={item.image ? item.image : "/logo-grzplus.svg"}
            alt={item.description}
            className="grid-icon"
          />
          <div className="grid-label"> {item.name}</div>
        </div>
      ))}
      ;
    </div>
  );
};

export default FormGrid;
