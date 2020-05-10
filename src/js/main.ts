interface FeedbackComment {
  name: string;
  mail: string;
  text: string;
}

window.onload = function() {
  const form = document.getElementById('data');
  if (form) form.onsubmit = submitData;
  //
  window.addEventListener('scroll', throttleScroll, false);
  let isScrolling = false;
  /** Обёртка для обработчика события прокрутки страницы.
     * Частота вызова обработчика зависит от частоты обновления кадров страницы.
     * @param {Event} event - scroll event.
     */
  function throttleScroll(event: Event) {
    if (!isScrolling) {
      window.requestAnimationFrame(function() {
        scrollEventHandler(event);
        isScrolling = true;
      });
    }

    isScrolling = false;
  }
  const images = document.querySelectorAll('.img-front');
  /**
     * Обработчик события прокрутки страницы.
     * @param {Event} e - scroll event.
     */
  function scrollEventHandler(e: Event) {
    images.forEach(image => {
      if (isElemVisible(image)) {
        (image as HTMLElement).style.top = '211px';
      } else {
        (image as HTMLElement).style.top = '241px';
      }
    });
  }
  /**
     * Определение признака видимости элемента на экране.
     * @param {Element} element - элемент, для которого определяется видимость.
     * @param {boolean} isPartially - признак частичной видимости.
     * @return {boolean} признак видимости.
     */
  function isElemVisible(element: Element, isPartially: boolean = false): boolean {
    const elementBoundary = element.getBoundingClientRect();

    const top = elementBoundary.top;
    const bottom = elementBoundary.bottom;
    const height = isPartially ? elementBoundary.height : 0;

    return ((-height <= top) && (bottom <= height + window.innerHeight));
  }
};

// eslint-disable-next-line require-jsdoc
function submitData(event: Event) {
  event.preventDefault();
  const formElements = (event.currentTarget as HTMLFormElement).elements;

  const comment: FeedbackComment = {
    name: (formElements.namedItem('name') as HTMLInputElement).value,
    mail: (formElements.namedItem('mail') as HTMLInputElement).value,
    text: (formElements.namedItem('text') as HTMLTextAreaElement).value,
  };

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
    xmlHttpObj.send(`name=${comment.name}&mail=${comment.mail}&text=${comment.text}`);
  }
}
