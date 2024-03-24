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
import NewProjectPopup from "../../components/NewProjectPopup/NewProjectPopup";
import { createProject } from "../../apis/project";

const Editor = () => {
  const [files, setFiles] = useState<FileOrFolder[]>([]);
  const [command, setCommand] = useState<string>("");
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [showNewProjectPopup, setShowNewProjectPopup] = useState(false);
  const [
    lines,
    handleLineChange,
    handleLineEnter,
    handlePaste,
    handleBackspace,
    handleBackspaceHighlight,
    handleArrowUp,
    handleArrowDown,
    handleTab,
  ] = useLineHandlers([""]);

  const handleNewProject = async (projectName: string) => {
    try {
      const projectData = {
        projectName,
        owner: "65ff34d5cc86ce3e8187c738", // Replace with the actual owner ID
        collaborators: [], // Add collaborators if needed
        language: "javascript", // Replace with the desired language
      };
      const newProject = await createProject(projectData);
      setActiveProject(newProject._id);
      setShowNewProjectPopup(false);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleNewProjectClick = () => {
    console.log("New Project Clicked!!");
    setShowNewProjectPopup(true);
  };

  const handleNewProjectCancel = () => {
    setShowNewProjectPopup(false);
  };
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
        handlePaste,
        handleBackspace,
        handleBackspaceHighlight,
        handleArrowUp,
        handleArrowDown,
        handleTab,
      }}
    >
      <div>
        <Toolbar menus={menuItems} onNewProjectClick={handleNewProjectClick} />
        <div className="editor-container">
          <Sidebar />
          <div className="code-console-container">
            <CodeArea />
            <Console />
          </div>
        </div>
        {showNewProjectPopup && (
          <NewProjectPopup
            onSubmit={handleNewProject}
            onCancel={handleNewProjectCancel}
          />
        )}
      </div>
    </EditorContext.Provider>
  );
};

export default Editor;
