import { useState } from "react";
import "./RenamePopup.css";

interface RenamePopupProps {
  onSubmit: (newName: string) => void;
  onCancel: () => void;
  initialName: string;
}

const RenamePopup = ({ onSubmit, onCancel, initialName }: RenamePopupProps) => {
  const [newName, setNewName] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newName);
  };

  return (
    <div className="rename-popup">
      <form onSubmit={handleSubmit}>
        <label htmlFor="newName">Enter new name:</label>
        <input
          type="text"
          id="newName"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <div className="buttons">
          <button type="submit">Rename</button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RenamePopup;
