
// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();
nWidth = 1200
nHeight = 600
const maxMultiplier = 100;
const maxWidth = nWidth * maxMultiplier;
const maxHeight = nHeight * maxMultiplier;

// % of browser window to be taken up by the canvas
// this can just be set to 1 if you want max height or width
const windowPercentage = 0.85;

// the canvas' displayed width/height
// this is what changes when the window is resized 
// initialized to the native resolution
let cHeight = nHeight;
let cWidth = nWidth;
// Create the canvas
var canvas = document.getElementById('canvas1');
var playerCanvas = document.getElementById('player-canvas');
var ctx2 = playerCanvas.getContext("2d");
ctx2.fillStyle = 'red';
ctx2.fillRect(50, 50, 100, 100);
var viewport = document.getElementById('canvas-viewport')
var camera_x = 0
var ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 150;
playerCanvas.width = 600;
playerCanvas.height = 150;
console.log("hell")

// The main game loop
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};

function resize() {
//   cWidth = window.innerWidth;
//   cHeight = window.innerHeight;

//   // ratio of the native game size width to height
//   const nativeRatio = nWidth / nHeight;
//   const browserWindowRatio = cWidth / cHeight;

//   // browser window is too wide
//   if (browserWindowRatio > nativeRatio) {

//     cHeight = Math.floor(cHeight * windowPercentage); // optional
//     if (cHeight > maxWidth) cHeight = maxHeight; // optional

//     cWidth = Math.floor(cHeight * nativeRatio);
//   } else {
//     // browser window is too high

//     cWidth = Math.floor(cWidth * windowPercentage); // optional
//     if (cWidth > maxWidth) cWidth = maxWidth; // optional

//     cHeight = Math.floor(cWidth / nativeRatio);
//   }

  // set the canvas style width and height to the new width and height
  viewport.style.width = `${cWidth}px`;
  viewport.style.height = `${cHeight}px`;
  ctx.canvas.style.height = `${cHeight*1.1}px`;
  ctx2.canvas.style.height = `${cHeight*1.1}px`;
  viewport.scrollTop = 73.45454406738281;
  
}
resize();

function init() {
    terrainPattern = ctx.createPattern(resources.get('img/terrain.png'), 'no-repeat');
    lastTime = Date.now();
    ctx.fillStyle = terrainPattern;
    ctx2.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    renderEntity(gallerio)
    main();
}

resources.load([
    'img/idle.png',
    'img/terrain.png',
    'img/transparent.png',
    'img/char_move.png',
    'img/char_move_left.png',
    'img/hint.png',
    'img/gallerio.png',
    'img/submission1.png',
    'img/bakul.png',
]);
resources.onReady(init);

var hintEl = document.getElementById('message');
 
// Game state

var player = {
    pos: [4, 235],
    sprite_idle: new Sprite('img/idle.png', [0, 0], [80, 80], 10, [0, 1,2,3,4,5,6,7,8,9]),
    sprite_move_right: new Sprite('img/char_move.png', [0, 0], [80, 80], 10, [1,2,3,4,5,6,7,8,9,10,11,12,13]),
    sprite_move_left: new Sprite('img/char_move_left.png', [0, 0], [80, 80], 10, [12,11,10,9,8,7,6,5,4,3,2,1,0]),
    sprite_move_up: new Sprite('img/char_move_left.png', [0, 0], [80, 80], 10, [12,11,10,9,8,7,6,5,4,3,2,1,0]),
    move: 0
};

var gallerio = {
    pos: [200,48],
    sprite: new Sprite('img/bakul.png', [0, 0], [100, 100], 0, [0])
}


var submissions = [
{
    pos: [340,55],
    sprite: new Sprite('img/submission1.png', [0, 0], [1280, 870], 0, [0],'horizontal',false,0.1)
}
]

var terrainPattern;
var playerbg;
// Speed in pixels per second
var playerSpeed = 100;


// Update game objects
function update(dt) {

    handleInput(dt);
    updateEntities(dt);


    checkCollisions();
    //console.log(hintEl)
};

function handleInput(dt) {
    
    if(player.move<2) player.move=0

    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += Math.floor(playerSpeed * dt);
        player.move=1
    }

    if(input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= Math.floor(playerSpeed * dt);
        player.move=1
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        if(player.move<2){
            player.pos[0] -= Math.floor(playerSpeed * dt);
            player.move=-1
        }
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        if(player.move<2){
            player.pos[0] += Math.floor(playerSpeed * dt);
            player.move=1
        }
    }
    if(input.isDown('e')) {
        console.log("player",player.pos)
        console.log("scroll",viewport.scrollLeft)
    }

    if(input.isDown('SPACE')) {
        if(computerTable.hint[0]) window.location.href = "https://github.com/95ych";
        if(stairUp.hint){ 
            player.move=2;
        }
    }
}

function updateEntities(dt) {
    hintEl.innerHTML = ""
    viewport.scrollLeft = (player.pos[0]/canvas.width)*viewport.scrollWidth
    // Update the player sprite animation
    if(player.move==1 ) player.sprite_move_right.update(dt);
    else if (player.move==-1) player.sprite_move_left.update(dt)
    else if (player.move==2) stairUp.sprite_move.update(dt)
    else player.sprite_idle.update(dt)
}

// Collisions

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

function checkCollisions() {
    hintEl.innerHTML = ""
    checkPlayerBounds();
}

function checkPlayerBounds() {
    // Check bounds
    if(player.pos[0] < -10) {
        player.pos[0] = -10;
    }
    else if(player.pos[0] > canvas.width - player.sprite_idle.size[0]+40) {
        player.pos[0] = canvas.width - player.sprite_idle.size[0]+40;
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite_idle.size[1]+15) {
        player.pos[1] = canvas.height - player.sprite_idle.size[1]+15;
    }
}

// Draw everything
function render() {
    ctx2.clearRect(0,0,canvas.width,canvas.height);
    renderPlayer(player);

};

function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

function renderRedirect(entity) {
    ctx.save();
    ctx.translate(entity.pos[0],235);
    if(entity.hint[0]) entity.redirect.render(ctx);
    ctx.restore();
}

function renderHint(entity) {
    ctx.save();
    ctx.translate(entity.pos[0]+3,entity.pos[1]-25);
    if(entity.hint) entity.sprite_hint.render(ctx);
    ctx.restore();
}

function renderPlayer(entity) {
    ctx2.save();
    ctx2.translate(entity.pos[0], entity.pos[1]);
    if (entity.move===1) entity.sprite_move_right.render(ctx2);
    else if (entity.move===-1) entity.sprite_move_left.render(ctx2)
    else if (entity.move===0) entity.sprite_idle.render(ctx2)
    //entity.sprite_idle.render(ctx)
    //console.log("move",entity.move)
    ctx2.restore();
}