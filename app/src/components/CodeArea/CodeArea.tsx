import ContentEditable from "./ContentEditable";
import "./CodeArea.css";

interface ICodeAreaProps {
  lines: string[];
  onChange: (e: React.FormEvent<HTMLDivElement>, index: number) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void;
}

const CodeArea = ({ lines, onChange, onKeyDown }: ICodeAreaProps) => {
  return (
    <div className="code-area">
      {lines.map((line, index) => (
        <div key={index} className="line-container">
          <div className="line-number">{index + 1}</div>
          <ContentEditable
            html={line}
            className="line-content"
            onChange={(e) => onChange(e, index)}
            onKeyDown={(e) => onKeyDown(e, index)}
          />
        </div>
      ))}
    </div>
  );
};

export default CodeArea;
