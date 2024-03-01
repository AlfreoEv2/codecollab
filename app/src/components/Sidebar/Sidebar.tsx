import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <FontAwesomeIcon icon={["fas", "file"]} className="sidebar-icon" />
        <FontAwesomeIcon
          icon={["fas", "code-branch"]}
          className="sidebar-icon"
        />
      </div>
    </div>
  );
};

export default Sidebar;
