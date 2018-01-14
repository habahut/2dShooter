import { Point } from "../util/Point";
import { RoomScaledFactoryFactory } from "../factories/RoomScaledFactoryFactory";
import { Room } from '../interfaces/Room';
import { Door } from '../interfaces/Door';
import { DoorType } from '../enums/DoorType';
import { RoomType } from '../enums/RoomType';
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

/// we should have different "level generators", need this behind an interface
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


    
            // here we should expand some percentage of the seed rooms before
            // we do anything else to ensure we have at least a baseline of interesting spaces
            // in the level.

            // we also should store an Array<Room> that contains all the rooms we've expanded
            // so that we can add features to them.
            // We probably need a "interesting-a-fy" method for our rooms.

            // going to need Enums for every type of behavior: weapon types, utility items like health packs, enemy difficulty etc..

            //points: Array<Point> = temp["points"],
            world = new World(this.roomTileSize);
        //this.doors = temp["doors"];
        //this.doorMap = temp["doorMap"];



        return world;
    }

    mergeRooms() {

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
            let x = this.mersenneTwister.genrand_range(0, width),
                y = this.mersenneTwister.genrand_range(0, height);
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
