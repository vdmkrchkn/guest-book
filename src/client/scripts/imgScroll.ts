let isScrolling = false;
/** Обёртка для обработчика события прокрутки страницы.
  * Частота вызова обработчика зависит от частоты обновления кадров страницы.
  * @param {Event} event - scroll event.
*/
export function throttleScroll(event: Event) {
  if (!isScrolling) {
    window.requestAnimationFrame(function() {
      scrollEventHandler(event);
      isScrolling = true;
    });
  }

  isScrolling = false;
}
/**
  * Обработчик события прокрутки страницы.
  * @param {Event} e - scroll event.
*/
function scrollEventHandler(e: Event) {
  const images = document.querySelectorAll('.img-front');

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
