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

    subscribe('/subscribe', commentContainer);
  }

  window.addEventListener('scroll', throttleScroll, false);

  const addCommentBtn = document.querySelector('button[name=\'addComment\']');
  addCommentBtn.addEventListener('click', () => {
    (form.parentNode as HTMLElement).className = 'row-centered';
  });

  const draggableImage = document.getElementById('draggable');
  draggableImage.ondragstart = () => false;

  draggableImage.onmousedown = function(event: MouseEvent) {
    const shiftX = event.clientX - draggableImage.getBoundingClientRect().left;
    const shiftY = event.clientY - draggableImage.getBoundingClientRect().top;

    draggableImage.style.zIndex = '1000';
    // draggableImage.style.position = 'absolute';
    document.body.append(draggableImage);

    moveAt(event.pageX, event.pageY);

    /** передвинуть объект перемещения под координаты курсора
      * и сдвинуть на половину ширины/высоты для центрирования
      * @param {number} pageX
      * @param {number} pageY
    */
    function moveAt(pageX: number, pageY: number) {
      draggableImage.style.left = pageX - shiftX + 'px';
      draggableImage.style.top = pageY - shiftY + 'px';
    }

    let currentDroppable: HTMLElement = null;
    /**
     * @param {MouseEvent} event
     */
    function onMouseMove(event: MouseEvent) {
      moveAt(event.pageX, event.pageY);

      draggableImage.hidden = true;
      const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
      draggableImage.hidden = false;
      if (!elemBelow) {
        return;
      }

      const droppableBelow = elemBelow.closest('.img-front');

      if (currentDroppable != droppableBelow) {
        if (currentDroppable) { // null если мы были не над droppable до этого события
          // (например, над пустым пространством)
          leaveDroppable(currentDroppable);
        }
        currentDroppable = droppableBelow as HTMLElement;
        if (currentDroppable) { // null если мы не над droppable сейчас, во время этого события
          // (например, только что покинули droppable)
          enterDroppable(currentDroppable);
        }
      }

      // eslint-disable-next-line require-jsdoc
      function enterDroppable(elem: HTMLElement) {
        elem.style.background = 'pink';
      }

      // eslint-disable-next-line require-jsdoc
      function leaveDroppable(elem: HTMLElement) {
        elem.style.background = '';
      }
    }

    // перемещать по экрану
    document.addEventListener('mousemove', onMouseMove);

    // оставить объект перемещения, удалить более ненужные обработчики событий
    draggableImage.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      draggableImage.onmouseup = null;
    };
  };
};

/**
  * @param {string} url адрес для вызова долгих опросов,
  * @param {HTMLElement} elem DOM узел, куда добавлять запись.
*/
function subscribe(url: string, elem: HTMLElement) {
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
