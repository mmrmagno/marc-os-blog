import React, { useState } from 'react';
import '../styles/ImageUpload.css';

const ImageUpload = ({ onImageUpload, onImageDelete, images = [] }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onImageUpload(data.images);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/posts/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      onImageDelete(imageId);
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image. Please try again.');
    }
  };

  return (
    <div className="image-upload-container">
      <div
        className={`image-upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="file-input"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="upload-label">
          {uploading ? (
            <div className="uploading">
              <div className="spinner"></div>
              <span>Uploading...</span>
            </div>
          ) : (
            <>
              <i className="fas fa-cloud-upload-alt"></i>
              <span>Drag and drop images here or click to select</span>
            </>
          )}
        </label>
      </div>

      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((image) => (
            <div key={image._id} className="image-preview">
              <img src={image.url} alt={image.alt} />
              <div className="image-overlay">
                <button
                  className="delete-button"
                  onClick={() => handleDelete(image._id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
                <input
                  type="text"
                  placeholder="Image caption"
                  value={image.caption}
                  onChange={(e) => {
                    const updatedImages = images.map(img =>
                      img._id === image._id
                        ? { ...img, caption: e.target.value }
                        : img
                    );
                    onImageUpload(updatedImages);
                  }}
                  className="caption-input"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 