import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaCopy } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface CodeBoxProps {
  code: { [key: string]: string };
}

const CodeBox: React.FC<CodeBoxProps> = ({ code }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [selectedType, setSelectedType] = useState(Object.keys(code)[0]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "c") {
        handleCopy();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); 

  const handleCopy = async () => {
    const codeContent = code[selectedType];
    if (codeContent) {
      try {
        await navigator.clipboard.writeText(codeContent);
        toast.success("Copied to clipboard", {
          position: "bottom-center",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 500);
      } catch (err) {
        toast.error("Failed to copy!", {
          position: "bottom-center",
          autoClose: 500,
        });
      }
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  return (
    <div className="relative w-fit max-w-full bg-gray-800 text-white rounded-lg shadow-lg p-4 mb-10">
      <ToastContainer />

      <div className="flex justify-start mb-2">
        {Object.keys(code).map((type, index) => (
          <button
            key={index}
            className={`mx-1 px-3 py-1 rounded hover:bg-gray-600 ${
              type === selectedType ? "bg-gray-600" : "bg-gray-800"
            }`}
            onClick={() => handleTypeChange(type)}
          >
            {type.toUpperCase()}
          </button>
        ))}
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 bg-gray-800 text-white text-lg p-3 rounded-sm hover:bg-gray-600 ${
            isCopied ? "opacity-50" : ""
          }`}
          title="Copy Code"
        >
          <FaCopy />
        </button>
      </div>

      <SyntaxHighlighter
        language={
          selectedType === "cpp" ? "cpp" : selectedType === "java" ? "java" : "python"
        }
        style={nightOwl}
        showLineNumbers
        className="overflow-auto rounded-md"
      >
        {code[selectedType]}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBox;
