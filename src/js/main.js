/** отправка запроса */
function submitData() {
  const xmlHttpObj = window.XMLHttpRequest ? new XMLHttpRequest() : false; // создание объекта XHR
  if (xmlHttpObj) {
    xmlHttpObj.open('POST', '/upload');
    // добавление заголовка в запрос
    xmlHttpObj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // обработчик изменения состояния запроса
    xmlHttpObj.onreadystatechange = function() {
      if (xmlHttpObj.readyState == 4 && xmlHttpObj.status == 200) {
        alert(xmlHttpObj.responseText);
      }
    };
    // eslint-disable-next-line max-len
    xmlHttpObj.send(`name=${document.data.name.value}&mail=${document.data.mail.value}&text=${document.data.text.value}`);
  }
}

window.onload = function() {
  // обработчик отправки формы
  document.data.onsubmit = submitData;
  //
  window.addEventListener('scroll', throttleScroll, false);
  let isScrolling = false;
  /** Обёртка для обработчика события прокрутки страницы.
   * Частота вызова обработчика зависит от частоты обновления кадров страницы.
   * @param {any} e - srcoll event.
   */
  function throttleScroll(e) {
    if (!isScrolling) {
      window.requestAnimationFrame(function() {
        scrolling(e);
        isScrolling = true;
      });
    }

    isScrolling = false;
  }
  const images = document.querySelectorAll('.img-front');
  /**
   * Обработчик события прокрутки страницы.
   * @param {any} e - srcoll event.
   */
  function scrolling(e) {
    for (const image of images) {
      if (isElemVisible(image)) {
        image.style.top = '211px';
      } else {
        image.style.top = '241px';
      }
    }
  }
  /**
   * Определение признака видимости элемента на экране.
   * @param {any} element - элемент, для которого определяется видимость.
   * @param {boolean} isPartially - признак частичной видимости.
   * @return {boolean} признак видимости.
   */
  function isElemVisible(element, isPartially = false) {
    const elementBoundary = element.getBoundingClientRect();

    const top = elementBoundary.top;
    const bottom = elementBoundary.bottom;
    const height = isPartially ? elementBoundary.height : 0;

    return ((-height <= top) && (bottom <= height + window.innerHeight));
  }
};
