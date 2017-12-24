import { Point } from "../util/Point";
import { RoomScaledFactoryFactory } from "../factories/RoomScaledFactoryFactory";
import { Room } from '../interfaces/Room';
import { RoomFactory } from '../factories/RoomFactory';
import { WallObjectFactory } from '../factories/WallObjectFactory';
import { WallFactory } from "../factories/WallFactory";
import { World } from "../impl/World";
import { XYMap } from "../util/XYMap";
import { Random } from "../util/Random";

export class LevelGenerator {
    roomFactory: RoomFactory;
    wallFactory: WallFactory;
    wallObjectFactory: WallObjectFactory;
    roomTileSize: number;

    world: World;

    constructor(roomScaledFactoryFactory: RoomScaledFactoryFactory, numSeeds: number, height: number,
            width: number) {
        this.roomFactory = roomScaledFactoryFactory.getRoomFactory();
        this.wallFactory = roomScaledFactoryFactory.getWallFactory();
        this.wallObjectFactory = roomScaledFactoryFactory.getWallObjectFactory();
        this.roomTileSize = roomScaledFactoryFactory.roomTileSize;

        this.world = this.generateLevel(height, width, numSeeds);
    }

    /**
     * Does the heavy lifting of building the level.
     */
    generateLevel(height: number, width: number, numSeeds: number) : World {
        let xyMap = this.createSeededMap(height, width, numSeeds),
            world = new World(this.roomTileSize);


        return world;
        
    }

    /**
     * Creates an XYMap of the level with the given paramters.
     * Seeds the map with randomly selected room locations.
     * This only creates a single location for each room, with an ID number.
     * The room objects are actually built later.
     *
     * TODO: It would be cool to have different algorithms to distribute the rooms differently.
     */
    createSeededMap(height: number, width: number, numSeeds: number) : void {
        let xyMap = new XYMap(),
            locs = 0;
        while(locs < numSeeds) {
            let x = Random.getInt(0, width),
                y = Random.getInt(0, height);
            if (xyMap.get(x, y) == undefined) {
                let point: Point = new Point(x, y, locs);
                xyMap.set(x, y, point);
                locs++;
            }
        }
    }
    
}
