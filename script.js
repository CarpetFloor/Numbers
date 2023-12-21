let c, r, w, h;

let numbers = [];
const multOptions = [1, 2, 10];
let mults = [];
let total = 0;
let current = 0;

window.onload = function() {
    c = document.querySelector("canvas");
    r = c.getContext("2d");

    c.width = window.innerWidth - 20;
    c.height = window.innerHeight - 20;

    w = c.width;
    h = c.height;

    init();
    loop();
}

function init() {
    numbers = [];
    mults = [];
    total = 0;
    current = 0;

    // generate numbers and multipliers
    for(let i = 0; i < 3; i++) {
        numbers.push(Math.floor(Math.random() * (9 - 1) + 1));
        mults.push(multOptions[Math.floor(Math.random() * multOptions.length)]);
    }

    // calculate
    for(let i = 0; i < numbers.length; i++) {
        total += numbers[i] * mults[i];

        console.log(numbers[i], "----", mults[i]);
    }
}