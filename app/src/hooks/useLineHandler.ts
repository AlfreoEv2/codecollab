import { useState } from "react";

type UseLineHandlers = [
  string[],
  (e: React.FormEvent<HTMLDivElement>, index: number) => void,
  (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void
];

export default function useLineHandlers(
  initialLines: string[]
): UseLineHandlers {
  const [lines, setLines] = useState(initialLines);

  const handleLineChange = (
    e: React.FormEvent<HTMLDivElement>,
    index: number
  ) => {
    const newLines = [...lines];

    if (e.currentTarget.innerHTML.includes("<div>")) {
      console.log(e.currentTarget.innerHTML);
      // Split the content by divs and remove the div tags
      const splitContent = e.currentTarget.innerHTML
        .split("<div>")
        .map((line) => line.replace("</div>", ""));

      // Remove the first div
      splitContent.shift();

      // Update the current line with the first line
      newLines[index] += splitContent.shift();

      newLines.splice(index + 1, 0, ...splitContent);
    } else {
      newLines[index] = e.currentTarget.innerHTML;
    }

    setLines(newLines);
  };

  const handleLineEnter = (
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

  return [lines, handleLineChange, handleLineEnter];
}
