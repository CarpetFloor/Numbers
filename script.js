let c, r, w, h;

window.onload = function() {
    c = document.querySelector("canvas");
    r = c.getContext("2d");

    c.width = window.innerWidth - 20;
    c.height = window.innerHeight - 20;

    w = c.width;
    h = c.height;
}