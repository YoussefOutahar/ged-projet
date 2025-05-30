import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';

type Props = {
  fileUrl: string | undefined;
  documentBlob: Blob | undefined;
};

const WordViewer = ({ fileUrl, documentBlob }: Props) => {
  const [documentContent, setDocumentContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleWordDocument = async (blob: Blob) => {
    setLoading(true);
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setDocumentContent(result.value);
    } catch (error) {
      console.error('Error converting document:', error);
      setDocumentContent('<p>Error loading document</p>');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (documentBlob) {
      handleWordDocument(documentBlob);
    } else if (fileUrl) {
      fetch(fileUrl)
        .then((response) => response.blob())
        .then((blob) => handleWordDocument(blob))
        .catch((error) => {
          console.error('Error fetching document:', error);
          setDocumentContent('<p>Error loading document</p>');
        });
    }

  }, [documentBlob, fileUrl]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        maxWidth: '1000px',
        maxHeight: '1000px',
        overflow: 'auto',
        padding: '20px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
      }}
      dangerouslySetInnerHTML={{ __html: documentContent }}
    />
  );
};

export default WordViewer;
