import { useState } from "react";
import "./CreateFilePopup.css";

interface CreateFilePopupProps {
  onSubmit: (filename: string) => void;
  onCancel: () => void;
}

const CreateFilePopup = ({ onSubmit, onCancel }: CreateFilePopupProps) => {
  const [filename, setFilename] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(filename);
  };

  return (
    <div className="create-file-popup">
      <form onSubmit={handleSubmit}>
        <label htmlFor="filename">File Name:</label>
        <input
          type="text"
          id="filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
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

export default CreateFilePopup;
