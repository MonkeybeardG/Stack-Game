var myGamePiece;
var myObstacles = [];
var score;

function startGame() {
    myGamePiece = new component(30, 30, "red", 225, 570);
    score = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 500;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    },
};

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    };
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + this.width;
        var mytop = this.y;
        var mybottom = this.y + this.height;
        var otherleft = otherobj.x;
        var otherright = otherobj.x + otherobj.width;
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + otherobj.height;
        var crash = true;
        if (
            mybottom < othertop ||
            mytop > otherbottom ||
            myright < otherleft ||
            myleft > otherright
        ) {
            crash = false;
        }
        return crash;
    };
}

function updateGameArea() {
    var i, height, gap;
    for (i = 0; i < myObstacles.length; i++) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            // Reduce the width of the block that touches the previous one
            myObstacles[i].width =
                myGamePiece.x - myObstacles[i].x + myGamePiece.width;
            myGameArea.frameNo++;
            // Add a new block on top of the previous one if touching
            myObstacles.push(
                new component(
                    Math.floor(Math.random() * 150) + 10,
                    10,
                    "green",
                    Math.floor(Math.random() * 400),
                    myObstacles[i].y - 10
                )
            );
            break;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo++;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        height = Math.floor(Math.random() * 150) + 10;
        gap = Math.floor(Math.random() * 90) + 10;
        myObstacles.push(
            new component(
                Math.floor(Math.random() * 150) + 10,
                10,
                "green",
                Math.floor(Math.random() * 400),
                myGameArea.canvas.height - height
            )
        );
    }
    for (i = 0; i < myObstacles.length; i++) {
        myObstacles[i].y += 1;
        myObstacles[i].update();
    }
    score.text = "SCORE: " + myGameArea.frameNo;
    score.update();
    myGamePiece.newPos();
    myGamePiece.update();
    if (myObstacles.length > 0 && myObstacles[0].y > myGameArea.canvas.height) {
        myObstacles.shift();
    }
}

function everyinterval(n) {
    return myGameArea.frameNo % n == 0;
}

function move(direction) {
    if (direction == "left") {
        myGamePiece.speedX = -1;
    }
    if (direction == "right") {
        myGamePiece.speedX = 1;
    }
}

function stopMove() {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
}

document.onkeydown = function (e) {
    switch (e.keyCode) {
        case 37:
            move("left");
            break;
        case 39:
            move("right");
            break;
    }
};

document.onkeyup = function (e) {
    stopMove();