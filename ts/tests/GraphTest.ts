import { Point } from "../source/util/Point";
import { Graph } from "../source/util/Graph";
import { EdgeCollection } from "../source/util/Graph";
import { Edge } from "../source/util/Graph";

import {} from "jasmine";
import { expect } from "chai";

describe ("Graph Tests", () => {
    it("edge collection throws error for 2 of same edge", () => {
        let edgeCollection: EdgeCollection = new EdgeCollection(),
            p1: Point = new Point(5, 5),
            p2: Point = new Point(5, 6),
            length: number = 1,
            caught: number = 0;
        edgeCollection.addEdge(p1, p2, length);
        try {
            edgeCollection.addEdge(p2, p1, length);
        } catch (e) {
            caught += 1;
        }
        try {
            edgeCollection.addEdge(p1, p2, length);
        } catch (e) {
            caught += 1;
        }
        try {
            edgeCollection.addEdge(p1, p1, length);
        } catch (e) {
            caught += 1;
        }
        expect(caught).to.equal(3);
    }),
    it("Returns p1 from either p1,p2 or p2,p1", () => {
        let edgeCollection: EdgeCollection = new EdgeCollection(),
            p1: Point = new Point(5, 5),
            p2: Point = new Point(5, 6),
            length: number = 1;
        edgeCollection.addEdge(p1, p2, length);
        let edge: Edge = edgeCollection.getEdge(p1, p2);
        expect(edge.p1.x).to.equal(p1.x);
        expect(edge.p1.y).to.equal(p1.y);
        expect(edge.p2.x).to.equal(p2.x);
        expect(edge.p2.y).to.equal(p2.y);
        edge = edgeCollection.getEdge(p2, p1);
        expect(edge.p1.x).to.equal(p1.x);
        expect(edge.p1.y).to.equal(p1.y);
        expect(edge.p2.x).to.equal(p2.x);
        expect(edge.p2.y).to.equal(p2.y);
    }),
    it("Builds the expected edge collection", () => {
        let p1: Point = new Point(0, 0),
            p2: Point = new Point(-2, 0),
            p3: Point = new Point(0, 3),
            p4: Point = new Point(3, 3),
            graph: Graph = Graph.buildGraph([p1, p2, p3, p4]),
            edgeCollection: EdgeCollection = graph.getEdgeCollection();

        expect(edgeCollection.getEdge(p1, p2).length).to.equal(2);
        expect(edgeCollection.getEdge(p1, p3).length).to.equal(3);
        expect(edgeCollection.getEdge(p1, p4).length).to.equal(4.242640687119285);

        expect(edgeCollection.getEdge(p2, p3).length).to.equal(3.605551275463989);
        expect(edgeCollection.getEdge(p2, p4).length).to.equal(5.830951894845301);

        expect(edgeCollection.getEdge(p3, p4).length).to.equal(3);

        expect(Object.keys(edgeCollection.edges).length).to.equal(6);
        expect(edgeCollection.sortedEdges.length).to.equal(6);
    }),
    it("The expected edge collection is sorted", () => {
        let p1: Point = new Point(0, 0),
            p2: Point = new Point(-2, 0),
            p3: Point = new Point(0, 3),
            p4: Point = new Point(3, 3),
            graph: Graph = Graph.buildGraph([p1, p2, p3, p4]),
            edgeCollection: EdgeCollection = graph.getEdgeCollection(),
            sortedEdges: Array<Edge> = edgeCollection.sortedEdges;
        expect(sortedEdges[0].length).to.equal(2);
        expect(sortedEdges[1].length).to.equal(3);
        expect(sortedEdges[2].length).to.equal(3);
        expect(sortedEdges[3].length).to.equal(3.605551275463989);
        expect(sortedEdges[4].length).to.equal(4.242640687119285);
        expect(sortedEdges[5].length).to.equal(5.830951894845301);
    }),
    it("Returns the list of sorted edges for a given point", () => {
        let p1: Point = new Point(0, 0),
            p2: Point = new Point(-2, 0),
            p3: Point = new Point(0, 3),
            p4: Point = new Point(3, 3),
            graph: Graph = Graph.buildGraph([p1, p2, p3, p4]),
            edgeCollection: EdgeCollection = graph.getEdgeCollection(),
            sortedEdges: Array<Edge> = edgeCollection.sortedEdges;
        expect(sortedEdges[0].length).to.equal(2);
        expect(sortedEdges[1].length).to.equal(3);
        expect(sortedEdges[2].length).to.equal(3);
        expect(sortedEdges[3].length).to.equal(3.605551275463989);
        expect(sortedEdges[4].length).to.equal(4.242640687119285);
        expect(sortedEdges[5].length).to.equal(5.830951894845301);
    }),
    it("Returns the edges for the given point, in sorted order", () => {
        let p1: Point = new Point(0, 0),
            p2: Point = new Point(-2, 0),
            p3: Point = new Point(0, 3),
            p4: Point = new Point(3, 3),
            graph: Graph = Graph.buildGraph([p1, p2, p3, p4]),
            edgeCollection: EdgeCollection = graph.getEdgeCollection(),
            edgesForP1 = edgeCollection.getEdgesForPoint(p1);
        expect(edgesForP1[0].length).to.equal(2);
        expect(edgesForP1[1].length).to.equal(3);
        expect(edgesForP1[2].length).to.equal(4.242640687119285);
    });
});

 
