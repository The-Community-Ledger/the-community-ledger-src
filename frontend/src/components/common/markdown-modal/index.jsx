import React, { useState, useEffect } from 'react';

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";


const modalBackdropStyle = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(255, 255, 255, 0.89)',
  top: '100px',
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalContentStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  width: '100%',
  padding: '24px',
};

const titleStyle = {
  fontSize: '20px',
  fontWeight: '600',
  marginBottom: '16px',
};

const buttonRowStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '24px',
  gap: '12px',
};

const buttonStyle = {
  padding: '8px 16px',
  borderRadius: '6px',
  fontWeight: '500',
  border: 'none',
  cursor: 'pointer',
};

const closeButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#e2e8f0',
  color: '#000',
};

const submitButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#2563eb',
  color: '#fff',
};

const errorSubmitButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#ef4444',
  color: '#fff',
};

const submittedButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#4ade80',
  color: '#fff',
};

const MarkdownModal = ({
  isOpen,
  isLoading, 
  isSubmitted,
  error, 
  onClose,
  onSubmit,
  title = "Write something",
  initialValue = "",
  children,
}) => {
  const [markdown, setMarkdown] = useState(initialValue);

  useEffect(() => {
    setMarkdown(initialValue);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  return (
    <div style={modalBackdropStyle}>
      <div style={{
            ...modalContentStyle,
            ...(children ? {} : { maxWidth: '800px' }),
        }}>
        <h2 style={titleStyle}>{title}</h2>

        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'stretch',
            // padding: '0 20px',
        }}> 
            {children && <div style={{ marginBottom: '16px', maxWidth: '50vw'}}>{children}</div>}
            <div>
                <MDEditor value={markdown} onChange={setMarkdown} height={'600px'} previewOptions={{rehypePlugins: [[rehypeSanitize]],}} />
                <div style={buttonRowStyle}>
                <button style={closeButtonStyle} onClick={onClose} disabled={isLoading}>
                    Close
                </button>
                {!isSubmitted &&
                    <button style={submitButtonStyle} onClick={() => onSubmit(markdown)} disabled={isLoading || isSubmitted}>
                        Submit
                    </button>}
                    {isSubmitted &&
                    <button style={submittedButtonStyle} disabled>
                        Submitted
                    </button>}
                {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
                </div>
            </div>
      </div>
      </div>
    </div>
  );
};

export default MarkdownModal;