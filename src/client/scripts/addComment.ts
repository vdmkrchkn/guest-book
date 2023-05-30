/* eslint-disable no-unused-vars */
import {
  IFeedbackComment,
  IFeedbackCommentResponse,
  isCommentValid,
} from './comment';


/** Отправить команду на добавление комментария на сервере.
 * @this form
 * @param {Event} event
*/
export async function addHttpComment(event: Event) {
  event.preventDefault();

  const comment: IFeedbackComment = {
    name: (this.elements.namedItem('name') as HTMLInputElement).value,
    mail: (this.elements.namedItem('mail') as HTMLInputElement).value,
    text: (this.elements.namedItem('text') as HTMLTextAreaElement).value,
  };

  if (isCommentValid(comment)) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: JSON.stringify(comment),
        signal: controller.signal,
      });

      if (response.ok) {
        const comment: IFeedbackCommentResponse = await response.json();
        this.reset();
        alert(`Комментарий отправлен в ${comment.dt}`);
      } else {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
    } catch (error) {
      alert(error.message);
    }
  }
}

/**
 * Добавить комментарий на клиенте.
 * @param {IFeedbackCommentResponse} comment комментарий,
 * @return {HTMLTableRowElement} узел HTML.
 */
export function addHtmlComment(comment: IFeedbackCommentResponse): HTMLTableRowElement {
  const containerElem = document.createElement('tr');
  Object.keys(comment).forEach(key => {
    const dataElem = document.createElement('td');
    dataElem.append(comment[key]);
    containerElem.append(dataElem);
  });

  return containerElem;
}
