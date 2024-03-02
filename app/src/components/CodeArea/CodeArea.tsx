import "./CodeArea.css";

interface ICodeAreaProps {
  lines: string[];
}

const CodeArea = ({ lines }: ICodeAreaProps) => {
  return (
    <div className="code-area">
      {lines.map((line, index) => (
        <div key={index} className="line-container">
          <div className="line-number">{index + 1}</div>
          <div contentEditable={true} className="line-content">
            {line}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CodeArea;
