import { XYMap } from "./XYMap";
import { Point } from "./Point";
import { Room } from "../interfaces/Room";

// Utility class for random stateless functions related to rooms
export class RoomUtils {

    // Returns the points in an XYMap, where each point referenced by the map
    // is a point in Room1, and its values are an array of points in Room2 that are connected
    // to that point.
    //
    // Left as points instead of walls assuming this may be refactored to something more generic
    static calculateEdgesBetweenRooms(room1: Room, room2: Room) : XYMap {
        let pointMap1: XYMap = room1.getPointMap(),
            pointMap2: XYMap = room2.getPointMap(),
            //connections: Array<Array<Point>> = [],
            connectionPoints: Array<Point> = [];
        
        // For each point in room1 that connects to room2, create a new point
        // with those connections as the value.
        for (let point of pointMap1.getPoints()) {
            let connections: Array<Point> = [];
            if (pointMap2.get(point.x + 1, point.y)) {
                connections.push(pointMap2.get(point.x + 1, point.y));
            }
            if (pointMap2.get(point.x - 1, point.y)) {
                connections.push(pointMap2.get(point.x - 1, point.y));
            }
            if (pointMap2.get(point.x, point.y + 1)) {
                connections.push(pointMap2.get(point.x, point.y + 1));
            }
            if (pointMap2.get(point.x, point.y - 1)) {
                connections.push(pointMap2.get(point.x, point.y - 1));
            }

            // Only create points with connections.
            if (connections.length > 0) {
                connectionPoints.push(new Point(point.x, point.y, connections));
            }
        }

        return new XYMap(connectionPoints);
    }
}
