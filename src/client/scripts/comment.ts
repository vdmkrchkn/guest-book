export interface IFeedbackComment {
  name: string;
  mail: string;
  text: string;
}

interface KeyValue {
  [key: string]: string;
}

export interface IFeedbackCommentResponse extends IFeedbackComment, KeyValue {
  dt: string;
}

/** Проверка данных о комментарии.
 * @param {IFeedbackComment} comment комментарий,
 * @return {boolean} `true`, если комментарий соответствует правилам валидации, иначе `false`.
 */
export function isCommentValid({name, mail, text}: IFeedbackComment): boolean {
  return name.trim() !== '' &&
      mail.trim() !== '' &&
      text.trim() !== '';
};
