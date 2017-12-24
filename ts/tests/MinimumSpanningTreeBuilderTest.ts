import { Point } from "../source/util/Point";
import { Graph } from "../source/util/Graph";
import { EdgeCollection } from "../source/util/Graph";
import { Edge } from "../source/util/Graph";
import { MinimumSpanningTreeBuilder } from "../source/util/MinimumSpanningTreeBuilder";

import {} from "jasmine";
import { expect } from "chai";

describe ("MinimumSpanningTreeBuilder Tests", () => {
    it("Test case 0", () => {
        let p1: Point = new Point(0, 0),
            p2: Point = new Point(-2, 0),
            mst: Graph = MinimumSpanningTreeBuilder.build([p1, p2]),
            expectedEdgeCollection: EdgeCollection = new EdgeCollection();
        expectedEdgeCollection.addEdge(p1, p2, 2);
        expect(validateEdges(mst.edgeCollection, expectedEdgeCollection)).to.equal(true);
    }),
    it("Test case 1", () => {
        let p1: Point = new Point(0, 0),
            p2: Point = new Point(-2, 0),
            p3: Point = new Point(0, 3),
            p4: Point = new Point(3, 3),
            mst: Graph = MinimumSpanningTreeBuilder.build([p1, p2, p3, p4]),
            expectedEdgeCollection: EdgeCollection = new EdgeCollection();
        expectedEdgeCollection.addEdge(p1, p2, 2);
        expectedEdgeCollection.addEdge(p1, p3, 3);
        expectedEdgeCollection.addEdge(p3, p4, 3);
        expect(validateEdges(mst.edgeCollection, expectedEdgeCollection)).to.equal(true);
    }),
    it("Test case 2", () => {
        let p1: Point = new Point(0, 0),
            p2: Point = new Point(1, 1),
            p3: Point = new Point(3, 1), 
            p4: Point = new Point(0, 5),
            p5: Point = new Point(3, 6),
            p6: Point = new Point(0, 6),
            p7: Point = new Point(4, 6),
            p8: Point = new Point(4, 7),
            mst: Graph = MinimumSpanningTreeBuilder.build([p1, p2, p3, p4, p5, p6, p7, p8]),
            expectedEdgeCollection: EdgeCollection = new EdgeCollection();
        expectedEdgeCollection.addEdge(p1, p2, 1);
        expectedEdgeCollection.addEdge(p2, p3, 2);
        expectedEdgeCollection.addEdge(p3, p4, 5);
        expectedEdgeCollection.addEdge(p4, p5, 5);
        expectedEdgeCollection.addEdge(p5, p6, 3);
        expectedEdgeCollection.addEdge(p5, p7, 1);
        expectedEdgeCollection.addEdge(p7, p8, 1);
        expect(validateEdges(mst.edgeCollection, expectedEdgeCollection)).to.equal(true);
    });
});

function validateEdges(edgeCollection: EdgeCollection, expectedEdgeCollection: EdgeCollection) {
    if (edgeCollection.size() != expectedEdgeCollection.size()) return false;

    for (let edge of edgeCollection.edges) {
        let found = false;
        for (let expectedEdge of expectedEdgeCollection.edges) {
            if (edge.equals(expectedEdge)) {
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

