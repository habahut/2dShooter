import { DoorType } from '../enums/DoorType';
import { DoorState } from "../enums/DoorState";
import { Door } from "../interfaces/Door";
import { Window } from "../interfaces/Window";
import { DoorStandard } from "../impl/DoorStandard";
import { WindowStandard } from "../impl/WindowStandard";
import { WindowType } from "../enums/WindowType";
import { Orientation } from "../enums/Orientation";


export class WallObjectFactory {
    public static MAX_STANDARD_DOOR_SIZE = .8;
    public static MIN_STANDARD_DOOR_SIZE = .4;

    private roomTileSize: number;

    constructor(roomTileSize: number) {
        this.roomTileSize = roomTileSize;
    }

    // These needs to take the x and y coordinates instead of the room object,
    // because rooms can contain many coordinates. Want to allow the caller to specify
    // the coordinates of the door.
    buildDoor(r1x: number, r1y: number, r2x: number, r2y: number, doorType: DoorType) : Door {
        let wallObjectTuple: WallObjectTuple = this.calculateWallObjectCoords(r1x, r1y, r2x, r2y);
        //if (doorType == DoorType.STANDARD) {
            return this.buildStandardDoor(wallObjectTuple, r1x, r1y, r2x, r2y);
        //}
    }
    buildWindow(r1x: number, r1y: number, r2x: number, r2y: number, windowType: WindowType) : Window {
        let wallObjectTuple: WallObjectTuple = this.calculateWallObjectCoords(r1x, r1y, r2x, r2y);
        //if (doorType == DoorType.STANDARD) {
            return this.buildStandardWindow(wallObjectTuple, r1x, r1y, r2x, r2y);
        //}
    }

    calculateWallObjectCoords(r1x: number, r1y: number, r2x: number, r2y: number,
            length?: number) : WallObjectTuple {

        if (r1x == r2x && r1y == r2y) {
            throw Error("r1x == r2x && r1y == r2y!");
        }
        if (length === undefined) { 
            length = Math.random() 
                * (WallObjectFactory.MAX_STANDARD_DOOR_SIZE - WallObjectFactory.MIN_STANDARD_DOOR_SIZE)
                + WallObjectFactory.MIN_STANDARD_DOOR_SIZE;
        }
        let x, y, 
            orientation: Orientation;
        if (r1x == r2x) {
            orientation = Orientation.VERTICAL;
            y = Math.max(r1y, r2y) * this.roomTileSize;
            x = (r1x + (.5 * length)) * this.roomTileSize;
        } else {
            orientation = Orientation.HORIZONTAL;
            x = Math.max(r1x, r2x) * this.roomTileSize;
            y = (r1y + (.5 * length)) * this.roomTileSize;
        } 
        return new WallObjectTuple(x, y, length, orientation); 
    }

    buildStandardDoor(wallObjectTuple: WallObjectTuple, r1x: number,
            r1y: number, r2x: number, r2y: number) : Door {
        return new DoorStandard(wallObjectTuple.x, wallObjectTuple.y, r1x, r1y, r2x, r2y, 
            wallObjectTuple.length, DoorState.CLOSED, wallObjectTuple.orientation);
    }

    buildStandardWindow(wallObjectTuple: WallObjectTuple, r1x: number,
            r1y: number, r2x: number, r2y: number) : Window {
        return new WindowStandard(wallObjectTuple.x, wallObjectTuple.y, r1x, r1y, r2x, r2y, 
            wallObjectTuple.length, wallObjectTuple.orientation);
    }
}

// convenience tuple object for calculations in this class.
class WallObjectTuple {
    x: number;
    y: number;
    length: number;
    orientation: Orientation;

    constructor(x: number, y: number, length: number, orientation: number) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.orientation = orientation;
    }
}

