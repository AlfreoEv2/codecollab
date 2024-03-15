import React from "react";
import ContentEditable from "../CodeArea/ContentEditable";
import "./Console.css";

interface IConsoleProps {
  command: string;
  setCommand: React.Dispatch<React.SetStateAction<string>>;
}

const Console = ({ command, setCommand }: IConsoleProps) => {
  return (
    <div className="console-container">
      <div className="console-header">Console</div>
      <div className="console-content"></div>
      <ContentEditable
        html={command}
        onChange={(e) => setCommand(e.currentTarget.innerHTML)}
        className="console-input"
      />
    </div>
  );
};

export default Console;
