import { useState } from "react";
import "./NewProjectPopup.css";

interface NewProjectPopupProps {
  onSubmit: (projectName: string) => void;
  onCancel: () => void;
}

const NewProjectPopup = ({ onSubmit, onCancel }: NewProjectPopupProps) => {
  const [projectName, setProjectName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(projectName);
  };

  return (
    <div className="new-project-popup">
      <form onSubmit={handleSubmit}>
        <label htmlFor="projectName">Project Name:</label>
        <input
          type="text"
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <div className="buttons">
          <button type="submit">Create</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectPopup;
