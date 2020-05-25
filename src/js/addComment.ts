interface FeedbackComment {
  name: string;
  mail: string;
  text: string;
}

// eslint-disable-next-line require-jsdoc
export function addComment(event: Event) {
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
