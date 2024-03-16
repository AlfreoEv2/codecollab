import { useState } from "react";
import Toolbar from "../../components/Toolbar/Toolbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import CodeArea from "../../components/CodeArea/CodeArea";
import Console from "../../components/Console/Console";
import { FileOrFolder } from "../../interfaces/SidebarInterface";
import menuItems from "../../data/menuItems.json";
import useLineHandlers from "../../hooks/useLineHandler";
import "./Editor.css";

const Editor = () => {
  const [files, setFiles] = useState<FileOrFolder[]>([]);
  const [command, setCommand] = useState<string>("");
  const [lines, handleLineChange, handleLineOnEnter] = useLineHandlers([""]);

  return (
    <div>
      <Toolbar menus={menuItems} />
      <div className="editor-container">
        <Sidebar files={files} />
        <div className="code-console-container">
          <CodeArea
            lines={lines}
            onChange={handleLineChange}
            onKeyDown={handleLineOnEnter}
          />
          <Console command={command} setCommand={setCommand} />
        </div>
      </div>
    </div>
  );
};

export default Editor;
