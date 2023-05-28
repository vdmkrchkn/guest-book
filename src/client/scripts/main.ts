// eslint-disable-next-line no-unused-vars
import {addComment, IFeedbackComment} from './addComment';
import {throttleScroll} from './imgScroll';

window.onload = function() {
  const form = document.getElementById('data');
  form?.addEventListener('submit', addComment);

  const commentContainer = document.getElementById('comments');
  if (commentContainer) {
    fetch('/show')
        .then(response => response.json())
        .then((comments: Array<IFeedbackComment>) =>
          comments.forEach(comment => commentContainer.append(getCommentElement(comment))))
        .catch(error => alert(error));

    new (Subscriber as any)('/subscribe', commentContainer);
  }

  window.addEventListener('scroll', throttleScroll, false);
};

// eslint-disable-next-line require-jsdoc
function getCommentElement(comment: any) {
  const containerElem = document.createElement('tr');
  for (const key in comment) {
    if (Object.prototype.hasOwnProperty.call(comment, key)) {
      const dataElem = document.createElement('td');
      dataElem.append(comment[key]);
      containerElem.append(dataElem);
    }
  }

  return containerElem;
}

/**
  * @param {url} url - адрес для вызова долгих опросов,
  * @param {elem} elem - элемент DOM, куда добавлять новую запись.
*/
function Subscriber(url: string, elem: HTMLElement) {
  // eslint-disable-next-line require-jsdoc
  async function subscribe() {
    const response = await fetch(url);

    if (response.status == 502) {
      // Таймаут подключения
      // случается, когда соединение ждало слишком долго.
      // давайте восстановим связь
      await subscribe();
    } else if (response.status != 200) {
      // Показать ошибку
      alert(response.statusText);
      // Подключиться снова через секунду.
      await new Promise(resolve => setTimeout(resolve, 1000));
      await subscribe();
    } else {
      const comment = await response.json();
      elem.append(getCommentElement(comment));
      await subscribe();
    }
  }

  subscribe();
}
