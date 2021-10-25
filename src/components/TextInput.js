import React from "react";

const TextInput = ({
  isShowButtons,
  value,
  onChange,
  handleTranslateText,
  handleClickMicButton,
  showDeleteButton,
  handleDeleteAllText,
}) => {
  return (
    <div className="text-area">
      <textarea
        value={value}
        onChange={onChange}
        className="text-area-input"
        name=""
        id=""
        cols="30"
        rows="10"
      />
      {isShowButtons && (
        <div className="text-area-buttons">
          <span onClick={handleClickMicButton} className="text-area-mic">
            🎙️
          </span>
          <button
            onClick={handleTranslateText}
            className="text-area-translate-button"
          >
            Translate
          </button>
        </div>
      )}
      {showDeleteButton && value.length > 0 && (
        <i
          onClick={handleDeleteAllText}
          className="fas fa-times text-area-delete-button "
        />
      )}
    </div>
  );
};

export default TextInput;
