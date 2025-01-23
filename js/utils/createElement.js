const createElement = (tag, className, textContent) => {
  const element = document.createElement(tag);
  if (className) element.classList.add(className);
  if (textContent) element.textContent = textContent;
  return element;
};

export default createElement;
