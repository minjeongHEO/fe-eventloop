const INPUT_TITLE = "코드 입력";
const INPUT_PLACEHOLDER = "여기에 비동기 콜백이 포함된 코드를 입력하세요.";
const INPUT_SUBMIT = "동작시키기";

const renderContainer = (className, content = '') => {
  return `<div class="${className}__container">${content}</div>`;
};

const renderInputView = (className) => {
  const content = `
    <label class="${className}__title" for="code-block">${INPUT_TITLE}</label>
    <input class="${className}__text-input" type="text" name="code-block" placeholder="${INPUT_PLACEHOLDER}">
    <input class="${className}__submit" type="submit" value="${INPUT_SUBMIT}">
  `;

  return renderContainer(className, content);
};