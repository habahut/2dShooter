// This Factory builds other factories that build objects scaled by room size
// i.e. Room, Door etc.
export class RoomScaledObjectFactoryFactory {
	roomTileSize: number;
	
    constructor(roomTileSize: number) {
        this.roomTileSize = roomTileSize;
    }
    buildRoomFactory() {
    }
    buildDoorFactory() {
    }
}

