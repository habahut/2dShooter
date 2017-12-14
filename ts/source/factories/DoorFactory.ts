import { DoorType } from '../enums/DoorType';
import { DoorState } from "../enums/DoorState";
import { Door } from "../interfaces/Door";
import { DoorStandard } from "../impl/DoorStandard";
import { Orientation } from "../enums/Orientation";


export class DoorFactory {
    public static MAX_STANDARD_DOOR_SIZE = .8;
    public static MIN_STANDARD_DOOR_SIZE = .4;

    private roomTileSize: number;

    constructor(roomTileSize: number) {
        this.roomTileSize = roomTileSize;
    }

    buildDoor(r1x: number, r1y: number, r2x: number, r2y: number, doorType: DoorType) : Door {
        //if (doorType == DoorType.STANDARD) {
            return this.buildStandardDoor(r1x, r1y, r2x, r2y);
        //}
    }

    // These needs to take the x and y coordinates instead of the room object,
    // because rooms can contain many coordinates. Want to allow the caller to specify
    // the coordinates of the door.
    buildStandardDoor(r1x: number, r1y: number, r2x: number, r2y: number) : Door {
        if (r1x == r2x && r1y == r2y) {
            throw Error("r1x == r2x && r1y == r2y!");
        }
        let doorLength = Math.random() 
                * (DoorFactory.MAX_STANDARD_DOOR_SIZE - DoorFactory.MIN_STANDARD_DOOR_SIZE)
                + DoorFactory.MIN_STANDARD_DOOR_SIZE,
            x, y;

        let orientation: Orientation;
        if (r1x == r2x) {
            orientation = Orientation.VERTICAL;
            y = Math.max(r1y, r2y) * this.roomTileSize;
            x = (r1x + (.5 * doorLength)) * this.roomTileSize;
        } else {
            orientation = Orientation.HORIZONTAL;
            x = Math.max(r1x, r2x) * this.roomTileSize;
            y = (r1y + (.5 * doorLength)) * this.roomTileSize;
        } 

        return new DoorStandard(x, y, r1x, r1y, r2x, r2y, doorLength, DoorState.CLOSED, orientation);
    }
}
