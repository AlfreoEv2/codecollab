import { useState } from "react";
import Toolbar from "../../components/Toolbar/Toolbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import CodeArea from "../../components/CodeArea/CodeArea";
import { ToolbarProps } from "../../interfaces/ToolbarInterface";
import { FileOrFolder } from "../../interfaces/SidebarInterface";
import "./Editor.css";

const Editor = () => {
  const menus: ToolbarProps[] = [
    {
      name: "File",
      items: [
        { label: "New File" },
        { label: "Save" },
        { label: "Save as" },
        { label: "Separator" },
        { label: "Download" },
        { label: "Share" },
      ],
    },
    {
      name: "Edit",
      items: [
        { label: "Undo" },
        { label: "Redo" },
        { label: "Separator" },
        { label: "Cut" },
        { label: "Copy" },
        { label: "Paste" },
      ],
    },
    {
      name: "View",
      items: [
        { label: "Zoom in" },
        { label: "Zoom out" },
        { label: "Reset zoom" },
        { label: "Separator" },
        { label: "Theme" },
      ],
    },
    {
      name: "Run",
      items: [{ label: "Start" }, { label: "Stop" }, { label: "Restart" }],
    },
  ];

  const [files, setFiles] = useState<FileOrFolder[]>([]);
  const [lines, setLines] = useState<string[]>([""]);

  const handleLineChange = (
    e: React.FormEvent<HTMLDivElement>,
    index: number
  ) => {
    const newLines = [...lines];
    newLines[index] = e.currentTarget.innerHTML;
    setLines(newLines);
  };

  return (
    <div>
      <Toolbar menus={menus} />
      <div className="editor-area">
        <Sidebar files={files} />
        <CodeArea lines={lines} onChange={handleLineChange} />
      </div>
    </div>
  );
};

export default Editor;
