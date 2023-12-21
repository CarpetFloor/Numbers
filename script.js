// make sure to add time limit, and make it changeable

let c, r, w, h;

const margins = {
    // for target and results
    middleVert: 20, 
    // for nums and mults
    leftRightVert: 75, 
    side: 30
}

const segSize = 10;
const segment = {
    width: segSize * 3, 
    height: segSize * 5, 
    thick: Math.ceil(segSize * 0.9), 
    borderMarginSide: 20, 
    borderMarginVert: 30, 
    borderThick: 1
}

const numToSegment = [
    // starting from top, goes clock-wise, 
    // then center
//  a  b  c  d  e  f  g
    [1, 1, 1, 1, 1, 1, 0], 
    [0, 1, 1, 0, 0, 0, 0], 
    [1, 1, 0, 1, 1, 0, 1], 
    [1, 1, 1, 1, 0, 0, 1], 
    [0, 1, 1, 0, 0, 1, 1], 
    [1, 0, 1, 1, 0, 1, 1], 
    [1, 0, 1, 1, 1, 1, 1], 
    [1, 1, 1, 0, 0, 0, 0], 
    [1, 1, 1, 1, 1, 1, 1], 
    [1, 1, 1, 1, 0, 1, 1]
]

// offsets
const segmentsLocations = [
    // a
    [
        0 - Math.floor(segment.width / 2), 
        0 - Math.floor(segment.height / 2), 
        segment.width, 
        segment.thick
    ], 
    // b
    [
        0 + Math.ceil(segment.width / 2) - segment.thick, 
        0 - Math.floor(segment.height / 2), 
        segment.thick, 
        Math.floor(segment.height / 2)
    ], 
    // c
    [
        0 + Math.ceil(segment.width / 2) - segment.thick, 
        0, 
        segment.thick, 
        Math.floor(segment.height / 2)
    ], 
    // d
    [
        0 - Math.floor(segment.width / 2), 
        0 + Math.floor(segment.height / 2) - segment.thick, 
        segment.width, 
        segment.thick
    ], 
    // e
    [
        0 - Math.floor(segment.width / 2),
        0, 
        segment.thick, 
        Math.floor(segment.height / 2)
    ], 
    // f
    [
        0 - Math.floor(segment.width / 2), 
        0 - Math.floor(segment.height / 2),
        segment.thick, 
        Math.floor(segment.height / 2)
    ], 
    // g
    [
        0 - Math.floor(segment.width / 2), 
        0 - Math.floor(segment.thick / 2), 
        segment.width, 
        segment.thick
    ]
]

let numbers = [];
const multOptions = [1, 2, 10];
let mults = [];
let total = 0;
let current = 0;

window.onload = function() {
    c = document.querySelector("canvas");
    r = c.getContext("2d");

    c.width = 700;
    c.height = 450;

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

function segmentBorder(highlight, x, y) {
    r.fillStyle = highlight ? "yellow" : "white";
    let thick = highlight ? segment.borderThick * 2 : segment.borderThick;

    // top
    r.fillRect(
        x - Math.floor(segment.width / 2) - Math.floor(segment.borderMarginSide / 2) - Math.floor(thick / 2), 
        y - Math.floor(segment.height / 2) - Math.floor(segment.borderMarginVert / 2) - Math.floor(thick / 2), 
        segment.width + segment.borderMarginSide, 
        thick
    );

    // right
    r.fillRect(
        x + Math.floor(segment.width / 2) + Math.floor(segment.borderMarginSide / 2) - Math.floor(thick / 2), 
        y - Math.floor(segment.height / 2) - Math.floor(segment.borderMarginVert / 2) - Math.floor(thick / 2), 
        thick,  
        segment.height + segment.borderMarginVert + thick
    );

    // bottom
    r.fillRect(
        x - Math.floor(segment.width / 2) - Math.floor(segment.borderMarginSide / 2) - Math.floor(thick / 2), 
        y + Math.floor(segment.height / 2) + Math.floor(segment.borderMarginVert / 2) - Math.floor(thick / 2), 
        segment.width + segment.borderMarginSide, 
        thick
    );

    // left
    r.fillRect(
        x - Math.floor(segment.width / 2) - Math.floor(segment.borderMarginSide / 2) - Math.floor(thick / 2), 
        y - Math.floor(segment.height / 2) - Math.floor(segment.borderMarginVert / 2) - Math.floor(thick / 2), 
        thick,  
        segment.height + segment.borderMarginVert
    );
}

function segmentDisplay(digit, x, y) {
    r.fillStyle = "white";
    
    for(let i = 0; i < numToSegment[0].length; i++) {
        let from = {
            x: segmentsLocations[i][0] * numToSegment[digit][i], 
            y: segmentsLocations[i][1] * numToSegment[digit][i]
        };

        let to = {
            x: segmentsLocations[i][2] * numToSegment[digit][i], 
            y: segmentsLocations[i][3] * numToSegment[digit][i]
        };

        r.fillRect(x + from.x, y + from.y, to.x, to.y);
    }
}

function drawNums() {
    let y = margins.leftRightVert;

    for(let i = 0; i < numbers.length; i++) {
        segmentBorder((i == 0), margins.side, y);
        segmentDisplay(numbers[i], margins.side, y);

        y += segment.height + 75;
    }
}

function loop() {
    // r.fillStyle = "slateblue";
    // r.fillRect(0, 0, w, h);

    drawGameBorder();
    drawNums();
    drawMults();
    drawTarget();
    drawCurrent();
    drawTime();
}