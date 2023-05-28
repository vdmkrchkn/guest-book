export interface IFeedbackComment {
  name: string;
  mail: string;
  text: string;
  dt?: Date;
}

interface IValidator {
  isValid(): boolean;
}

/** Класс, реализующий проверку полей на непустоту. */
class FeedbackCommentNotEmpty implements IFeedbackComment, IValidator {
  name: string;
  mail: string;
  text: string;
  dt?: Date;

  // eslint-disable-next-line require-jsdoc
  constructor({name, mail, text}: IFeedbackComment) {
    this.name = name;
    this.mail = mail;
    this.text = text;
  }

  // eslint-disable-next-line require-jsdoc
  isValid = function() {
    // eslint-disable-next-line no-invalid-this
    return this.name && this.mail && this.text;
  }
}

/** Добавить комментарий
 * @this form
 * @param {Event} event
*/
export async function addComment(event: Event) {
  event.preventDefault();

  const comment: IFeedbackComment = {
    name: (this.elements.namedItem('name') as HTMLInputElement).value,
    mail: (this.elements.namedItem('mail') as HTMLInputElement).value,
    text: (this.elements.namedItem('text') as HTMLTextAreaElement).value,
  };

  if (new FeedbackCommentNotEmpty(comment).isValid()) {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: JSON.stringify(comment),
        signal: controller.signal,
      });

      if (response.ok) {
        const comment: IFeedbackComment = await response.json();
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
