import { Point } from "../source/util/Point";
import { Graph } from "../source/util/Graph";
import { EdgeCollection } from "../source/util/Graph";
import { Edge } from "../source/util/Graph";
import { MinimumSpanningTreeBuilder } from "../source/util/MinimumSpanningTreeBuilder";
import { RandomGenerator } from "../source/util/Random";
import { RoomScaledFactoryFactory } from "../source/factories/RoomScaledFactoryFactory";
import { LevelGenerator } from "../source/levelGeneration/LevelGenerator";

import {} from "jasmine";
import { expect } from "chai";

describe ("LevelGenerator Tests", () => {
    it("RoomWalk builds a correct set of rooms", () => {
        let roomScaledFactoryFactory: RoomScaledFactoryFactory = new RoomScaledFactoryFactory(100),
            random: RandomGenerator = new RandomGenerator([1]),
            levelGenerator: LevelGenerator = new LevelGenerator(roomScaledFactoryFactory, 10, 10, 10, random),
            p1: Point = new Point(0, 0),
            p2: Point = new Point(0, 3),
            p3: Point = new Point(3, 3),
            nodes: Array<Point> = [p1, p2, p3],
            edges: EdgeCollection = new EdgeCollection();
        edges.addEdge(p1, p2, 3);
        edges.addEdge(p2, p3, 3);
        debugger;
        let connectedPoints = levelGenerator.roomWalk(new Graph(nodes, edges)),
            expectedPoints = [new Point(0,0), new Point(0,1), new Point(0,2), new Point(0,3), 
                              new Point(1,3), new Point(2,3), new Point(3,3)];
        console.log(JSON.stringify(connectedPoints));
        expect(verifyPoints(connectedPoints, expectedPoints)).to.equal(true);
    });
});

function verifyPoints(points: Array<Point>, expectedPoints: Array<Point>) : boolean {
    if (points.length != expectedPoints.length) {
        return false;
    }

    for (let i = 0;i < points.length; i++) {
        let found = false;
        for (let j = 0; j < expectedPoints.length; j++) {
            if (points[i].equalsCoords(expectedPoints[j])) {
                found = true;
                break;
            }
        }

        if (! found) {
            return false;
        }
    }

    return true;
}

