import React, { useState } from "react";
import "./element.css";

const MultipleImageFileInput = ({
  elementName,
  elementLabel,
  elementId,
  elementValue,
  setElementValue,
  onChangeHandler,
}) => {
  const [dragIndex, setDragIndex] = useState(null);

  const onDragStart = (index) => {
    setDragIndex(index);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (dropIndex) => {
    if (dragIndex === null) return;
    const updatedImages = [...elementValue];
    const draggedItem = updatedImages.splice(dragIndex, 1)[0];
    updatedImages.splice(dropIndex, 0, draggedItem);
    setElementValue(updatedImages);
    setDragIndex(null);
  };

  return (
    <div className="file_input_main_container">
      <label className="element_input_label" htmlFor={elementId}>
        {elementLabel}
      </label>
      <div className="image-uploader">
        {/* First Image */}
        {elementValue.length > 0 && (
          <div className="first-image-row">
            <img
              src={elementValue[0].preview}
              alt="Main Preview"
              className="main-image"
              draggable
              onDragStart={() => onDragStart(0)}
              onDragOver={onDragOver}
              onDrop={() => onDrop(0)}
            />
          </div>
        )}

        {/* Remaining Images */}
        <div className="other-images-grid">
          {elementValue.slice(1).map((img, index) => (
            <img
              key={index + 1}
              src={img.preview}
              alt={`Preview ${index + 1}`}
              className="other-image"
              draggable
              onDragStart={() => onDragStart(index + 1)} // +1 because we sliced
              onDragOver={onDragOver}
              onDrop={() => onDrop(index + 1)} // +1 to match full array index
            />
          ))}

          {/* "+" Icon to add more images */}
          <label className="add-btn" htmlFor="fileInput">
            +
          </label>
          <input
            type="file"
            id="fileInput"
            className="hidden-input"
            multiple
            accept="image/*"
            onChange={onChangeHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default MultipleImageFileInput;
