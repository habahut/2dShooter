import { WallType } from "../enums/WallType";
import { WallStandard } from "../impl/WallStandard";
import { Orientation } from "../enums/Orientation";
import { Wall } from "../interfaces/Wall";

export class WallFactory {
    public static STANDARD_WALL_THICKNESS = 10;
    private roomTileSize: number;
    constructor(roomTileSize: number) {
        this.roomTileSize = roomTileSize;
    }

    // Builds walls from the top left corner of the point given. For (1,1)
    // horizontal wall with coords (1,1) created shown as X's, 
    // (1,1) vertical wall created shown as Y's
    //    0   1   2
    //  0   |   |   |
    //    --XXXXX--
    //  1   Y   |   |
    //    ----------
    //  2   |   |   |
    //    ----------
    buildWall(x: number, y: number, orientation: Orientation, wallType: WallType) : Wall {
        //if (wallType == WallType.STANDARD) {
            return this.buildStandardWall(x, y, orientation);
        //}
    }

    buildStandardWall(x: number, y: number, orientation: Orientation) : Wall {
        if (orientation == Orientation.VERTICAL) {
            return new WallStandard(x * this.roomTileSize, y * this.roomTileSize,
                x * this.roomTileSize, (y + 1) * this.roomTileSize, 
                WallFactory.STANDARD_WALL_THICKNESS, orientation);
        } else {
            return new WallStandard(x * this.roomTileSize, y * this.roomTileSize,
                (x + 1) * this.roomTileSize, y * this.roomTileSize, 
                WallFactory.STANDARD_WALL_THICKNESS, orientation);
        }
    }
}
