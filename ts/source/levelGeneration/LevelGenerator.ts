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
import { PathGenerator, RoomPath } from "./interfaces/PathGenerator";
import { HallwayGenerator } from "./impl/HallwayGenerator";
import { BlobPathGenerator } from "./impl/BlobPathGenerator";

/// we should have different "level generators", need this behind an interface
export class LevelGenerator {

    roomFactory: RoomFactory;
    wallFactory: WallFactory;
    wallObjectFactory: WallObjectFactory;
    roomTileSize: number;

    width: number;
    height: number;
    numSeeds: number;

    world: World;

    // The doors can be converted into a graph of inter-room movement for the AI.
    doors: Array<Door>;
    doorMap: XYMap;

    mersenneTwister: MersenneTwister;

    pathGeneratorMap: Map<string, PathGenerator>;

    constructor(roomScaledFactoryFactory: RoomScaledFactoryFactory, numSeeds: number, height: number,
            width: number, mersenneTwister: MersenneTwister) {
        this.roomFactory = roomScaledFactoryFactory.getRoomFactory();
        this.wallFactory = roomScaledFactoryFactory.getWallFactory();
        this.wallObjectFactory = roomScaledFactoryFactory.getWallObjectFactory();
        this.roomTileSize = roomScaledFactoryFactory.roomTileSize;

        this.width = width;
        this.height = height;
        this.numSeeds = numSeeds;

        this.mersenneTwister = mersenneTwister;

        this.doors = [];
        this.doorMap = new XYMap();

        // TODO: this should be passed in probably
        this.pathGeneratorMap = new Map<string, PathGenerator>();
        this.pathGeneratorMap.set("hallways", new HallwayGenerator(5, 2, this.roomFactory, this.wallObjectFactory));
        this.pathGeneratorMap.set("blobs", new BlobPathGenerator(7, this.roomFactory, this.wallObjectFactory, this.mersenneTwister));
    }

    /**
     * Does the heavy lifting of building the level.
     */
    generateLevel() : World {
        let seeds: Array<Point> = this.createSeededMap(this.height, this.width, this.numSeeds),
            minimumSpanningTree: Graph = MinimumSpanningTreeBuilder.build(seeds);

        // seededRooms are the origins and destination of each edge.
        let seededRooms: XYMap = new XYMap(),
            roomPaths: Array<RoomPath> = [];
        for (let edge of minimumSpanningTree.edgeCollection.sortedEdges) {
            // We will need something here for where we want to include special
            // pre created rooms in the map
            //
            // we may also be better served with adding these special rooms after the fact
            // as an add on to the level...

            let snag: Point = new Point(2, 2);
            if (edge.p1.equals(snag) || edge.p2.equals(snag)) {
                debugger;
            }


            // TODO: we should extract this to a separate function for unit testing
            // to ensure that the doors are correctly added and such.
            let roomPath: RoomPath = this.selectPathGenerator().roomWalk(edge),
                firstRoom: Room = seededRooms.get(edge.p1.x, edge.p1.y),
                lastRoom: Room = seededRooms.get(edge.p2.x, edge.p2.y);

            // TODO: this should be extracted to its own method so it can handle
            // more complicated seeding of larger rooms...
            if (firstRoom == undefined) {
                firstRoom = this.roomFactory.buildRoom([edge.p1], RoomType.STANDARD);
                seededRooms.set(edge.p1.x, edge.p1.y, firstRoom);
            }
            firstRoom.addDoor(roomPath.firstDoor);
            if (lastRoom == undefined) {
                lastRoom = this.roomFactory.buildRoom([edge.p2], RoomType.STANDARD);
                seededRooms.set(edge.p2.x, edge.p2.y, lastRoom);
            }
            lastRoom.addDoor(roomPath.lastDoor);
            roomPaths.push(roomPath);
        }
        let rooms: Array<Room> = this.collectRooms(roomPaths, seededRooms.values());

        let world = new World(this.roomTileSize, rooms);
        return world;
    }

    selectPathGenerator() : PathGenerator {
        // TOOD: this should actually make some decision based on the mix passed in.
        if (this.mersenneTwister.genrand_range(0,10) > 5) {
            return <PathGenerator> this.pathGeneratorMap.get("blobs");
        }
        return <PathGenerator> this.pathGeneratorMap.get("hallways");
    }

