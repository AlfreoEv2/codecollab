import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileNavigator from "../../components/Sidebar/FileNavigator";
import { SidebarProps } from "../../interfaces/SidebarInterface";
import "./Sidebar.css";

const Sidebar = ({ files }: SidebarProps) => {
  return (
    <div className="sidebar-container">
      <div className="sidebar">
        <FontAwesomeIcon icon={["fas", "file"]} className="sidebar-icon" />
        <FontAwesomeIcon
          icon={["fas", "code-branch"]}
          className="sidebar-icon"
        />
      </div>
      <FileNavigator files={files} />
    </div>
  );
};

export default Sidebar;
