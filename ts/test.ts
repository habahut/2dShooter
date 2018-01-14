import { WallFactory } from "./source/factories/WallFactory";
import { RoomFactory } from "./source/factories/RoomFactory";
import { WallObjectFactory } from "./source/factories/WallObjectFactory";
import { MersenneTwister } from "./source/util/MersenneTwister";
import { BlobPathGenerator } from "./source/levelGeneration/impl/BlobPathGenerator";
import { Edge } from "./source/util/Graph";
import { RoomPath } from "./source/levelGeneration/interfaces/PathGenerator";
import { Point } from "./source/util/Point";
import * as $ from "jquery";


debugger;
let 
    random = 5966339.226824012,
    //random = Math.random() * 12341325,
    wallFactory: WallFactory = new WallFactory(100),
    roomFactory: RoomFactory = new RoomFactory(100, wallFactory),
    wallObjectFactory: WallObjectFactory = new WallObjectFactory(100),
    mersenneTwister: MersenneTwister = new MersenneTwister(random),
    blobPathGenerator: BlobPathGenerator = new BlobPathGenerator(3, roomFactory, wallObjectFactory, mersenneTwister),
    p1: Point = new Point(mersenneTwister.genrand_range(1,9), mersenneTwister.genrand_range(1,9)),
    p2: Point = new Point(mersenneTwister.genrand_range(1,9), mersenneTwister.genrand_range(1,9)),
    //p1: Point = new Point(5, 3),
    //p2: Point = new Point(3, 4),
    edge: Edge = new Edge(p1, p2, 3);

console.log("random: " , random);

let roomPath: RoomPath = blobPathGenerator.roomWalk(edge);

let canvas: HTMLCanvasElement = <HTMLCanvasElement> $('#mainCanvas')[0],
    ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D> canvas.getContext("2d");

ctx.fillStyle = "white";
ctx.fillRect(0,0,1000,1000);

ctx.strokeStyle = "green";
ctx.lineWidth = 1;
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        ctx.beginPath();
        ctx.moveTo(i * 100, 0);
        ctx.lineTo(i * 100, 1000);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(0, i * 100);
        ctx.lineTo(1000, i * 100);
        ctx.stroke();
        ctx.closePath();
    }
}

ctx.strokeStyle = "red";
ctx.beginPath();
ctx.moveTo(p1.x * 100 + 50, p1.y * 100 + 50);
ctx.lineTo(p2.x * 100 + 50, p2.y * 100 + 50);
ctx.stroke();
ctx.closePath();

ctx.strokeStyle = "black";
ctx.fillStyle = "black";
ctx.lineWidth = 5;

for (let room of roomPath.rooms) {
    room.renderMinimap(ctx);
}

roomPath.lastDoor.renderMinimap(ctx);

debugger;
console.log(p1);
console.log(p2);
console.log("the path " + JSON.stringify(roomPath));

