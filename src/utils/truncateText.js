/**
 @param {string} text @param {number} maxLength @returns {string}
 */
const truncateText = (text, maxLength = 65) => {
  if (!text || text.trim() === "") return "بدون توضیحات";
  const cleanText = text.trim();
  return cleanText.length <= maxLength
    ? cleanText
    : cleanText.slice(0, maxLength).trim() + "...";
};

export default truncateText;
