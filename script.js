/**
 * Mobile stuff to do:
 * BIG THING TO KEEP IN MIND is to make sure stuff looks good on small and large phones
 * -Left line with dot height not correct
 * -Inside lines that connect numbers/ mults to box are too wide
 * -Inside boxes x pos not correct
 * -Line on left side extends too far up
 * -Three horizontal lines outside of numbers and mults are not wide enough
 * -Two lines that make up bottom-right corener of border do not meet
 * -Vertical position of time is not correct
 * -EVERYTHING for mobile but not mobile vert (tablets/ horizontal phones)
 */

/**
 * Note: No main game loop that runs at a set FPS because stuff only really needs to be rendered when a key pressed, other than the time happening, which only happens once a second.
 */

// for debuggin
const SHOW_ANSWER = false;
let initDebugLog = "";

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
let defaultSegSize = 12;
let segSize = defaultSegSize;
let segment = {
    width: segSize * 3, 
    height: segSize * 5, 
    thick: Math.ceil(segSize * 0.5), 
    borderMarginSide: Math.ceil(segSize * 1.5), 
    borderMarginVert: Math.floor(segSize * 2.5), 
    borderThick: 1, 
    init: function() {
        this.width = segSize * 3;
        this.height = segSize * 5;
        this.thick = Math.ceil(segSize * 0.5);
        this.borderMarginSide = Math.ceil(segSize * 1.5);
        this.borderMarginVert = Math.floor(segSize * 2.5);
        this.borderThick = 1;
    }
}
const fontSize = 14;
let secondsPerSection = 4;
// in seconds
let time = 20;
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
let multOptions = [];
let mults = [];
let total = 0;
let current = 0;
let currentDisplay = 0;
let timeUpdateInterval;
let gameOverText;

let mobile = false;
let mobileVert = false;

function mobileCheck() {
    let a = navigator.userAgent||navigator.vendor||window.opera;
    
    mobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)));

    mobileVert = window.innerHeight > window.innerWidth;
}

// general stuff
function mobileResize() {
    if(mobile) {
        if(mobileVert) {
            // change time button
            let ref = document.getElementById("timeChange");
            let rect = c.getBoundingClientRect();
            ref.style.marginLeft = "-" + (window.innerWidth * 0.65) + "px";
            ref.style.marginTop = "-" + ref.offsetHeight + "px";

            // seg size
            segSize = Math.ceil(window.innerHeight / 100);
            segment.init();
        }
    }
}

window.onload = function() {
    mobileCheck();
    gameOverText = document.getElementById("gameOverText");
    gameOverText.style.fontSize = Math.floor(fontSize * 2) + "px";

    c = document.querySelector("canvas");
    r = c.getContext("2d");

    if(mobile) {
        mobileResize();
    }


    if(mobile) {
        if(mobileVert) {
            c.width = window.innerWidth - 30;
            c.height = Math.floor(window.innerHeight * 0.7);
        }
    }
    else {
        c.width = 700;
        c.height = 575;
    }

    w = c.width;
    h = c.height;

    init();
    
    loop();

    document.addEventListener("keydown", press);
    document.addEventListener("keyup", release);
    timeUpdateInterval = window.setInterval(updateTime, 1000);
    
}

