window.addEventListener('load', function () {
    (function () {
        let today = new Date;
        document.querySelector('#today_date').innerHTML += today.toLocaleString('en', { weekday: 'long' })
        + '<br />' + today.toLocaleString('en', {day: 'numeric', month: 'long', year: 'numeric'});
    })();
});