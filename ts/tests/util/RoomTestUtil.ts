import { Room } from "../../source/interfaces/Room";

export class RoomTestUtil {
    static compareRooms(room: Room, expectedRoom: Room) : boolean {
        if (room.pointMap.getPoints().length != expectedRoom.pointMap.getPoints().length) {
            return false;
        }

        if (!RoomTestUtil.verifyRoomContains(room, expectedRoom)) {
            return false;
        }

        if (room.doors.length != expectedRoom.doors.length) {
            return false;
        }

        for (let door of room.doors) {
            let found: boolean = false;
            for (let door2 of expectedRoom.doors) {
                if (door.equals(door2)) {
                    found = true;
                    break;
                }
            }
            if (!found) return false;
        }

        return true;
    }

    static verifyRoomContains(room: Room, expectedRoom: Room) : boolean {
        for (let point of room.pointMap.getPoints()) {
            if (expectedRoom.pointMap.get(point.x, point.y) == undefined) {
                return false;
            }
        }

        return true;
    }

    // Ensures that all rooms in one of these arrays are in the other and vice versa
    static verifyArrayOfRooms(rooms: Array<Room>, expectedRooms: Array<Room>) : boolean { 
        if (rooms.length != expectedRooms.length) {
            return false;
        }

        for (let room of rooms) {
            let found: boolean = false;
            for (let expectedRoom of rooms) {
                if (RoomTestUtil.compareRooms(room, expectedRoom)) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                return false;
            }
        }
        return true;
    }
}
