/**
 * TODO:
 * -Basic game rendering:
 *  >mults
 *  >mult borders
 *  >game border
 *  >current
 *  >game border
 *  >make seven segment display look better 
 */

let c, r, w, h;

const margins = {
    // for target and results
    middleVert: 60, 
    // for nums and mults
    leftRightVert: 150, 
    side: 50
}

// vertical spacing between stuff
const leftRightSpacing = 75;
const segSize = 12;
const segment = {
    width: segSize * 3, 
    height: segSize * 5, 
    thick: Math.ceil(segSize * 0.5), 
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

function half(num) {
    return Math.floor(num / 2);
}

// offsets
const segmentsLocations = [
    // a
    [
        0 - half(segment.width), 
        0 - half(segment.height), 
        segment.width, 
        segment.thick
    ], 
    // b
    [
        0 + Math.ceil(segment.width / 2) - segment.thick, 
        0 - half(segment.height), 
        segment.thick, 
        half(segment.height)
    ], 
    // c
    [
        0 + Math.ceil(segment.width / 2) - segment.thick, 
        0, 
        segment.thick, 
        half(segment.height)
    ], 
    // d
    [
        0 - half(segment.width), 
        0 + half(segment.height) - segment.thick, 
        segment.width, 
        segment.thick
    ], 
    // e
    [
        0 - half(segment.width),
        0, 
        segment.thick, 
        half(segment.height)
    ], 
    // f
    [
        0 - half(segment.width), 
        0 - half(segment.height),
        segment.thick, 
        half(segment.height)
    ], 
    // g
    [
        0 - half(segment.width), 
        0 - half(segment.thick), 
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
    c.height = 575;

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

function drawGameBorder() {
    //
};

function drawTarget() {
    r.font = "17px Arial";
    let spacing = segment.borderMarginSide;

    let x = half(w) - half(((segment.width + spacing) * 3));

    // add leading zeros
    let totalString = total.toString();
    let temp = totalString;
    switch (totalString.length) {
        case 1:
            totalString = "00" + temp;
            break;
        case 2:
            totalString = "0" + temp;
    }

    for(let i = 0; i < 3; i++) {
        segmentBorder(false, x, margins.middleVert);
        segmentDisplay(totalString[i], x, margins.middleVert);

        // draw "target" text in middle digit
        if(i == 1) {
            r.fillText("TARGET", x - (segment.width), margins.middleVert - half((segment.height)) - 17);
        }

        x += segment.width + spacing;
    }
}

function segmentBorder(highlight, x, y) {
    r.fillStyle = highlight ? "yellow" : "white";
    let thick = highlight ? segment.borderThick * 3 : segment.borderThick;

    // top
    r.fillRect(
        x - half(segment.width) - half(segment.borderMarginSide) - half(thick), 
        y - half(segment.height) - half(segment.borderMarginVert) - half(thick), 
        segment.width + segment.borderMarginSide, 
        thick
    );

    // right
    r.fillRect(
        x + half(segment.width) + half(segment.borderMarginSide) - half(thick), 
        y - half(segment.height) - half(segment.borderMarginVert) - half(thick), 
        thick,  
        segment.height + segment.borderMarginVert + thick
    );

    // bottom
    r.fillRect(
        x - half(segment.width) - half(segment.borderMarginSide) - half(thick), 
        y + half(segment.height) + half(segment.borderMarginVert) - half(thick), 
        segment.width + segment.borderMarginSide, 
        thick
    );

    // left
    r.fillRect(
        x - half(segment.width) - half(segment.borderMarginSide) - half(thick), 
        y - half(segment.height) - half(segment.borderMarginVert) - half(thick), 
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

        y += segment.height + leftRightSpacing;
    }
}

function multBorder(x, y) {
    r.strokeStyle = "white";
    r.lineWidth = segment.borderThick;
    
    r.beginPath();
    r.arc(x, y, 
        segment.width, 
        0, 2 * Math.PI);
    r.stroke();
    r.closePath();
}

function drawMults() {
    mults = [1, 2, 10];
    let x = w - margins.side;
    let marg = segment.borderThick * 5;
    let y = margins.leftRightVert;

    for(let i = 0; i < mults.length; i++) {
        multBorder(x, y);
        r.lineWidth = segment.thick;
        
        switch(mults[i]) {
            case 1:
                r.beginPath();
                r.moveTo(
                    x - (half(half(segment.height)) * 0.75), 
                    y - half(half(segment.height))
                );
                
                r.lineTo(
                    x + (half(half(segment.height)) * 0.75), 
                    y - half(half(segment.height))
                );

                r.lineTo(
                    x + (half(half(segment.height)) * 0.75), 
                    y + half(half(segment.height))
                );

                r.lineTo(
                    x - (half(half(segment.height)) * 0.75), 
                    y + half(half(segment.height))
                );

                r.lineTo(
                    x - (half(half(segment.height)) * 0.75), 
                    y - (half(half(segment.height)) * 1.2)
                );
                
                r.stroke();
                r.closePath();

                // |
                r.fillRect(
                    x - half(segment.thick), 
                    y - half(segment.height) + half(segment.thick), 
                    segment.thick, 
                    segment.height - segment.thick
                );
                break;
            case 2:
                // horizontal line
                r.beginPath();
                r.moveTo(
                    x - half(segment.width) - marg, 
                    y
                );
                r.lineTo(
                    x + half(segment.width) + marg,
                    y
                )
                r.stroke();
                r.closePath();

                // \\
                for(let i = 0; i < 2; i++) {
                    let space = segment.thick * 2.5;

                    r.beginPath();
                    r.moveTo(
                        x - half(segment.width) + (segment.width * 0.12) + (i * space) - marg, 
                        y - (segment.width * 0.4)
                    );
                    r.lineTo(
                        x + half(segment.width) - (segment.width * (0.12 * 3)) + (i * space), 
                        y + (segment.width * 0.4)
                    )
                    r.stroke();
                    r.closePath();
                }
                break;
            case 10:
                let pos = Math.floor(segment.width * 0.75);
                marg = segment.borderThick * 8;
                // \
                r.beginPath();
                r.moveTo(
                    x - pos + marg, 
                    y - half(segment.height) + marg);
                r.lineTo(
                    x + pos - marg, 
                    y + half(segment.height) - marg);
                r.stroke();
                r.closePath();

                r.beginPath();
                r.moveTo(
                    x + pos - marg, 
                    y - half(segment.height) + marg);
                r.lineTo(
                    x - pos + marg, 
                    y + half(segment.height) - marg);
                r.stroke();
                r.closePath();
                break;
        }

        y += segment.height + leftRightSpacing;
    }
}

function loop() {
    r.fillStyle = "slateblue";
    r.fillRect(0, 0, w, h);

    // drawGameBorder();
    drawTarget();
    drawNums();
    drawMults();
    // drawCurrent();
    // drawTime();
}