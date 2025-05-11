import { useNavigate } from "react-router-dom";
import useFormsIcons from "../../hooks/useFormIcons";
import "./FromGrid.css";

const FormGrid = () => {
  const { data } = useFormsIcons();
  const navigate = useNavigate();

  const handleFormNavigate = (slug: string) => {
    navigate(`/formulier/${slug}`);
  };

  if (!data) {
    return <div>Laden...</div>; // Show a loading message if data is undefined
  }

  return (
    <div className="grid-container">
      {data.map((data, index) => (
        <div
          key={index}
          className="grid-item"
          onClick={() => handleFormNavigate(data.slug)}
        >
          <img
            src={data.image ? data.image : "/logo-grzplus.svg"}
            alt={data.description}
            className="grid-icon"
          />
          <div className="grid-label"> {data.name}</div>
        </div>
      ))}
      ;
    </div>
  );
};

export default FormGrid;
