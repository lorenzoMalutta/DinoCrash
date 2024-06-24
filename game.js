const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const ambientSound = document.getElementById("ambientSound");
const failSound = document.getElementById("failSound");

const resting = new Image();
const collision = new Image();
const back_lift = new Image();
const front_lift = new Image();
const cactus = new Image();
const cloudImg = new Image();
const crashGif = "image/crash.gif"; // Caminho para o GIF

cloudImg.src = "image/cloud.png";
cactus.src = "image/obstacle.png";
resting.src = "image/resting.png";
collision.src = "image/collision.png";
back_lift.src = "image/back_lift.png";
front_lift.src = "image/front_lift.png";

let dino = {
    x: 50,
    y: 150,
    width: 40,
    height: 60,
    dy: 0,
    jumpStrength: 10,
    gravity: 0.5,
    grounded: false,
    image: resting,
    gifInstance: null,
    isCrashed: false
};

let obstacles = [];
let clouds = [];
let gameSpeed = 5;
let score = 0;
let iteration = 0;

function drawDino() {
    ambientSound.play();
    if (dino.isCrashed && dino.gifInstance) {
        // Desenha o quadro atual do GIF
        dino.gifInstance.moveTo(ctx, dino.x, dino.y);
    } else {
        // Desenha a imagem estática
        ctx.drawImage(dino.image, dino.x, dino.y, dino.width, dino.height);
    }
}

function drawObstacles() {
    obstacles.forEach((obstacle) => {
        ctx.drawImage(cactus, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawClouds() {
    clouds.forEach((cloud) => {
        ctx.drawImage(cloudImg, cloud.x, cloud.y, cloud.width, cloud.height);
    });
}

function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function updateObstacles() {
    obstacles.forEach((obstacle) => {
        obstacle.x -= gameSpeed;
    });

    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
        let obstacle = {
            x: canvas.width,
            y: randomIntFromRange(140, 180),
            width: randomIntFromRange(20, 40),
            height: randomIntFromRange(20, 40),
        };
        obstacles.push(obstacle);
    }

    if (obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift();
    }
}

function updateClouds() {
    clouds.forEach((cloud) => {
        cloud.x -= 1;
    });

    if (clouds.length === 0 || clouds[clouds.length - 1].x < canvas.width - 200) {
        let cloud = {
            x: canvas.width,
            y: randomIntFromRange(40, 80),
            width: 48,
            height: 20,
        };
        clouds.push(cloud);
    }

    if (clouds[0].x + clouds[0].width < 0) {
        clouds.shift();
    }
}

function detectCollision() {
    obstacles.forEach((obstacle) => {
        if (
            dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y
        ) {
            // Colisão detectada
            dino.image = collision;
            dino.isCrashed = true;
            ambientSound.pause();
            failSound.play();
            alert("Game Over! Score: " + score);
            document.location.reload();
        }
    });
}

function updateDino() {
    if (dino.grounded && dino.dy === 0 && isJumping) {
        dino.dy = -dino.jumpStrength;
        dino.grounded = false;
    }

    dino.dy += dino.gravity;
    dino.y += dino.dy;

    if (dino.y + dino.height > canvas.height - 10) {
        dino.y = canvas.height - 10 - dino.height;
        dino.dy = 0;
        dino.grounded = true;
    }

    if (iteration == 10) {
        iteration = 0;
        score++;
    }
}

let isJumping = false;
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        isJumping = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
        isJumping = false;
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDino();
    drawObstacles();
    drawClouds();
}

function update() {
    updateDino();
    updateObstacles();
    updateClouds();
    detectCollision();
    ctx.fillStyle = "#505050";
    ctx.font = "15px 'Press Start 2P'";
    ctx.fillText(score, 730, 80);
}

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
    iteration++;
}

// Carregar e animar o GIF
gifler(crashGif).get(function (anim) {
    anim.animateInCanvas(canvas);
    dino.gifInstance = anim;
});

// Iniciar o loop do jogo
gameLoop();