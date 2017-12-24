import { RoomFactory } from "./RoomFactory";
import { WallFactory } from "./WallFactory";
import { WallObjectFactory } from "./WallObjectFactory";

// This Factory builds other factories that build objects scaled by room size
// i.e. Room, Door etc.
export class RoomScaledFactoryFactory {
    roomTileSize: number;
    wallFactory: WallFactory;
    roomFactory: RoomFactory;
    wallObjectFactory: WallObjectFactory;
	
    constructor(roomTileSize: number) {
        this.roomTileSize = roomTileSize;
        this.wallFactory = new WallFactory(this.roomTileSize);
        this.wallObjectFactory = new WallObjectFactory(this.roomTileSize);
        this.roomFactory = new RoomFactory(this.roomTileSize, this.wallFactory);
    }

    getRoomFactory() {
        return this.roomFactory;
    }

    getWallFactory() {
        return this.wallFactory;
    }

    getWallObjectFactory() {
        return this.wallObjectFactory;
    }

    getRoomTileSize() {
        return this.roomTileSize;
    }
}

