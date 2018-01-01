import { RoomPath } from "../../source/levelGeneration/interfaces/PathGenerator";
import { RoomTestUtil } from "../util/RoomTestUtil";

export class PathTestUtil {

    // TODO: this is dumb, there should be a comparable interface that these things can implement so i
    // don't have to keep writing this nonsense for every test.
    static verifyPath(path: RoomPath, expectedPath: RoomPath) {
        if (path.doors.length != expectedPath.doors.length || path.rooms.length != expectedPath.rooms.length) {
            return false;
        }

        for (let room of path.rooms) {
            let found: boolean = false;
            for (let expectedRoom of expectedPath.rooms) { 
                if (RoomTestUtil.compareRooms(room, expectedRoom)) {
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }

        for (let door of path.doors) {
            let found : boolean = false;
            for (let expectedDoor of expectedPath.doors) {
                if (door.equals(expectedDoor)) {
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }
        return true;
    }
}
