import { Room } from "../../source/interfaces/Room";

export class RoomTestUtil {
    static compareRooms(room1: Room, room2: Room) {
        if (room1.pointMap.getPoints().length != room2.pointMap.getPoints().length) {
            return false;
        }

        for (let point of room1.pointMap.getPoints()) {
            if (room2.pointMap.get(point.x, point.y) == undefined) {
                return false;
            }
        }

        /*
         *Doors not done yet, see note in RoomStandard
         *
        if (room1.doors.length != room2.doors.length) {
            return false;
        }

        for (let door of room1.doors) {
            let found: boolean = false;
            for (let door2 of room2.doors) {
                if (door.equals(door2)) {
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }
        */

        return true;
    }
}
