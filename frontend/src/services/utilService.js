export const utilService = {
    makeId,
    executeScroll,
    getRandomInteger
}

function makeId(length = 8) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function executeScroll(scrollTo) {
    const el = this.ref.current;
    let scrollDiff = el.scrollWidth - el.offsetWidth;

    if (el.scrollLeft >= scrollDiff) {
        el.scrollLeft = 0;
        this.setState({ isScrolled: false });
    }
    else if (el.scrollLeft < scrollDiff) {
        el.scrollLeft += scrollTo;
        this.setState({ isScrolled: true });
    }
}

function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}