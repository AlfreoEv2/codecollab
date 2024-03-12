import { useState } from "react";
import Toolbar from "../../components/Toolbar/Toolbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import CodeArea from "../../components/CodeArea/CodeArea";
import Console from "../../components/Console/Console";
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

  const handleLineOnEnter = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const sel = window.getSelection();
      if (sel) {
        const selRange = sel.getRangeAt(0);
        // Get the text after the caret position
        const textAfterCaret =
          selRange.endContainer.textContent?.slice(selRange.endOffset) || "";

        setLines((prevLines) => {
          const newLines = [...prevLines];
          // Update current line to include text until the caret position
          newLines[index] = newLines[index].slice(0, selRange.endOffset);
          // Insert a new line after the current line with the text
          newLines.splice(index + 1, 0, textAfterCaret);
          return newLines;
        });

        setTimeout(() => {
          // Select the next div
          const nextLine =
            document.querySelectorAll(".line-content")[index + 1];
          if (nextLine) {
            const range = document.createRange();
            range.setStart(nextLine, 0);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }, 0);
      }
    }
  };

  return (
    <div>
      <Toolbar menus={menus} />
      <div className="editor-container">
        <Sidebar files={files} />
        <div className="code-console-container">
          <CodeArea
            lines={lines}
            onChange={handleLineChange}
            onKeyDown={handleLineOnEnter}
          />
          <Console />
        </div>
      </div>
    </div>
  );
};

export default Editor;