    /**
     * Collects all rooms from the RoomPaths and seededrooms into one array of all rooms.
     * Handles rooms that overlap.
     * Assumes that all seededRooms do not overlap.
     */
    collectRooms(roomPaths: Array<RoomPath>, seededRooms: Array<Room>) : Array<Room> {
        let roomMap: Map<string, Room> = new Map<string, Room>(),
            pointMap: XYMap = new XYMap();

        for (let room of seededRooms) {
            this.insertRoom(room, pointMap);
            roomMap.set(room.id, room);
        }
        for (let roomPath of roomPaths) {
            for (let room of roomPath.rooms) {
                let overlappingRooms: Array<Room> = this.findOverlappingRooms(room, pointMap),
                    resultingRooms: Array<Room> = [];

                // If we have any rooms overlapping with this one, merge this room plus the overlappers
                if (overlappingRooms.length > 0) {
                    // delete the rooms that were overlapping, they will be merged or splitted into
                    // new rooms and readded below.
                    for (let overlappingRoom of overlappingRooms) {
                        roomMap.delete(overlappingRoom.id);
                    }

                    // TODO: choose between merging and splitting.
                    // default to merge for now.
                    resultingRooms = this.mergeOverlappingRooms(overlappingRooms);
                } else {
                    resultingRooms.push(room);
                }

                for (let room of resultingRooms) {
                    this.insertRoom(room, pointMap);
                    roomMap.set(room.id, room);
                }
            }
        }
        return Array.from(roomMap.values());
    }

    /** 
     * iterate over the points and see if there is any overlap with 
     * any rooms we've already registered in our pointMap.
     */
    findOverlappingRooms(room: Room, pointMap: XYMap) : Array<Room> {
        // we want a map here to remove duplicates automatically.
        // String key is the roomId.
        let overlappingRoomMap: Map<string, Room> = new Map<string, Room>();
        for (let point of room.getPointMap().getPoints()) {
            let existingRoom: Room | undefined = pointMap.get(point.x, point.y); 
            if (existingRoom != undefined) {
                overlappingRoomMap.set(existingRoom.id, existingRoom);
            }
        }

        let overlappingRooms = Array.from(overlappingRoomMap.values());
        if (overlappingRooms.length > 0) {
            overlappingRooms.push(room);
        }
        return overlappingRooms;
    }

    insertRoom(room: Room, pointMap: XYMap) : void {
        for (let point of room.getPointMap().getPoints()) {
            pointMap.set(point.x, point.y, room);
        }
    }

    /*
     * It might be easier to split up giant rooms in a final pass later. Just merge everyything now,
     * and then potentially split up large rooms once everything is merged.
     *
     * this might be tricky though.
     */
    // 2 possibilities here. We can combine these rooms, or we can seperate them, as long as we ensure there
    // is a door between the separated rooms.
    // Will also need to ensrue all the doors already present in this room are preserved.
    splitOverlappingRooms(rooms: Array<Room>): Array<Room> {
        return [];
    }

    // Always merges the rooms into one single room. However, to make it easier to use with the 
    // splitOverlappingRooms possibility, it will return an Array<Room> with one entry.
    // TODO: this could be a good spot to add internal walls to rooms.
    mergeOverlappingRooms(overlappingRooms: Array<Room>): Array<Room> {
        let points: Array<Point> = [],
            doors: Array<Door> = [];
        for (let overlappingRoom of overlappingRooms) {
            points = points.concat(overlappingRoom.getPointMap().getPoints());
            doors = doors.concat(overlappingRoom.doors);
        }

        let room: Room = this.roomFactory.buildRoom(points, RoomType.STANDARD);

        // need to cull doors that no longer make sense, and maintain doors that need to be maintained.
        // if both sides of the door are in the room, then remove it. Otherwise, add it to the room.
        // We don't need to worry about adding the same door twice, becuase if both sides were in rooms that
        // were merged then it will be removed as redundant.
        for (let door of doors) {
            if (! (room.getPointMap().get(door.room1x, door.room1y) != undefined 
                    && room.getPointMap().get(door.room2x, door.room2y) != undefined)) {
                room.addDoor(door);
            }
        }

        return [room];
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
