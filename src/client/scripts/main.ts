import {addHttpComment, addHtmlComment} from './addComment';
// eslint-disable-next-line no-unused-vars
import {IFeedbackCommentResponse} from './comment';
import {throttleScroll} from './imgScroll';

window.onload = function() {
  const form = document.getElementById('data');
  form?.addEventListener('submit', addHttpComment);

  const commentContainer = document.getElementById('comments');
  if (commentContainer) {
    fetch('/show')
        .then(response => response.json())
        .then((comments: Array<IFeedbackCommentResponse>) =>
          comments.forEach(comment => commentContainer.append(addHtmlComment(comment))))
        .catch(error => alert(error));

    new (Subscriber as any)('/subscribe', commentContainer);
  }

  window.addEventListener('scroll', throttleScroll, false);
  const addCommentBtn = document.querySelector('button[name=\'addComment\']');
  addCommentBtn.addEventListener('click', () => {
    (form.parentNode as HTMLElement).className = 'row-centered';
  });
};

/**
  * @param {string} url адрес для вызова долгих опросов,
  * @param {HTMLElement} elem DOM узел, куда добавлять запись.
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
      elem.append(addHtmlComment(comment));
      await subscribe();
    }
  }

  subscribe();
}
