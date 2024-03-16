import { useState } from "react";
import Toolbar from "../../components/Toolbar/Toolbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import CodeArea from "../../components/CodeArea/CodeArea";
import Console from "../../components/Console/Console";
import { FileOrFolder } from "../../interfaces/SidebarInterface";
import menuItems from "../../data/menuItems.json";
import useLineHandlers from "../../hooks/useLineHandler";
import EditorContext from "../../contexts/EditorContext";
import "./Editor.css";

const Editor = () => {
  const [files, setFiles] = useState<FileOrFolder[]>([]);
  const [command, setCommand] = useState<string>("");
  const [lines, handleLineChange, handleLineEnter] = useLineHandlers([""]);

  return (
    <EditorContext.Provider
      value={{
        files,
        setFiles,
        command,
        setCommand,
        lines,
        handleLineChange,
        handleLineEnter,
      }}
    >
      <div>
        <Toolbar menus={menuItems} />
        <div className="editor-container">
          <Sidebar />
          <div className="code-console-container">
            <CodeArea />
            <Console />
          </div>
        </div>
      </div>
    </EditorContext.Provider>
  );
};

export default Editor;
