import { WallFactory } from "./source/factories/WallFactory";
import { RoomFactory } from "./source/factories/RoomFactory";
import { WallObjectFactory } from "./source/factories/WallObjectFactory";
import { MersenneTwister } from "./source/util/MersenneTwister";
import { BlobPathGenerator } from "./source/levelGeneration/impl/BlobPathGenerator";
import { Edge } from "./source/util/Graph";
import { RoomPath } from "./source/levelGeneration/interfaces/PathGenerator";
import { Point } from "./source/util/Point";
import * as $ from "jquery";
import { World } from "./source/impl/World";
import { RoomScaledFactoryFactory } from "./source/factories/RoomScaledFactoryFactory";
import { LevelGenerator } from "./source/levelGeneration/LevelGenerator";


debugger;
let 
    //random = 7386327.913468098,
    random = Math.random() * 12341325,
    mersenneTwister: MersenneTwister = new MersenneTwister(random),
    /*
    wallFactory: WallFactory = new WallFactory(100),
    roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
    wallObjectFactory: WallObjectFactory = new WallObjectFactory(100),
    blobPathGenerator: BlobPathGenerator = new BlobPathGenerator(3, roomFactory, wallObjectFactory, mersenneTwister),
    p1: Point = new Point(mersenneTwister.genrand_range(1,9), mersenneTwister.genrand_range(1,9)),
    p2: Point = new Point(mersenneTwister.genrand_range(1,9), mersenneTwister.genrand_range(1,9)),
    //p1: Point = new Point(5, 3),
    //p2: Point = new Point(3, 4),
    edge: Edge = new Edge(p1, p2, 3),
    */
    
    roomTileSize: number = 50,
    roomScaledFactoryFactory: RoomScaledFactoryFactory = new RoomScaledFactoryFactory(roomTileSize),
    height: number = 20,
    width: number = 20,
    numSeeds: number = 13,
    levelGenerator: LevelGenerator = new LevelGenerator(roomScaledFactoryFactory, numSeeds, height, width, mersenneTwister);

console.log("random: " , random);

//let roomPath: RoomPath = blobPathGenerator.roomWalk(edge);

let canvas: HTMLCanvasElement = <HTMLCanvasElement> $('#mainCanvas')[0],
    ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D> canvas.getContext("2d");

// initialize canvas with white background and green grid
ctx.fillStyle = "white";
ctx.fillRect(0,0,1000,1000);

ctx.strokeStyle = "green";
ctx.lineWidth = 1;
ctx.font = "30px Arial";
for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
        // lol
        ctx.fillText(i + "", 5, i + .5 * roomTileSize);
        ctx.beginPath();
        ctx.moveTo(i * roomTileSize, 0);
        ctx.lineTo(i * roomTileSize, 1000);
        ctx.stroke();
        ctx.closePath();

        ctx.fillText(j + "", j + .5 * roomTileSize, 5);
        ctx.beginPath();
        ctx.moveTo(0, i * roomTileSize);
        ctx.lineTo(1000, i * roomTileSize);
        ctx.stroke();
        ctx.closePath();
    }
}

/*
ctx.strokeStyle = "red";
ctx.beginPath();
ctx.moveTo(p1.x * 100 + 50, p1.y * 100 + 50);
ctx.lineTo(p2.x * 100 + 50, p2.y * 100 + 50);
ctx.stroke();
ctx.closePath();
*/

ctx.strokeStyle = "black";
ctx.fillStyle = "black";
ctx.lineWidth = 5;


let world: World = levelGenerator.generateLevel();
debugger;
for (let room of world.rooms) {
    room.renderMinimap(ctx);
    let x = 5;
}

/*
for (let room of roomPath.rooms) {
    room.renderMinimap(ctx);
}

roomPath.lastDoor.renderMinimap(ctx);
*/

debugger;
/*
console.log(p1);
console.log(p2);
console.log("the path " + JSON.stringify(roomPath));
*/






// TODO: there is some problem with one of the edges of the path.
// not if its a problem with the blob path or what...
