
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
var welcome =document.getElementById('welcome');
var ctx2 = playerCanvas.getContext("2d");
var viewport = document.getElementById('canvas-viewport')
var camera_x = 0
var ctx = canvas.getContext("2d");
var scroll_y_to =0;
var stair = 0;
var stair_in_x = 0;
var stair_in_y = 0;
var stair_out_x = 0;
var stair_out_y = 0;
canvas.width = 4000;
canvas.height = 150*3;
playerCanvas.width = 4000;
playerCanvas.height = 150*3;

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
  ctx.canvas.style.height = `${cHeight*3}px`;
  ctx2.canvas.style.height = `${cHeight*3}px`;
  viewport.scrollTop = 1216;
  
}
resize();

function init() {
    terrainPattern = ctx.createPattern(resources.get('img/terrain.png'), 'no-repeat');
    lastTime = Date.now();
    ctx.fillStyle = terrainPattern;
    ctx2.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
    'img/stair-in-up.png',
    'img/stair-in-down.png',
    'img/catlick.png',
]);
resources.onReady(init);

var participant = {
    name: "",
    room: "",
    caption: "",
}

var partiName = document.getElementById('name');
var roomno = document.getElementById('roomno');
var caption = document.getElementById('caption');

// Game state

var player = {
    pos: [0, 390],
    sprite_idle: new Sprite('img/idle.png', [0, 0], [80, 80], 10, [0, 1,2,3,4,5,6,7,8,9]),
    sprite_move_right: new Sprite('img/char_move.png', [0, 0], [80, 80], 10, [1,2,3,4,5,6,7,8,9,10,11,12,13]),
    sprite_move_left: new Sprite('img/char_move_left.png', [0, 0], [80, 80], 10, [12,11,10,9,8,7,6,5,4,3,2,1,0]),
    sprite_move_up: new Sprite('img/stair-in-up.png',[0,0],[32,40],4,[1,2,3,4]),
    sprite_move_down: new Sprite('img/stair-in-down.png',[0,0],[32,40],4,[1,2,3,4]),
    move: 0
};
var cat1 = {
    pos: [2171,412],
    sprite: new Sprite('img/catlick.png', [0, 0], [32, 16],4,[0,1,2,3]),
}

var gallerio = {
    pos: [200,48],
    sprite: new Sprite('img/bakul.png', [0, 0], [100, 100], 0, [0])
}

var terrainPattern;
var playerbg;
// Speed in pixels per second
var playerSpeed = 600; //orginal
//var playerSpeed =600

// Update game objects
function update(dt) {

    handleInput(dt);
    updateEntities(dt);
    checkCollisions();
    //console.log(hintEl)

};

function handleInput(dt) {
    
    if(player.move<2) player.move=0

    if((input.isDown('UP') || input.isDown('w') || input.isDown('DOWN') || input.isDown('s')) && stair!=0) {
        player.move=1+stair
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
    }
}

