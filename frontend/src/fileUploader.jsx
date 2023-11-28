import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ onUpload }) => {
    const onDrop = useCallback(async (acceptedFiles) => {
        try {
            const formData = new FormData();

            formData.append('pdf', acceptedFiles[0]);

            const response = await fetch('http://localhost:8080/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('Response from server:', responseData);
                onUpload(acceptedFiles);
            } else {
                console.error('Failed to upload files');
            }
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div>
            <div {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} />
                <p>{isDragActive ? 'Drop the files here ...' : 'Drag & drop PDF here, or click to select files'}</p>
            </div>
            <button onClick={() => document.querySelector('input').click()}>Upload PDF</button>
        </div>
    );
};

const dropzoneStyle = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
};

export default FileUploader;
