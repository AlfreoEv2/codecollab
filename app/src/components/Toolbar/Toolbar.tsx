import { useState } from "react";
import Menu from "./Menu";
import { ToolbarProps } from "../../interfaces/ToolbarInterface";
import "./Toolbar.css";

interface ToolbarPropsWithNewProject {
  menus: ToolbarProps[];
  onNewProjectClick: () => void;
}

const Toolbar = ({ menus, onNewProjectClick }: ToolbarPropsWithNewProject) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const menuName = event.currentTarget.innerText;
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  return (
    <div className="toolbar">
      {menus.map((menu) => (
        <div key={menu.name}>
          <button onClick={handleButtonClick}>{menu.name}</button>
          {activeMenu === menu.name && (
            <Menu items={menu.items} onNewProjectClick={onNewProjectClick} />
          )}
        </div>
      ))}
    </div>
  );
};

export default Toolbar;
