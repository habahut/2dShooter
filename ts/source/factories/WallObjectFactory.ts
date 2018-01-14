import { DoorType } from '../enums/DoorType';
import { DoorState } from "../enums/DoorState";
import { Door } from "../interfaces/Door";
import { Window } from "../interfaces/Window";
import { DoorStandard } from "../impl/DoorStandard";
import { WindowStandard } from "../impl/WindowStandard";
import { WindowType } from "../enums/WindowType";
import { Orientation } from "../enums/Orientation";


export class WallObjectFactory {
    public static MAX_STANDARD_DOOR_SIZE_PERCENT = .8;
    public static MIN_STANDARD_DOOR_SIZE_PERCENT = .4;

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
            lengthPercent?: number) : WallObjectTuple {

        if (r1x == r2x && r1y == r2y) {
            throw Error("r1x == r2x && r1y == r2y!");
        }
        if (lengthPercent === undefined) { 
            // TODO: refactor to util method
            lengthPercent = Math.random() 
                * (WallObjectFactory.MAX_STANDARD_DOOR_SIZE_PERCENT - WallObjectFactory.MIN_STANDARD_DOOR_SIZE_PERCENT)
                + WallObjectFactory.MIN_STANDARD_DOOR_SIZE_PERCENT;
        }
        let border = ((1 - lengthPercent) * this.roomTileSize) / 2,
            length = this.roomTileSize * lengthPercent,
            x1: number, 
            y1: number,
            x2: number,
            y2: number,
            orientation: Orientation;
        if (r1x == r2x) {
            orientation = Orientation.VERTICAL;
            y1 = Math.max(r1y, r2y) * this.roomTileSize;
            x1 = r1x * this.roomTileSize + border;
            x2 = x1 + length;
            y2 = y1;
        } else {
            orientation = Orientation.HORIZONTAL;
            x1 = Math.max(r1x, r2x) * this.roomTileSize;
            y1 = r1y * this.roomTileSize + border;
            y2 = y1 + length;
            x2 = x1;
        } 
        return new WallObjectTuple(x1, y1, x2, y2, length, orientation); 
    }

    buildStandardDoor(wallObjectTuple: WallObjectTuple, r1x: number,
            r1y: number, r2x: number, r2y: number) : Door {
        return new DoorStandard(wallObjectTuple.x1, wallObjectTuple.y1, wallObjectTuple.x2, wallObjectTuple.y2, r1x, r1y, r2x, r2y, 
            wallObjectTuple.length, DoorState.CLOSED, wallObjectTuple.orientation);
    }

    buildStandardWindow(wallObjectTuple: WallObjectTuple, r1x: number,
            r1y: number, r2x: number, r2y: number) : Window {
        return new WindowStandard(wallObjectTuple.x1, wallObjectTuple.y1, wallObjectTuple.x2, wallObjectTuple.y2, r1x, r1y, r2x, r2y, 
            wallObjectTuple.length, wallObjectTuple.orientation);
    }
}

// convenience tuple object for calculations in this class.
class WallObjectTuple {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    length: number;
    orientation: Orientation;

    constructor(x1: number, y1: number, x2: number, y2: number, length: number, orientation: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.length = length;
        this.orientation = orientation;
    }
}

