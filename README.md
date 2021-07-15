See tutorial.md for detailed explanation of sprite animation.

## Adding a room 

Adding a submission as a room, add the image in "canvas-viewport" div

<img id="subm-1" src="img/submission1.png"  width="200" height="100" \>

and arrange its position using css

```css
#subm-1{

    position: absolute;
    top:177px; right:0px;
    width:600px;
    height:400px;

}
```

#### Adding labels

After adding a room,
make sure to add the participant details,
in function `updateEntities(dt)`
possibly from line `272` theres a thread of if else statements
add the participant details like as shown

```js
else if(player.pos[0]>645 && player.pos[0]<764 && player.pos[1]==240){
        participant.name="Name: Joe Mama";
        participant.room="Room: 666";
        participant.caption="js go brr";
    }
```

to make things easy , if you press `e` console will print the player location.
go to the room edges and place your x coordinate range
in the else if statement along with corresponding y coordinate.

## Adding sprites

Add the spritesheet in /img directory.

create a variable in js/app.js as

```js
var cat = {
    pos: [2171,412],
    sprite: new Sprite('img/catlick.png', [0, 0], [32, 16],4,[0,1,2,3]),
}
```

Sprite takes in arguments:
arg0 : path to image
arg1: start point at the sprite-sheet (usually [0,0])
arg2: size of each frame ([width,height])
arg3: speed of animation (frames/sec)
arg4: frames order

add the following in  the function updateEntities() 

```js
cat.sprite.update(dt)
```

 it just tells to update the frame index each time.

and finally add `renderEntity(cat)` in the render() function.
so that the sprite is rendered on the canvas.

Note: Makesure to place renderPlayer() at the bottomost of the render() function.