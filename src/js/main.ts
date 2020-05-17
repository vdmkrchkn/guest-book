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

  const promise = function(url: string) {
    return new Promise((resolve, reject) => {
      const xhr = window.XMLHttpRequest ? new XMLHttpRequest() : false;
      if (xhr) {
        xhr.open('POST', url);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.timeout = 10000;
        // обработчик полученного ответа от запроса
        xhr.onload = function() {
          if (this.status == 200) {
            resolve(this.response);
          } else {
            const error = new Error(this.statusText);
            // TODO: create http error
            // error.code = this.status;
            reject(error);
          }
        };
        // обработчик ситуации, когда запрос не получилось выполнить
        xhr.onerror = function() {
          reject(new Error('Ошибка соединения.'));
        };
        xhr.ontimeout = function() {
          reject(new Error('Ошибка: время ожидания ответа вышло.'));
        };
        // eslint-disable-next-line max-len
        xhr.send(`name=${comment.name}&mail=${comment.mail}&text=${comment.text}`);
      } else {
        reject(new TypeError('XMLHttpRequest не существует в области видимости window.'));
      }
    });
  };

  promise('/upload')
      .then(response => alert(response))
      .catch(error => console.error(error.message));
}