function updateEntities(dt) {
    partiName.innerHTML = participant.name;
    roomno.innerHTML = participant.room;
    caption.innerHTML = participant.caption;
    viewport.scrollLeft = (player.pos[0]/canvas.width)*viewport.scrollWidth
    // Update the player sprite animation
    if(player.move==1 ) player.sprite_move_right.update(dt);
    else if (player.move==-1) player.sprite_move_left.update(dt)
    else if (player.move==2) player.sprite_move_up.update(dt)
    else if (player.move==3) player.sprite_move_down.update(dt)
    else player.sprite_idle.update(dt)
    if(player.pos[0]<3921 && player.pos[0]>3879 && player.pos[1]>300){
        stair_in_x=3915
        stair_in_y=409
        stair_out_x=3940
        stair_out_y=240
        scroll_y_to=600
        stair=1
    }
    
    else if(player.pos[0]<926 && player.pos[0]>880 && player.pos[1]>300){
        stair_in_x=914
        stair_in_y=409
        stair_out_x=920
        stair_out_y=240
        scroll_y_to=600
        stair=1
    }
    
    else if(player.pos[0]>3924 && player.pos[0]<3966 && player.pos[1]>200){
        stair_in_x=3956
        stair_in_y=259
        stair_out_x=3900
        stair_out_y=390
        scroll_y_to =1206.22216796875
        stair=2
    }
    else if(player.pos[0]<2030 && player.pos[0]>1986 && player.pos[1]>200){
        stair_in_x=2023
        stair_in_y=259
        stair_out_x=1998
        stair_out_y=90
        stair=1
        scroll_y_to=0
    }
    else if(player.pos[0]<2020 && player.pos[0]>1976 && player.pos[1]<200){
        stair_in_x=2015
        stair_in_y=109
        stair_out_x=2012
        stair_out_y=240
        stair=2
        scroll_y_to=600
    }
    else if(player.pos[0]<10  && player.pos[1]<200){
        stair_in_x=7
        stair_in_y=109
        stair_out_x=10
        stair_out_y=240
        stair=2
        scroll_y_to=600
    }
    else if(player.pos[0]>5 && player.pos[0]<40  && player.pos[1]>200){
        stair_in_x=37
        stair_in_y=259
        stair_out_x=-5
        stair_out_y=90
        scroll_y_to =0
        stair=1
    }
    else if(player.pos[0]>920 && player.pos[0]<970 && player.pos[1]>200){
        stair_in_x=952
        stair_in_y=259
        stair_out_x=902
        stair_out_y=390
        scroll_y_to =1206.22216796875
        stair=2
    }
    else stair=0;
    
    if(player.pos[0]>645 && player.pos[0]<764 && player.pos[1]==240){
        participant.name="Name: Joe Mama";
        participant.room="Room: 666";
        participant.caption="Just a feeling I've got\nLike something's about to happenBut I don't know whatIf that means what I think it meansWe're in trouble, big troubleAnd if he is as bananas as you sayI'm not taking any chancesYou are just what the doc ordered";
    }
    else{
        participant.caption="";
        participant.name="";
        participant.room="";
    } 

    
    cat1.sprite.update(dt)
    if(player.sprite_move_up._index>3 || player.sprite_move_down._index>3){ 
        player.pos = [stair_out_x,stair_out_y];
        player.move=0;
        player.sprite_move_up._index=0
        player.sprite_move_down._index=0 
        viewport.scrollTop= scroll_y_to
    }
    
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
    if(player.pos[1]<300)
    {
        if(player.pos[0] > 956 && player.pos[0]<1960) player.pos[0] = 956
        else if(player.pos[0] < 1980 && player.pos[0]>1000) player.pos[0] = 1980
    }

    // if(player.pos[1] < 0) {
    //     player.pos[1] = 0;
    // }
    // else if(player.pos[1] > canvas.height - player.sprite_idle.size[1]+15) {
    //     player.pos[1] = canvas.height - player.sprite_idle.size[1]+15;
    // }
}

// Draw everything
function render() {
    ctx2.clearRect(0,0,canvas.width,canvas.height);
    
    renderEntity(cat1);
    renderPlayer(player);
};

function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}

function renderEntity(entity) {
    ctx2.save();
    ctx2.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx2);
    ctx2.restore();
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
    if (entity.move<2) ctx2.translate(entity.pos[0], entity.pos[1]);
    else ctx2.translate(stair_in_x, stair_in_y);
    if (entity.move===1) entity.sprite_move_right.render(ctx2);
    else if (entity.move===-1) entity.sprite_move_left.render(ctx2)
    else if (entity.move===0) entity.sprite_idle.render(ctx2)
    else if (entity.move===2) entity.sprite_move_up.render(ctx2)
    else if (entity.move===3) entity.sprite_move_down.render(ctx2)
    //entity.sprite_idle.render(ctx)
    //console.log("move",entity.move)
    ctx2.restore();
}