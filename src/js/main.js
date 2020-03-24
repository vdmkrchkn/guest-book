// отправка запроса
function submitData() {
    var xmlHttpObj = window.XMLHttpRequest ? new XMLHttpRequest() : false; // создание объекта XHR
    if (!xmlHttpObj)
        return;
    xmlHttpObj.open('POST', '/upload');
    // добавление заголовка в запрос
    xmlHttpObj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // обработчик изменения состояния запроса
    xmlHttpObj.onreadystatechange = function () {
        if (xmlHttpObj.readyState == 4 && xmlHttpObj.status == 200){
            alert(xmlHttpObj.responseText);
        }
    };
    xmlHttpObj.send('name=' + document.data.name.value +
     '&mail=' +  document.data.mail.value +
     '&text=' + document.data.text.value
    );
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
    var images = [document.querySelector('#img-front'), document.querySelector('#img-front_2')];
    //
    function scrolling(e) {
        for (let i = 0; i < images.length; ++i) {
            const image = images[i];

            if (isPartiallyVisible(image)) {
                image.classList.add("active");
            } else {
                image.classList.remove("active");
            }
        }
    }

    function isPartiallyVisible(element) {
        var elementBoundary = element.getBoundingClientRect();

        var top = elementBoundary.top;
        var bottom = elementBoundary.bottom;
        var height = elementBoundary.height;

        return ((top + height >= 0) && (height + window.innerHeight >= bottom));
    }
}