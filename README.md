# guest-book
`NodeJS` реализация гостевой книги.

Доступные адреса:
* / - главная страница с формой добавления комментария;
* /show - страница для отображения комментариев;

Настройки приложения располагаются в `src/config/config.json`. При первом запуске приложения необходимо вручную создать директорию с названием **logs**.

Для хранения комментариев используется `noSql` база данных `mongo`. Инструкция по [установке](https://docs.mongodb.com/manual/installation/) и [запуску](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#start-your-mongodb-database). 