// generates numbers, mults, and target
function init() {
    initDebugLog = "";
    if(SHOW_ANSWER) {
        console.clear();
    }
    
    numbers = [];
    multOptions = [1, 2, 10];
    mults = [];
    total = 0;
    current = 0;

    // generate numbers and multipliers
    for(let i = 0; i < 3; i++) {
        let numChoice = Math.floor(Math.random() * (9 - 1) + 1);

        // make sure all nums aren't the same
        if(numbers.length == 2) {
            if(
                (numbers[0] == numChoice) && 
                (numbers[1] == numChoice)
            ) {
                ++numChoice;

                if(numChoice > 9) {
                    numChoice = 0;
                }
            }
        }

        numbers.push(numChoice);

        let multChoice = Math.floor(Math.random() * multOptions.length);

        // make sure all mults aren't the same
        if(mults.length == 2) {
            if(
                (mults[0] == multOptions[multChoice]) && 
                (mults[1] == multOptions[multChoice])
            ) {
                ++multChoice;

                if(multChoice > multOptions.length - 1) {
                    multChoice = 0;
                }
            }
        }

        mults.push(multOptions[multChoice]);

        multOptions.splice(multChoice, 1);
    }

    // pick which numbers should have a mult offset

    /**
     * Old way, commented out below. Not used because during 
     * testing there still seemed to be far too many number 
     * + mult combinations that were straight across
     */
    /*
    // first number
    let numbersWithOffsetMult = [];
    numbersWithOffsetMult.push(Math.floor(Math.random() * 3));

    // second number
    let nextChoice = Math.floor(Math.random() * 3);
    if(numbersWithOffsetMult[0] == nextChoice) {
        ++nextChoice;

        if(nextChoice > 2) {
            nextChoice = 0;
        }
    }
    numbersWithOffsetMult.push(nextChoice);
    */
    // new method: force every number to offset mult
    numbersWithOffsetMult = [0, 1, 2];

    let avail = [
        [...numbers], 
        [...mults]
    ];

    let multPosUsed = [];

    initDebugLog += "\n" + ("AVAIL");
    initDebugLog += "\n" + ("NUMBERS" + " " + avail[0]);
    initDebugLog += "\n" + ("MULTS" + " " + avail[1]);
    initDebugLog += "\n" + ("NumbersWithOffsetMult");
    initDebugLog += "\n" + (numbersWithOffsetMult);
    // initDebugLog += "\n" + ("--------------------");
    // calc target
    for(let i = 0; i < 3; i++) {
        initDebugLog += "\n" + ("----------");
        initDebugLog += "\n" + ("OFFSET?" + " " + i + " " + numbersWithOffsetMult.includes(i))
        initDebugLog += "\n" + ("MULT_POS_USED" + " " + multPosUsed);
        // number that should have offset mult
        if(numbersWithOffsetMult.includes(i)) {
            // randomly choose the mult to be 1 above or below
            let offsetDir = Math.floor(Math.random() * 2);
            let offset = (offsetDir == 0) ? 1 : -1; 

            let mult = i + offset;
            if(mult > numbers.length - 1) {
                mult = 0;
            }
            if(mult < 0) {
                mult = numbers.length - 1;
            }

            // mult is not already used
            if(!(multPosUsed.includes(mult))) {
                initDebugLog += "\n" + ("A" + " " + offset);
                total += avail[0][i] * avail[1][mult];

                if(SHOW_ANSWER) {
                    console.log(avail[0][i] + " " + "----" + " " + avail[1][mult]);
                }
                initDebugLog += "\n" + (avail[0][i] + " " + "----" + " " + avail[1][mult]);

                multPosUsed.push(mult);
            }
            // mult is already used, so find next avail
            else {
                initDebugLog += "\n" + ("B");
                // randomly decide if should go down or up to find avail
                let moveDir = Math.floor(Math.random() * 2);
                let move = (moveDir == 0) ? 1 : -1;
                let pos = i;

                while(multPosUsed.includes(pos)) {
                    pos += move;

                    if(pos > numbers.length - 1) {
                        pos = 0;
                    }
                    if(pos < 0) {
                        pos = numbers.length - 1;
                    }
                }

                total += avail[0][i] * avail[1][pos];

                if(SHOW_ANSWER) {
                    console.log(avail[0][i] + " " + "----" + " " + avail[1][pos]);
                }
                initDebugLog += "\n" + (avail[0][i] + " " + "----" + " " + avail[1][pos]);

                multPosUsed.push(pos);
            }
        }
        else {
            /**
             * Find the next avail mult, but incase the mult 
             * at the same level is already used, use a loop 
             * to find the next avail. But the loop should 
             * move in a random direction to find next avail
             */
            let moveDir = Math.floor(Math.random() * 2);
            let move = (moveDir == 0) ? 1 : -1;
            let pos = i;

            if(multPosUsed.includes(pos)) {
                while(multPosUsed.includes(pos)) {
                    pos += move;

                    if(pos > numbers.length - 1) {
                        pos = 0;
                    }
                    if(pos < 0) {
                        pos = numbers.length - 1;
                    }
                }
            }

            total += avail[0][i] * avail[1][pos];

            if(SHOW_ANSWER) {
                console.log(avail[0][i] + " " + "----" + " " + avail[1][pos]);
            }
            initDebugLog += "\n" + (avail[0][i] + " " + "----" + " " + avail[1][pos]);

            multPosUsed.push(pos);
        }

        initDebugLog += "\n" + ("TOTAL" + " " + total)

    }

    /*
    // calculate
    for(let i = 0; i < numbers.length; i++) {
        // let numMax = avail[0].length - 1;
        // let numI = Math.floor(Math.random() * numMax);
        let numI = 0;
        
        let multMax = avail[1].length - 1;
        let multI = Math.floor(Math.random() * multMax);
        // initDebugLog += "\n" + (avail[0][numI], avail[1][multI])
        
        total += avail[0][numI] * avail[1][multI];
        
        // for debuggin
        if(SHOW_ANSWER) {
            initDebugLog += "\n" + (avail[0][numI], "----", avail[1][multI]);
        }
        
        avail[0].splice(numI, 1);
        avail[1].splice(multI, 1);

    }
    */
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
    let startY = margins.middleVert + half(thick);
    if(mobile) {
        if(mobileVert) {
            startY = 0 + half(thick);
        }
    }
    // left
    r.fillRect(
        margin + half(thick), 
        startY, 
        thick, 
        h - Math.floor((segment.height + margins.middleVert) * 1.15)
    );
    
    let x = margin + half(thick);
    let y = startY + h - Math.floor((segment.height + margins.middleVert) * 1.15);
    // circle on bottom-left
    r.beginPath();
    r.arc(
        x, y, 
        circleSize, 
        0, 
        2 * Math.PI
    );
    r.fill();
    r.closePath();

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
    if(mobile) {
        if(mobileVert) {
            endX = half(half(margins.side)) + timeWidth + thick;
        }
    }
    r.fillRect(
        startX, 
        h - margins.middleVert + half(thick), 
        endX - startX, 
        thick
    );

    // bottom left outside
    if(!(mobile) && !(mobileVert)) {
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
    }
    

    // left horizontal lines near numbers
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
        let scale = defaultSegSize / segSize;
        
        let from = {
            x: (segmentsLocations[i][0] / scale) * numToSegment[digit][i], 
            y: (segmentsLocations[i][1] / scale) * numToSegment[digit][i]
        };

        let to = {
            x: (segmentsLocations[i][2] / scale) * numToSegment[digit][i], 
            y: (segmentsLocations[i][3] / scale) * numToSegment[digit][i]
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
    let textYoffset = 0;
    if(mobile) {
        if(mobileVert) {
            textYoffset = 0 - (10 - Math.floor(window.innerHeight / 100));
        }
    }

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
                h - margins.middleVert + segment.height - yOffset - textYoffset);
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
    if(mobile) {
        if(mobileVert) {
            x = half(half(margins.side));
        }
    }    
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

function updateTime() {
    --timeLeft;
    loop();

    if(timeLeft == 0) {
        endGame("Time Limit Exceeded");
    }
}

function changeTime() {
    let input = window.prompt("Time? (must be integer > 0)");
    let int = parseInt(input);
    let check = Math.abs(int) - Math.abs(int);
    
    if(check == 0) {
        time = int;
        timeLeft = time;

        secondsPerSection = time / 5;
    }
    else {
        window.alert("Invalid time");
    }

    // unfocus button so space bar doesn't click it
    document.getElementById("timeChange").blur();
}

let connectionStartPos = -1;

function drawConnection(from, to, index) {
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
        let segHeight = half(toY - fromY);
        let squareSize = Math.floor(segment.width / 3);

        // horizontal offset from center where diagonal should start
        let offset = 0;
        switch(index) {
            case 0:
                offset = 0 - Math.floor(segWidth * 0.7);
                break;
            case 1:
                offset = 0;
                break;
            case 2:
                offset = Math.floor(segWidth * 0.7);
                break;
        }

        // vertical offset from center where diagonal should start
        let vertOffset = 0;
        switch(index) {
            case 0:
                vertOffset = 0;
                break;
            case 1:
                vertOffset = Math.floor(segHeight * 0.25);
                break;
            case 2:
                vertOffset = 0 - Math.floor(segHeight * 0.5);
                break;
        }

        // first horizontal
        r.fillRect(
            x, 
            fromY, 
            offset + longerSegWidth, 
            thick
        );
        // square corner
        r.fillRect(
            offset + x + longerSegWidth - half(squareSize), 
            fromY - half(squareSize), 
            squareSize, 
            squareSize
        );

        // first vertical
        r.fillRect(
            offset + x + longerSegWidth, 
            fromY, 
            thick, 
            segHeight + vertOffset
        );
        // square corner
        r.fillRect(
            offset + x + longerSegWidth - half(squareSize), 
            vertOffset + fromY + segHeight - half(squareSize), 
            squareSize, 
            squareSize
        );

        // middle horizontal
        r.fillRect(
            offset + x + longerSegWidth, 
            vertOffset + fromY + segHeight, 
            segWidth, 
            thick
        );
        // square corner
        r.fillRect(
            offset + x + longerSegWidth + segWidth - half(squareSize), 
            vertOffset + fromY + segHeight - half(squareSize), 
            squareSize, 
            squareSize
        );        

        // secondVertical
        r.fillRect(
            offset + x + longerSegWidth + segWidth, 
            vertOffset + fromY + segHeight, 
            thick, 
            segHeight - vertOffset
        );
        // square corner
        r.fillRect(
            offset + x + longerSegWidth + segWidth - half(squareSize),
            fromY + segHeight + segHeight - half(squareSize), 
            squareSize, 
            squareSize
        );        

        // last horizontal
        r.fillRect(
            offset + x + longerSegWidth + segWidth, 
            fromY + segHeight + segHeight, 
            longerSegWidth - offset, 
            thick
            );
    }

    // left inside squre
    x = gameBorderMargin + (segment.width * 2) + segment.borderThick + widthRef;
    y = fromY;
    
    // inside square on left side
    r.fillRect(
        x + 0.5, 
        y - half(gameBorderSquareSize) + 0.5, 
        gameBorderSquareSize, 
        gameBorderSquareSize
    );

    // inside square on right side
    x = w - gameBorderMargin - (segment.width * 2) - half(widthRef) - segment.borderThick - half(widthRef);
    y = toY;
    
    r.fillRect(
        x - 0.5, 
        y - half(gameBorderSquareSize) + 0.5, 
        0 - gameBorderSquareSize, 
        gameBorderSquareSize
    );
}

