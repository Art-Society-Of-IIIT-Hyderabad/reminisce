
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

function mobileRight(){
    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: "RIGHT",
        keyCode: 39,
        code: "RIGHT",
    }));
}
function mobileLeft(){
    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: "ArrowLeft",
        keyCode: 37,
        code: "ArrowLeft",
    }));
}
function mobileUp(){
    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: "ArrowUp",
        keyCode: 38,
        code: "ArrowUp",
    }));
}
function mobileDown(){
    document.dispatchEvent(new KeyboardEvent('keydown', {
        key: "ArrowDown",
        keyCode: 40,
        code: "ArrowDown",
    }));
}
function stopMobileMovement(){
    document.dispatchEvent(new KeyboardEvent('keyup', {
      key: "RIGHT",
      keyCode: 39,
      code: "RIGHT",
    }));
    document.dispatchEvent(new KeyboardEvent('keyup', {
        key: "ArrowLeft",
        keyCode: 37,
        code: "ArrowLeft",
    }));
    document.dispatchEvent(new KeyboardEvent('keyup', {
        key: "ArrowUp",
        keyCode: 38,
        code: "ArrowUp",
    }));
    document.dispatchEvent(new KeyboardEvent('keyup', {
        key: "ArrowDown",
        keyCode: 40,
        code: "ArrowDown",
    }));
  }

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
    document.getElementById("mobile-up").addEventListener("click", mobileUp);
    document.getElementById("mobile-down").addEventListener("click", mobileDown);
    document.getElementById("stopMobileMovement").addEventListener("click", stopMobileMovement);
    document.getElementById("mobile-right").addEventListener("click", mobileRight);
    document.getElementById("mobile-left").addEventListener("click", mobileLeft);
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
var playerSpeed = 400; //orginal
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
        participant.name="Name: Harshita Gupta";
        participant.room="Room: 101";
        participant.caption="And the empty rooms hold many memories ";
    }
    else if (player.pos[0]>318 && player.pos[0]<460 && player.pos[1]==240){
        participant.name="Name:  Anjali Singh";
        participant.room="Room: 102";
        participant.caption="What if you get a horrifying roommate who makes you feel your acads a bit less scary but eventually you find her fun (maybe this turns out a fantasy)";
    } 
    else if (player.pos[0]>111 && player.pos[0]<243 && player.pos[1]==90)
    {
        participant.name="Name: Pavani Chowdhary";
        participant.room="Room: 305";
        participant.caption="From me getting scared by my roommate's 4 ft tall teddy in the dark on my first day to having 5 people crammed into the room desperately trying to finish assignments, this room has witnessed a lot";
    }
    else if (player.pos[0]>333 && player.pos[0]<460 && player.pos[1]==90)
    {
        participant.name="Name: Tanvi Narsapur";
        participant.room="Room: 314";
        participant.caption="Group mei assignments karneka perfect adda ";
    }
    else if (player.pos[0]>529 && player.pos[0]<665 && player.pos[1]==90)
    {
        participant.name="Name: Ahana Datta";
        participant.room="Room: 416";
        participant.caption="😭";
    }
    else if (player.pos[0]>-10 && player.pos[0]<990 && player.pos[1]==390)
    {
        participant.name="PARIJAAT FLOOR 0";
        participant.room="";
        participant.caption="";
    }
    else if (player.pos[0]>-10 && player.pos[0]<990 && player.pos[1]==240)
    {
        participant.name="PARIJAAT FLOOR 1";
        participant.room="";
        participant.caption="";
    }
    else if (player.pos[0]>-10 && player.pos[0]<990 && player.pos[1]==90)
    {
        participant.name="PARIJAAT FLOOR 2";
        participant.room="";
        participant.caption="";
    }
    else if (player.pos[0]>1635 && player.pos[0]<1836 && player.pos[1]==390)
    {
        participant.name="JC";
        participant.room="";
        participant.caption="";
    }
    else if (player.pos[0]>2741 && player.pos[0]<2886 && player.pos[1]==390)
    {
        participant.name="Name: Rohan Lahane";
        participant.room="Room: 343";
        participant.caption="";
    }
    else if (player.pos[0]>3111 && player.pos[0]<3255 && player.pos[1]==390)
    {
        participant.name="Name: CYK Sagar";
        participant.room="Room: 102";
        participant.caption="";
    }
    else if (player.pos[0]>3495 && player.pos[0]<3640 && player.pos[1]==390)
    {
        participant.name="Name: Rohan Lahane";
        participant.room="Room : 303";
        participant.caption="";
    }
    else if (player.pos[0]>3446 && player.pos[0]<3598 && player.pos[1]==240)
    {
        participant.name="Name: Parth Maradia";
        participant.room="Room: 201";
        participant.caption="";
        
    }
    else if (player.pos[0]>3160 && player.pos[0]<3286 && player.pos[1]==240)
    {
        participant.name="Name: Parth Maradia";
        participant.room="Room: 202";
        participant.caption="A room full of adventures";
    }
    else if (player.pos[0]>2854 && player.pos[0]<3006 && player.pos[1]==240)
    {
        participant.name="Name: CYK Sagar";
        participant.room="Room: 203";
        participant.caption="Gaming Nights!!!";
    }
    else if (player.pos[0]>2504 && player.pos[0]<2639 && player.pos[1]==240)
    {
        participant.name="Name: Palash Sharma";
        participant.room="Room: 261";
        participant.caption="One of my friends (Bhavya) would always sleep on my bed at random times in random poses and we would take funny pictures of his. There are sleeping pics of all friends in our group in wierdest of poses";
    }
    else if (player.pos[0]>2129 && player.pos[0]<2262 && player.pos[1]==240)
    {
        participant.name="Name: Pothula Venkat";
        participant.room="Room: 105";
        participant.caption="";
    }
    else if (player.pos[0]>2421 && player.pos[0]<2556 && player.pos[1]==90)
    {
        participant.name="Name: CYK sagar";
        participant.room="Room: 106";
        participant.caption="";
    }
    else if (player.pos[0]>2737 && player.pos[0]<2871 && player.pos[1]==90)
    {
        participant.name="Name: Sanyam Shah";
        participant.room="Room: 304";
        participant.caption="Dorm room and lit fam ;)";
    }
    else if (player.pos[0]>3093 && player.pos[0]<3200 && player.pos[1]==90)
    {
        participant.name="Name: Nikhil Agarwal";
        participant.room="Room: 303";
        participant.caption="A cozy place which I'll call my home , where I am going to have a lot of fun and where tons of my memories are gonna live. --- my hostel room";
    }
    else if (player.pos[0]>3381 && player.pos[0]<3516 && player.pos[1]==90)
    {
        participant.name="Name: Siddarth Pavan";
        participant.room="Room: 124";
        participant.caption="Staying up late in the night with the bois and watching movies. Used to sweep and clean the room if no sweeper shows up by the end of the month. Has a bad habit of locking up the door always.";
    }
    else if (player.pos[0]>3688 && player.pos[0]<3803 && player.pos[1]==90)
    {
        participant.name="Name: CYK sagar";
        participant.room="Room: 301";
        participant.caption="";
    }

    else if (player.pos[0]>1979 && player.pos[0]<3995 && player.pos[1]==390)
    {
        participant.name="BAKUL FLOOR 0";
        participant.room="";
        participant.caption="";
    }
    else if (player.pos[0]>1979 && player.pos[0]<3995 && player.pos[1]==240)
    {
        participant.name="BAKUL FLOOR 1";
        participant.room="";
        participant.caption="";
    }
    else if (player.pos[0]>1979 && player.pos[0]<3995 && player.pos[1]==90)
    {
        participant.name="BAKUL FLOOR 2";
        participant.room="";
        participant.caption="";
    }
    else{
        participant.name="";
        participant.room="";
        participant.caption="";

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
