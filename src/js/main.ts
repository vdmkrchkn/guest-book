interface FeedbackComment {
  name: string;
  mail: string;
  text: string;
}

// отправка запроса
function submitData(data: Event) {
  data.preventDefault();

  const comment: FeedbackComment = {
    name: '', // FIXME: data.currentTarget[0]
    mail: '',
    text: '',
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

window.onload = function() {
  // обработчик отправки формы
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
        scrolling(event);
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
  function scrolling(e: Event) {
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
