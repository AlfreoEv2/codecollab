import { useState } from "react";
import "./OpenProjectPopup.css";

interface OpenProjectPopupProps {
  onSubmit: (projectId: string) => void;
  onCancel: () => void;
}

const OpenProjectPopup = ({ onSubmit, onCancel }: OpenProjectPopupProps) => {
  const [projectId, setProjectId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(projectId);
  };

  return (
    <div className="open-project-popup">
      <form onSubmit={handleSubmit}>
        <label htmlFor="projectId">Project ID:</label>
        <input
          type="text"
          id="projectId"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />
        <div className="buttons">
          <button type="submit">Open</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default OpenProjectPopup;
