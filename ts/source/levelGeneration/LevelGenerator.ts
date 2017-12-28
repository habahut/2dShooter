import { Point } from "../util/Point";
import { RoomScaledFactoryFactory } from "../factories/RoomScaledFactoryFactory";
import { Room } from '../interfaces/Room';
import { Door } from '../interfaces/Door';
import { DoorType } from '../enums/DoorType';
import { RoomFactory } from '../factories/RoomFactory';
import { WallObjectFactory } from '../factories/WallObjectFactory';
import { WallFactory } from "../factories/WallFactory";
import { World } from "../impl/World";
import { XYMap } from "../util/XYMap";
import { Random } from "../util/Random";
import { EdgeCollection } from "../util/Graph";
import { Graph } from "../util/Graph";
import { MinimumSpanningTreeBuilder } from "../util/MinimumSpanningTreeBuilder";
import { MersenneTwister } from "../util/MersenneTwister";

export class LevelGenerator {
    roomFactory: RoomFactory;
    wallFactory: WallFactory;
    wallObjectFactory: WallObjectFactory;
    roomTileSize: number;

    world: World;

    // The doors can be converted into a graph of inter-room movement for the AI.
    doors: Array<Door>;
    doorMap: XYMap;

    mersenneTwister: MersenneTwister;

    constructor(roomScaledFactoryFactory: RoomScaledFactoryFactory, numSeeds: number, height: number,
            width: number, mersenneTwister: MersenneTwister) {
        this.roomFactory = roomScaledFactoryFactory.getRoomFactory();
        this.wallFactory = roomScaledFactoryFactory.getWallFactory();
        this.wallObjectFactory = roomScaledFactoryFactory.getWallObjectFactory();
        this.roomTileSize = roomScaledFactoryFactory.roomTileSize;

        this.mersenneTwister = mersenneTwister;

        this.doors = [];
        this.doorMap = new XYMap();

        this.world = this.generateLevel(height, width, numSeeds);
    }

    /**
     * Does the heavy lifting of building the level.
     */
    generateLevel(height: number, width: number, numSeeds: number) : World {
        let seeds: Array<Point> = this.createSeededMap(height, width, numSeeds),
            minimumSpanningTree: Graph = MinimumSpanningTreeBuilder.build(seeds),
            world = new World(this.roomTileSize);

        return world;
    }


    /**
     * Given a collection of edges, this method turns the edges into a series of points,
     * which can later be turned into rooms. It ensures that there is a contiguous
     * line of rooms for each edge (smooth out diagonals into multiple rooms). It also returns
     * an array of door objects between each point.
     *
     * The list of doors returned here is the maximum number of doors necessary to connect
     * all the rooms created and make the map fully traversable. Later, when we epand various rooms,
     * we can remove some of these doors.
     *
     * Returns an object like this: {"points": Array<Point>, "doors": Array<Door>, "doorMap": XYMap}
     */
    pointWalk(edgeCollection: EdgeCollection) : any {
        let points: Array<Point> = [],
            // to prevent duplicates
            pointMap: XYMap = new XYMap(),
            doors: Array<Door> = [],
            doorMap: XYMap = new XYMap();

        for (let edge of edgeCollection.sortedEdges) {
            let destinationX = edge.p2.x,
                destinationY = edge.p2.y,
                x = edge.p1.x,
                y = edge.p1.y,
                nextX = x,
                nextY = y;
            while (true) {
                let point: Point = new Point(x, y);
                if (pointMap.get(x, y) == undefined) {
                    pointMap.set(x, y, point);
                    points.push(point);
                }

                if (point.equalsCoords(edge.p2)) break;

                let dx = edge.p2.x - x,
                    dy = edge.p2.y - y;
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0) nextX = x + 1;
                    else nextX = x - 1;
                } else { 
                    if (dy > 0) nextY = y + 1;
                    else nextY = y - 1;
                }

                let door: Door = this.wallObjectFactory.buildDoor(x, y, nextX, nextY, DoorType.STANDARD);
                doors.push(door);
                // set the door in both locations of the map, since we want it to be accessable from
                // either coordinate.
                doorMap.set(x, y, door);
                doorMap.set(nextX, nextY, door);

                x = nextX;
                y = nextY;
            }
        }

        return {"points": points, "doors": doors, "doorMap": doorMap};
    }

    /**
     * Creates an XYMap of the level with the given paramters.
     * Seeds the map with randomly selected room locations.
     * This only creates a single location for each room, with an ID number.
     * The room objects are actually built later.
     *
     * TODO: It would be cool to have different algorithms to distribute the rooms differently.
     */
    createSeededMap(height: number, width: number, numSeeds: number) : Array<Point> {
        let xyMap: XYMap = new XYMap(),
            points: Array<Point> = [],
            locs: number = 0;
        while(locs < numSeeds) {
            let x = Random.getInt(0, width),
                y = Random.getInt(0, height);
            if (xyMap.get(x, y) == undefined) {
                let point: Point = new Point(x, y, locs);
                xyMap.set(x, y, point);
                points.push(point);
                locs++;
            }
        }

        return points;
    }
    
}
