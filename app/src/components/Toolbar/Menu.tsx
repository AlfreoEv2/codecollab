import { MenuProps } from "../../interfaces/ToolbarInterface";
import "./Menu.css";

interface MenuPropsWithNewProject extends MenuProps {
  onNewProjectClick: () => void;
  onOpenProjectClick: () => void;
}

const Menu = ({
  items,
  onNewProjectClick,
  onOpenProjectClick,
}: MenuPropsWithNewProject) => {
  const handleNewProjectClick = () => {
    onNewProjectClick();
  };

  const handleOpenProjectClick = () => {
    onOpenProjectClick();
  };

  return (
    <div className="menu">
      <div className="separator"></div>
      {items.map((item, index) =>
        item.label === "Separator" ? (
          <div key={index} className="separator"></div>
        ) : item.label === "New Project" ? (
          <button key={index} onClick={handleNewProjectClick}>
            {item.label}
          </button>
        ) : item.label === "Open Project" ? (
          <button key={index} onClick={handleOpenProjectClick}>
            {item.label}
          </button>
        ) : (
          <button key={index}>{item.label}</button>
        )
      )}
    </div>
  );
};

export default Menu;
