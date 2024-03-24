import { useState } from "react";
import "./CreateFolderPopup.css";

interface CreateFolderPopupProps {
  onSubmit: (folderName: string) => void;
  onCancel: () => void;
}

const CreateFolderPopup = ({ onSubmit, onCancel }: CreateFolderPopupProps) => {
  const [folderName, setFolderName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(folderName);
  };

  return (
    <div className="create-folder-popup">
      <form onSubmit={handleSubmit}>
        <label htmlFor="folderName">Folder Name:</label>
        <input
          type="text"
          id="folderName"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
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

export default CreateFolderPopup;
