import { Point } from "../util/Point";
import { RoomScaledFactoryFactory } from "../factories/RoomScaledFactoryFactory";
import { Room } from '../interfaces/Room';
import { RoomFactory } from '../factories/RoomFactory';
import { WallObjectFactory } from '../factories/WallObjectFactory';
import { Door } from "../interfaces/Door";
import { DoorType } from "../enums/DoorType";
import { WallFactory } from "../factories/WallFactory";
import { World } from "../impl/World";
import { XYMap } from "../util/XYMap";
import { Random } from "../util/Random";
import { RandomGenerator } from "../util/Random";
import { Graph } from "../util/Graph";
import { EdgeCollection } from "../util/Graph";
import { MinimumSpanningTreeBuilder } from "../util/MinimumSpanningTreeBuilder";

export class LevelGenerator {
    roomFactory: RoomFactory;
    wallFactory: WallFactory;
    wallObjectFactory: WallObjectFactory;
    roomTileSize: number;

    doorMap: XYMap;
    doors: Array<Door>;

    world: World;

    // this should take a random number (or set of random numbers), and make all
    // decisions based on them, instead of doing any randomness in it.
    // Given the same input the same map should be produced, so we can run integration tests
    // like that.
    constructor(roomScaledFactoryFactory: RoomScaledFactoryFactory, numSeeds: number, height: number,
            width: number, randomGenerator: RandomGenerator) {
        this.roomFactory = roomScaledFactoryFactory.getRoomFactory();
        this.wallFactory = roomScaledFactoryFactory.getWallFactory();
        this.wallObjectFactory = roomScaledFactoryFactory.getWallObjectFactory();
        this.roomTileSize = roomScaledFactoryFactory.roomTileSize;

        this.world = this.generateLevel(height, width, numSeeds);

        this.doors = [];
        this.doorMap = new XYMap();
    }

    /**
     * Does the heavy lifting of building the level.
     */
    generateLevel(height: number, width: number, numSeeds: number) : World {
        let points: Array<Point> = this.createSeededPointArray(height, width, numSeeds),
            minimumSpanningTree: Graph = MinimumSpanningTreeBuilder.build(points),
            connectedPoints: Array<Point> = this.roomWalk(minimumSpanningTree);



        let world: World = new World(this.roomTileSize);
        return world;
        
    }

    // need to build an encounter generator. the game judges teh level of tension
    // the player is experiencing and ratchets it up sometimes

    //// This needs to build both the points and also the doors between them. When I go
    // to expand the rooms later, all doors MUST remain as valid pathways between rooms,
    // unless both sides of the door is in the same room. In which case the door can be removed.
    /**
     * Walks the edges in the graph, creating a continuous series of points connecting them all.
     * The points returned will not have any gaps (diagonal slants will be filled in so every room
     * connects on a horizontal or vertical edge).
     */
    roomWalk(graph: Graph) : Array<Point> {
        debugger;
        let edges: EdgeCollection = graph.edgeCollection,
            points: Array<Point> = [],
            // for preventing duplicate points
            usedPoints = new XYMap();
        for (let edge of edges.edges) {
            let x = edge.p1.x,
                y = edge.p1.y,
                destinationX = edge.p2.x,
                destinationY = edge.p2.y;

            while (true) {
                if (x == destinationX && y == destinationY) break;

                if (usedPoints.get(x, y) == undefined) {
                    let point: Point = new Point(x, y);
                    usedPoints.set(x, y, point);
                    points.push(point);
                }

                let dx = x - destinationX,
                    dy = y - destinationY,
                    newX, newY;
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0) newX = x + 1;
                    else newX = x - 1;
                } else {
                    if (dy > 0) newY = y + 1;
                    else newY = y - 1;
                }

                // need to store these in a structure where we can easily find them again.
                let door: Door = this.wallObjectFactory.buildDoor(x, y, newX, newY, DoorType.STANDARD);
                this.doorMap.set(x, y, new Point(x, y, door));
                this.doorMap.set(newX, newY, new Point(newX, newY, door));
            }
        }

        return points;
    }

    /**
     * Creates an XYMap of the level with the given paramters.
     * Seeds the map with randomly selected room locations.
     * This only creates a single location for each room, with an ID number.
     * The room objects are actually built later.
     *
     * TODO: It would be cool to have different algorithms to distribute the rooms differently.
     */
    createSeededPointArray(height: number, width: number, numSeeds: number) : Array<Point> {
        let xyMap = new XYMap(),
            locs = 0,
            points: Array<Point> = [];
        while(points.length < numSeeds) {
            let x = Random.getInt(0, width),
                y = Random.getInt(0, height);
            if (xyMap.get(x, y) == undefined) {
                let point: Point = new Point(x, y, locs);
                xyMap.set(x, y, point);
                points.push(point);
            }
        }

        return points;
    }
}

