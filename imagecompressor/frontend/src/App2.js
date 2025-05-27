import React, { useState } from 'react';
import axios from 'axios';

function App1() {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post('http://localhost:5000/api/images/upload', formData, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'compressed.png');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Image Compressor</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload & Compress</button>
      </form>
    </div>
  );
}

export default App1;