function drawCompletedConnections() {
    for(let c of completedConnections) {
        drawConnection(c[0], c[1], completedConnections.indexOf(c));
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
    let value = 0;
    value = numbers[connectionStartPos] * mults[pos];
    
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

    // instantly update result if on last number
    if(completedConnections.length == 2) {
        window.clearInterval(currentInterval);
        current = alternate;
        currentDisplay = alternate;
        loop();
    }
    else {
        window.clearInterval(currentInterval);

        currentInterval = window.setInterval(updateCurrent, 25);
    }
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

    if(onRight && (completedConnections.length < 2)) {
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
let gameOver = false;

// when a number and mult have been selected
function confirmSelection() {
    completedConnections.push([connectionStartPos, pos]);

    // calculate current, sometimes gets off, so can't just increase
    current = 0;
    for(let c of completedConnections) {
        current += numbers[c[0]] * mults[c[1]];
    }
    
    if(completedConnections.length == 3) {
        gameOver = true;

        if(current == total) {
            endGame("Correct Input");
        }
        else {
            endGame("Incorrect Input");
        }
    }
    else {
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

                if(!(gameOver)) {
                    onRight = !(onRight);

                    loop();

                    if(onRight) {
                        startCurrentUpdate();
                    }
                }
                break;
            case "Backspace":
                pressing = true;
                lastPressed = e.key;
                if(onRight) {
                    onRight = false;
                    pos = connectionStartPos;
                    currentDisplay = current;

                    loop();
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
    // r.fillStyle = "#CC99FF";
    // r.fillRect(0, 0, w, h);

    drawGameBorder();
    drawTarget();
    drawNums();
    drawMults();
    drawCurrent();
    drawTime();
    drawCompletedConnections();

    if(onRight) {
        drawConnection(connectionStartPos, pos, completedConnections.length);
    }
}

function endGame(msg) {
    // remove listeners and intervals
    document.removeEventListener("keydown", press);
    document.removeEventListener("keyup", release);
    window.clearInterval(timeUpdateInterval);

    gameOverText.innerHTML = msg + " <span style='font-weight: normal;'>(space to restart)</span>";
    gameOverText.style.opacity = "1";

    document.addEventListener("keydown", restartCheck);
}

function restartCheck(e) {
    if(e.key == " ") {
        document.removeEventListener("keydown", restartCheck);

        gameOverText.style.opacity = "0";
        timeLeft = time;
        completedConnections = [];
        onRight = false;
        pos = 0;
        current = 0;
        currentDisplay = 0;
        currentColor = "white";
        gameOver = false;

        init();
        loop();

        document.addEventListener("keydown", press);
        document.addEventListener("keyup", release);
        timeUpdateInterval = window.setInterval(updateTime, 1000);
    }
}

// for debugging
function showInitLog() {
    console.log("INIT LOG");
    console.log(initDebugLog);
    console.log("\n--------------------\nEND OF INIT LOG\n--------------------");
}