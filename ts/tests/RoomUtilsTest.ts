import { RoomFactory } from "../source/factories/RoomFactory";
import { RoomType } from "../source/enums/RoomType";
import { Wall } from "../source/interfaces/Wall";
import { Point } from "../source/util/Point";
import { WallFactory } from "../source/factories/WallFactory";
import { RoomUtils } from "../source/util/RoomUtils";
import { XYMap } from "../source/util/XYMap";

import {} from "jasmine";
import { expect } from "chai";


describe("RoomUtils Tests", () => {
    it("correct edge calculation between basic rooms", () => {
        let points1 = [new Point(5, 5)],
            points2 = [new Point(5, 6)],
            wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            room1 = roomFactory.buildRoom(points1, RoomType.STANDARD),
            room2 = roomFactory.buildRoom(points2, RoomType.STANDARD),
            edges = RoomUtils.calculateEdgesBetweenRooms(room1, room2);
        
        let expectedPoint = new Point(5, 5, [new Point(5, 6)]),
            expectedEdges = new XYMap([expectedPoint]);

        expect(verifyConnections(edges, expectedEdges)).to.equal(true);
    });
    it("correct edge calculation between basic room and complex room", () => {
        let points1 = [new Point(5, 5)],
            points2 = [new Point(5, 6), new Point(6, 5), new Point(5, 7), new Point(4,6)],
            wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            room1 = roomFactory.buildRoom(points1, RoomType.STANDARD),
            room2 = roomFactory.buildRoom(points2, RoomType.STANDARD),
            edges = RoomUtils.calculateEdgesBetweenRooms(room1, room2);

        let expectedPoint = new Point(5, 5, [new Point(5, 6), new Point(6, 5)]),
            expectedEdges = new XYMap([expectedPoint]);

        expect(verifyConnections(edges, expectedEdges)).to.equal(true);
    }),
    it("correct edge calculation between 2 complex rooms", () => {
        let points1 = [new Point(5, 5), new Point(5, 6), new Point(6, 5),
                        new Point(6, 4), new Point(7, 4), new Point(8, 4),
                        new Point(8, 5)],
            points2 = [new Point(7, 5), new Point(6, 6), new Point(7, 6), new Point(5, 7),
                        new Point(6, 7), new Point(8, 7)],
            wallFactory = new WallFactory(100),
            roomFactory = new RoomFactory(100, wallFactory),
            room1 = roomFactory.buildRoom(points1, RoomType.STANDARD),
            room2 = roomFactory.buildRoom(points2, RoomType.STANDARD),
            edges = RoomUtils.calculateEdgesBetweenRooms(room1, room2);

        let expectedPoint1 = new Point(7, 4, [new Point(7, 5)]),
            expectedPoint2 = new Point(8, 5, [new Point(7, 5)]),
            expectedPoint3 = new Point(6, 5, [new Point(7, 5), new Point(6, 6)]),
            expectedPoint4 = new Point(5, 6, [new Point(6, 6,), new Point(5, 7)]),
            expectedEdges = new XYMap([expectedPoint1, expectedPoint2, expectedPoint3, expectedPoint4]);

        expect(verifyConnections(edges, expectedEdges)).to.equal(true);
    });
});


// Checks that all the points in edges are present and equivalent to the points in expectedEdges
function verifyConnections(connections: XYMap, expectedConnections: XYMap) {
    if (connections.getPoints().length != expectedConnections.getPoints().length) return false;

    let points: Array<Point> = connections.getPoints(),
        expectedPoints: Array<Point> = expectedConnections.getPoints();

    // for each point, verify that the values in both connections and expectedConnections are the same.
    for (let point of points) {
        let connectionsFound: Array<Point> = point.value,
            connectionsExpected: Array<Point> = expectedConnections.get(point.x, point.y);

        // first check that the number of connections for this point is the same in both.
        if (connectionsFound.length != connectionsExpected.length) return false;

        for (let connectionFound of connectionsFound) {
            let found = false;
            for (let connectionExpected of connectionsExpected) {
                if (connectionFound.equals(connectionExpected)) {
                    found = true;
                    break;
                }
            }
            if (! found) return false;
        }
    }
    return true;
}

