import {addComment} from './addComment';
import {throttleScroll} from './imgScroll';

window.onload = function() {
  const form = document.getElementById('data');
  if (form) form.onsubmit = addComment;

  window.addEventListener('scroll', throttleScroll, false);
};
