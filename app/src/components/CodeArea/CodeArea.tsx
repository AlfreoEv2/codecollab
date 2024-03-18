import { useState } from "react";
import ContentEditable from "./ContentEditable";
import useEditorContext from "../../hooks/useEditorContext";
import "./CodeArea.css";

const CodeArea = () => {
  const { lines, handleLineChange, handleLineEnter } = useEditorContext();

  // State to keep track of the start and end indices of the selection
  const [selection, setSelection] = useState<{
    start: number | null;
    end: number | null;
  }>({ start: null, end: null });
  // State to keep track of mouse down event
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const handleMouseDown = (index: number) => {
    setSelection({ start: index, end: null });
    setIsMouseDown(true);
  };

  const handleMouseMove = (index: number) => {
    if (isMouseDown && selection.start !== null && selection.start !== index)
      setSelection({ start: selection.start, end: index });
  };

  const handleMouseUp = () => {
    if (selection.start !== null && selection.end !== null) {
      // The start and end index of the selection
      const start = Math.min(selection.start, selection.end);
      const end = Math.max(selection.start, selection.end) + 1;

      // Copy the lines between start and end indices
      navigator.clipboard.writeText(lines.slice(start, end).join("\n"));
    }
    setIsMouseDown(false);
  };

  return (
    <div className="code-area">
      {lines.map((line, index) => (
        <div
          key={index}
          className="line-container"
          onMouseDown={() => handleMouseDown(index)}
          onMouseMove={() => handleMouseMove(index)}
          onMouseUp={handleMouseUp}
        >
          <div className="line-number">{index + 1}</div>
          <ContentEditable
            html={line}
            className={`line-content ${
              selection.start !== null &&
              selection.end !== null &&
              index >= Math.min(selection.start, selection.end) &&
              index <= Math.max(selection.start, selection.end)
                ? "highlight"
                : ""
            }`}
            onChange={(e) => handleLineChange(e, index)}
            onKeyDown={(e) => handleLineEnter(e, index)}
          />
        </div>
      ))}
    </div>
  );
};

export default CodeArea;
