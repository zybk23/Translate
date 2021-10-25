import React from "react";

const History = ({ historyTexts, handleDeleteSelectedText }) => {
  return (
    <div className="history-cart-container">
      {historyTexts.length > 0 &&
        historyTexts.slice(Math.max(historyTexts.length - 3, 0)).map((item) => (
          <div key={item.id} className="history">
            <p className="history-input-text">{item.input}</p>
            <br />
            <p className="history-output-text">{item.output}</p>
            <i
              onClick={() => handleDeleteSelectedText(item.id)}
              className="fas fa-times text-area-delete-button "
            />
          </div>
        ))}
    </div>
  );
};

export default History;
