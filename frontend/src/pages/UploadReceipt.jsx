// frontend/src/pages/UploadReceipt.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function UploadReceipt() {
  const { id } = useParams(); // Expense ID from URL (e.g., /upload-receipt/expenseId)
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("No file selected");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('receipt', file); // "receipt" must match the field name in Multer

      const response = await axios.post(
        `http://localhost:5000/api/expenses/${id}/receipt`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Upload response:', response.data);
      alert('Receipt uploaded successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error uploading receipt:', error);
      alert('Failed to upload receipt');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Upload Receipt</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" style={{ marginTop: '1rem' }}>Upload</button>
      </form>
    </div>
  );
}

export default UploadReceipt;
