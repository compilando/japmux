import React from "react";

interface ChatGPTTextAreaProps {
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  className?: string;
  fontSize?: string;
}

const ChatGPTTextArea: React.FC<ChatGPTTextAreaProps> = ({
  id,
  value = "",
  onChange,
  placeholder = "Escribe tu mensaje aquí...",
  rows = 4,
  readOnly = false,
  className = "",
  fontSize = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <textarea
      id={id}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      rows={rows}
      readOnly={readOnly}
      className={`font-mono ${fontSize} w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export default ChatGPTTextArea; 