// отправка запроса
function submitData() {
    let xmlHttpObj = window.XMLHttpRequest ? new XMLHttpRequest() : false; // создание объекта XHR
    if (xmlHttpObj) {
        xmlHttpObj.open('POST', '/upload');
        // добавление заголовка в запрос
        xmlHttpObj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // обработчик изменения состояния запроса
        xmlHttpObj.onreadystatechange = function () {
            if (xmlHttpObj.readyState == 4 && xmlHttpObj.status == 200){
                alert(xmlHttpObj.responseText);
            }
        };

        xmlHttpObj.send(`name=${document.data.name.value}&mail=${document.data.mail.value}&text=${document.data.text.value}`);
    }
}

window.onload = function () {
    // обработчик отправки формы
    document.data.onsubmit = submitData;
    //
    window.addEventListener("scroll", throttleScroll, false);
    // Обёртка для обработчика события прокрутки страницы. Частота вызова обработчика зависит от частоты обновления кадров страницы.
    var isScrolling = false;
    function throttleScroll(e) {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
              scrolling(e);
              isScrolling = true;
            });
        }

        isScrolling = false;
    }
    var images = document.querySelectorAll('.img-front');
    //
    function scrolling(e) {
        for (let image of images) {
            if (isElemVisible(image)) {
                image.style.top = '211px';
            } else {
                image.style.top = '241px';
            }
        }
    }

    function isElemVisible(element, isPartially = false) {
        var elementBoundary = element.getBoundingClientRect();

        var top = elementBoundary.top;
        var bottom = elementBoundary.bottom;
        var height = isPartially ? elementBoundary.height : 0;

        return ((-height <= top) && (bottom <= height + window.innerHeight));
    }
}