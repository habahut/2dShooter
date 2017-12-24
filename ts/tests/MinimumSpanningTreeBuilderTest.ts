import { Point } from "../source/util/Point";
import { Graph } from "../source/util/Graph";
import { EdgeCollection } from "../source/util/Graph";
import { Edge } from "../source/util/Graph";
import { MinimumSpanningTreeBuilder } from "../source/util/MinimumSpanningTreeBuilder";

import {} from "jasmine";
import { expect } from "chai";

describe ("MinimumSpanningTreeBuilder Tests", () => {
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
        console.log(JSON.stringify(mst.edgeCollection.edges));
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

