/**
 * Note: No main game loop that runs at a set FPS because stuff only really needs to be rendered when a key pressed, other than the time happening, which only happens once a second.
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
const fontSize = 14;
const secondsPerSection = 5;
// in seconds
let time = 30;
let timeLeft = time;

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
let currentDisplay = 0;

let pressListener;
let releaseListener;
let timeUpdateInterval;

window.onload = function() {
    c = document.querySelector("canvas");
    r = c.getContext("2d");

    c.width = 700;
    c.height = 575;

    w = c.width;
    h = c.height;

    init();
    loop();

    pressListener = document.addEventListener("keydown", press);
    releaseListener = document.addEventListener("keyup", release);
    timeUpdateInterval = window.setInterval(updateTime, 1000);
}

// generates numbers, mults, and target
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

const gameBorderMargin = 5;
const gameBorderSquareSize = Math.floor(segment.width / 5);

function drawGameBorder() {
    r.fillStyle = "white";
    // on all sides
    let margin = gameBorderMargin;
    let thick = segment.borderThick;
    // for bottom left
    const squareSize = gameBorderSquareSize;
    // for inside of numbers and mults
    const circleSize = Math.floor(squareSize * 0.7);
    // left
    r.fillRect(
        margin + half(thick), 
        margins.middleVert + half(thick), 
        thick, 
        h - Math.floor((segment.height + margins.middleVert) * 1.15)
    );
    
    let x = margin + half(thick);
    let startY = margins.middleVert + half(thick);
    let y = startY + h - Math.floor((segment.height + margins.middleVert) * 1.15);
    // circle on bottom-left
    r.arc(
        x, y, 
        circleSize, 
        0, 
        2 * Math.PI
    );
    r.fill();

    // top left
    r.fillRect(
        margin + half(thick), 
        margins.middleVert + half(thick), 
        half(w - (margin * 2)) - half((segment.width + segment.borderMarginSide) * 3), 
        thick
    );

    // top right
    r.fillRect(
        half(w - (margin * 2)) + half((segment.width + segment.borderMarginSide) * 3) + half(segment.borderMarginSide), 
        margins.middleVert + half(thick), 
        half(w - (margin * 2)) - half((segment.width + segment.borderMarginSide) * 3) - half(half(segment.borderMarginSide)), 
        thick
    );

    let startingY = margins.middleVert + half(thick);
    let endingY = h - margins.middleVert + half(thick);
    // right
    r.fillRect(
        w - margin - half(thick), 
        startingY, 
        thick, 
        endingY - startingY
    );

    // bottom right
    r.fillRect(
        half(w - (margin * 2)) + half((segment.width + segment.borderMarginSide) * 3) + half(segment.borderMarginSide), 
        h - margins.middleVert + half(thick), 
        half(w - (margin * 2)) - half((segment.width + segment.borderMarginSide) * 3) - half(half(segment.borderMarginSide)), 
        thick
    );

    // bottom left inside
    let startX = half(w - (margin * 2)) - half((segment.width + segment.borderMarginSide) * 3) + half(half(segment.borderMarginSide));
    let endX = margins.side + segment.width + segment.borderMarginSide + timeWidth + segment.borderThick;
    r.fillRect(
        startX, 
        h - margins.middleVert + half(thick), 
        endX - startX, 
        thick
    );

    // bottom left outside
    let bottomLeftScale = 7;
    startX = margins.side + segment.width + segment.borderMarginSide - segment.borderThick;
    r.fillRect(
        startX, 
        h - margins.middleVert + half(thick), 
        -Math.floor(timeWidth / bottomLeftScale), 
        thick
    );
    
    // three lines of ascending height to the left of time
    x = startX - Math.floor((timeWidth / bottomLeftScale));
    y = h - margins.middleVert + half(thick);
    let lineHeight = Math.floor(timeHeight / 4);
    for(let i = 0; i < 3; i++) {
        r.fillRect(
            x, y - half(lineHeight), 
            thick, lineHeight
        );

        x -= thick * 3;
        lineHeight = Math.floor(lineHeight * 1.5);
    }

    // left horizontal lines
    r.lineWidth = thick;
    r.strokeStyle = "white";
    y = margins.leftRightVert;
    let width = half(margins.side) - margin - segment.borderThick - thick;
    let vertSpacing = Math.floor(segment.height / 4);

    for(let i = 0; i < numbers.length; i++) {
        // outside on right side
        r.fillRect(
            w - margin, 
            y, 
            0 - half(width), 
            thick
        );

        // inside on right side
        r.fillRect(
            w - margin - (segment.width * 2) - half(width) - segment.borderThick, 
            y, 
            0 - half(width), 
            thick
        );

        let x = w - margin - (segment.width * 2) - half(width) - segment.borderThick - half(width);
        // inside square on right side
        r.strokeRect(
            x - 0.5, 
            y - half(squareSize) + 0.5, 
            0 - squareSize, 
            squareSize
        );

        // outside on middle on left side
        r.fillRect(
            margin, 
            y, 
            width, 
            thick
        );

        // inside on left side
        r.fillRect(
            margin + (segment.width * 2) + segment.borderThick, 
            y, 
            width, 
            thick
        );

        x = margin + (segment.width * 2) + segment.borderThick + width;
        // inside square on left side
        r.strokeRect(
            x + 0.5, 
            y - half(squareSize) + 0.5, 
            squareSize, 
            squareSize
        );

        // outside on line above middle on left side
        r.fillRect(
            margin, 
            y + vertSpacing, 
            width, 
            thick
        );

        // outside on line below middle on left side
        r.fillRect(
            margin, 
            y - vertSpacing, 
            width, 
            thick
        );

        y += segment.height + leftRightSpacing;
    }
};

function drawTarget() {
    r.font = fontSize + "px Arial";
    let spacing = segment.borderMarginSide;

    let x = half(w) - half((segment.width * 3));

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
        r.fillStyle = "tomato";
        segmentDisplay(totalString[i], x, margins.middleVert);

        // draw "target" text in middle digit
        if(i == 1) {
            r.fillStyle = "tomato";
            let offset = (r.measureText("TARGET").width) / 2;
            r.fillText(
                "TARGET", 
                x - offset, 
                margins.middleVert - half((segment.height)) - segment.borderThick - fontSize - 3);
        }

        x += segment.width + spacing;
    }
}

const highlightColors = ["yellow", "red", "blue"];

function segmentBorder(highlight, x, y) {
    r.fillStyle = highlight ? highlightColors[highlightCheck] : "white";
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

let checkI = -1;
let highlightCheck = -1;

function drawNums() {
    let y = margins.leftRightVert;

    highlightCheck = pos;
    if(onRight) {
        highlightCheck = connectionStartPos;
    }
    
    for(let i = 0; i < numbers.length; i++) {
        segmentBorder((i == highlightCheck), margins.side, y);
        r.fillStyle = "white";
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
        0, 2 * Math.PI
    );
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

let currentColor = "white";

function drawCurrent() {
    r.font = fontSize + "px Arial";
    let spacing = segment.borderMarginSide;

    let x = half(w) - half((segment.width * 3));
    let yOffset = 2;

    // add leading zeros
    let currentString = currentDisplay.toString();
    let temp = currentString;
    switch (currentString.length) {
        case 1:
            currentString = "00" + temp;
            break;
        case 2:
            currentString = "0" + temp;
    }

    for(let i = 0; i < 3; i++) {
        segmentBorder(false, x, h - margins.middleVert - yOffset);
        r.fillStyle = currentColor;
        segmentDisplay(currentString[i], x, h - margins.middleVert - yOffset);

        // draw "target" text in middle digit
        if(i == 1) {
            let offset = (r.measureText("TARGET").width) / 2;
            r.fillText(
                "RESULT", 
                x - offset, 
                h - margins.middleVert + segment.height - yOffset);
        }

        x += segment.width + spacing;
    }
}

const timeWidth = Math.floor(segment.width * 2.5);
const timeHeight = Math.floor(segment.height * 0.5);

function drawTime() {
    r.strokeStyle = "white";
    let thick = segment.borderThick;
    r.lineWidth = thick;

    let spacing = 5;
    let totalSections = Math.floor(time / secondsPerSection);
    let count = Math.ceil(timeLeft / secondsPerSection);
    let sectionWidth = Math.floor(timeWidth / ((time / secondsPerSection))) - spacing - (spacing / totalSections);

    let x = margins.side + segment.width + segment.borderMarginSide;
    let y = h - segment.height - half(timeHeight);

    r.fillStyle = "white";
    // top
    r.fillRect(
        x, y, 
        timeWidth, thick
    );

    // right
    r.fillRect(
        x + timeWidth - thick, y, 
        thick, timeHeight
    );

    // down
    r.fillRect(
        x, y + timeHeight, 
        timeWidth, thick
    );

    // left
    r.fillRect(
        x, y, 
        thick, timeHeight
    );

    r.fillStyle = "springgreen";
    // bar sections
    for(let i = 0; i < count; i++) {
        r.fillRect(
            x + spacing, y + spacing, 
            sectionWidth, timeHeight - (spacing * 2)
        );

        x += sectionWidth + spacing;
    }
}

let gameOver = false;

function updateTime() {
    --timeLeft;
    loop();

    if(timeLeft == 0) {
        gameOver = true;
        // window.setTimeout(function() {
        //     window.alert("No time left");
        // }, 50);
    }
}

let connectionStartPos = -1;

function drawConnection(from, to) {
    r.fillStyle = highlightColors[from];

    let thick = segment.borderThick;
    // from game border
    let widthRef = half(margins.side) - gameBorderMargin - segment.borderThick - thick;
    
    let x = gameBorderMargin + (segment.width * 2) + segment.borderThick + widthRef + gameBorderSquareSize + thick;
    let endX = w - gameBorderMargin - (segment.width * 2) - half(widthRef) - segment.borderThick - half(widthRef) - gameBorderSquareSize;
    let len = endX - x;

    let baseY = margins.leftRightVert;
    let levelY = segment.height + leftRightSpacing;
    let fromY = baseY + (levelY * from);
    let toY = baseY + (levelY * to);

    if(fromY == toY) {
        r.fillRect(x, toY, len, thick);
    }
    else {
        let segWidth = half(half(len));
        let longerSegWidth = Math.floor(segWidth * 1.5);
        let segHeight = half(toY - fromY)
        // first horizontal
        r.fillRect(x, fromY, longerSegWidth, thick);

        // first vertical
        r.fillRect(x + longerSegWidth, fromY, thick, segHeight);

        // middle horizontal
        r.fillRect(x + longerSegWidth, fromY + segHeight, segWidth, thick);

        // secondVertical
        r.fillRect(x + longerSegWidth + segWidth, fromY + segHeight, thick, segHeight);

        // last horizontal
        r.fillRect(x + longerSegWidth + segWidth, fromY + segHeight + segHeight, longerSegWidth, thick);
    }
}

function drawCompletedConnections() {
    for(let c of completedConnections) {
        drawConnection(c[0], c[1]);
    }
}

let currentInterval;
let alternate = -1;

function updateCurrent() {
    if(currentDisplay != alternate) {
        if(currentDisplay > alternate) {
            --currentDisplay;
        }
        else {
            ++currentDisplay;
        }

        loop();
    }
    else {
        window.clearInterval(currentInterval);
    }
}

function startCurrentUpdate() {
    currentDisplay = current;
    let value = numbers[connectionStartPos] * mults[pos];
    
    // what current would be based off of number and mult selected
    alternate = current + value;

    // when on last number, update color of result to reflect if correct
    if(completedConnections.length == 2) {
        if(alternate == total) {
            currentColor = "springgreen";
        }
        else {
            currentColor = "tomato";
        }
    }

    window.clearInterval(currentInterval);

    currentInterval = window.setInterval(updateCurrent, 25);
}

function verticalMove(amount, key) {
    pressing = true;
    lastPressed = key;

    // don't allow moving into a spot already in a connection
    let found = false;

    while(!(found)) {
        if(!(found)) {
            pos += amount;

            if(pos < 0) {
                pos = numbers.length - 1;
            }
            if(pos > numbers.length - 1) {
                pos = 0;
            }
        }

        found = true;

        for(let c of completedConnections) {
            let check = onRight ? 1 : 0;

            if(c[check] == pos) {
                found = false;
                break;
            }
        }
    }

    if(pos < 0) {
        pos = numbers.length - 1;
    }
    if(pos > numbers.length - 1) {
        pos = 0;
    }

    loop();

    if(onRight) {
        startCurrentUpdate();
    }
}

// when confirming a number and movin to mults, find first avail
function findAvailMult() {
    let found = false;

    while(!(found)) {   
        found = true;
        for(let c of completedConnections) {
            if(c[1] == pos) {
                found = false;
                break;
            }
        }

        if(!(found)) {
            ++pos;

            if(pos > numbers.length - 1) {
                pos = 0;
            }
        }
    }
}

let completedConnections = [];

// when a number and mult have been selected
function confirmSelection() {
    current += numbers[connectionStartPos] * mults[pos];

    completedConnections.push([connectionStartPos, pos]);
    pos = connectionStartPos;

    // find next below number
    let found = false;
    while(!(found)) {
        ++pos;

        if(pos > numbers.length - 1) {
            pos = 0;
        }

        found = true;
        for(let c of completedConnections) {
            if(c[0] == pos) {
                found = false;
                break;
            }
        }
    }
}

let pressing = false;
let lastPressed = "";
let pos = 0;
let onRight = false;

function press(e) {
    if(!(pressing)) {
        switch(e.key) {
            case "ArrowDown":
                verticalMove(1, e.key);
                break;
            
            case "ArrowUp":
                verticalMove(-1, e.key);
                break;
            
            case "Enter":
            case " ":
                pressing = true;
                lastPressed = e.key;
                
                if(!(onRight)) {
                    connectionStartPos = pos;
                    findAvailMult();
                }
                else {
                    confirmSelection();
                }

                onRight = !(onRight);

                loop();

                if(onRight) {
                    startCurrentUpdate();
                }
                break;
        }
    }
}

function release(e) {
    if(e.key == lastPressed) {
        pressing = false;
    }
}

function loop() {
    r.clearRect(0, 0, w, h);

    drawGameBorder();
    drawTarget();
    drawNums();
    drawMults();
    drawCurrent();
    drawTime();
    drawCompletedConnections();

    if(onRight) {
        drawConnection(connectionStartPos, pos);
    }
}