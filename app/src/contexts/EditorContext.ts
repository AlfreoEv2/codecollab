import { createContext, Dispatch } from "react";
import { FileOrFolder } from "../interfaces/SidebarInterface";

interface IEditorContext {
  files: FileOrFolder[];
  setFiles: Dispatch<React.SetStateAction<FileOrFolder[]>>;
  activeFile: React.MutableRefObject<FileOrFolder | null>;
  lines: string[];
  setLines: Dispatch<React.SetStateAction<string[]>>;
  handleLineChange: (e: React.FormEvent<HTMLDivElement>, index: number) => void;
  handleLineEnter: (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLDivElement>, index: number) => void;
  handleTab: (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void;
  handleBackspace: (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => void;
  handleBackspaceHighlight: (start: number, end: number) => void;
  handleArrowUp: (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => void;
  handleArrowDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number
  ) => void;
  command: string;
  setCommand: Dispatch<React.SetStateAction<string>>;
  activeProject: string | null;
}

const EditorContext = createContext<IEditorContext | undefined>(undefined);

export default EditorContext;
