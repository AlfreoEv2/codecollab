import Toolbar from "../../components/Toolbar/Toolbar";
import { ToolbarProps } from "../../interfaces/ToolbarInterface";

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

  return (
    <div>
      <Toolbar menus={menus} />
    </div>
  );
};

export default Editor;
