import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileNavigator from "../../components/Sidebar/FileNavigator";
import "./Sidebar.css";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleFileIconClick = () => {
    setActiveMenu(activeMenu === "file" ? null : "file");
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <FontAwesomeIcon
          icon={["fas", "file"]}
          className="sidebar-icon"
          onClick={handleFileIconClick}
        />
        <FontAwesomeIcon
          icon={["fas", "code-branch"]}
          className="sidebar-icon"
        />
      </div>
      {activeMenu === "file" && <FileNavigator />}
    </div>
  );
};

export default Sidebar;
