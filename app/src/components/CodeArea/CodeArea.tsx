import { useState } from "react";
import ContentEditable from "./ContentEditable";
import useEditorContext from "../../hooks/useEditorContext";
import "./CodeArea.css";

const CodeArea = () => {
  const { lines, handleLineChange, handleLineEnter } = useEditorContext();

  const [selection, setSelection] = useState<{
    start: number | null;
    end: number | null;
  }>({ start: null, end: null });

  const handleMouseDown = (index: number) => {
    setSelection({ start: index, end: index });
  };

  const handleMouseMove = (index: number) => {
    if (selection.start !== null) {
      setSelection({ start: selection.start, end: index });
    }
  };

  const handleMouseUp = () => {
    if (
      selection.start !== null &&
      selection.end !== null &&
      selection.start !== selection.end
    ) {
      // The start and end index of the selection
      const start = Math.min(selection.start, selection.end);
      const end = Math.max(selection.start, selection.end) + 1;

      // Copy the lines between start and end indices
      navigator.clipboard.writeText(lines.slice(start, end).join("\n"));
    }
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
            className="line-content"
            onChange={(e) => handleLineChange(e, index)}
            onKeyDown={(e) => handleLineEnter(e, index)}
          />
        </div>
      ))}
    </div>
  );
};

export default CodeArea;
