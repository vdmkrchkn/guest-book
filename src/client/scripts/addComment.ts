interface FeedbackComment {
  name: string;
  mail: string;
  text: string;
}

// eslint-disable-next-line require-jsdoc
export async function addComment(event: Event) {
  event.preventDefault();
  const formElements = (event.currentTarget as HTMLFormElement).elements;

  const comment: FeedbackComment = {
    name: (formElements.namedItem('name') as HTMLInputElement).value,
    mail: (formElements.namedItem('mail') as HTMLInputElement).value,
    text: (formElements.namedItem('text') as HTMLTextAreaElement).value,
  };

  const controller = new AbortController();
  setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: JSON.stringify(comment),
      signal: controller.signal,
    });

    if (response.ok) {
      const comment = await response.json();
      alert(`Комментарий отправлен в ${comment.dt}`);
    } else {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
  } catch (error) {
    alert(error.message);
  }
}
