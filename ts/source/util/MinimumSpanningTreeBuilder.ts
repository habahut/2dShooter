import { Graph } from "./Graph";
import { EdgeCollection } from "./Graph";
import { Edge } from "./Graph";

import { Point } from "./Point";

// Uses Primm's Method to convert a graph to a minimum spanning tree
export class MinimumSpanningTreeBuilder {

    constructor() { }

    static build(nodes: Array<Point>) : Graph {
        let visitedNodes: any = this.initializeVisitedNodes(nodes),
            edgesInMST: EdgeCollection = new EdgeCollection(),
            // let this temporary Graph create all the edges between the nodes
            // and sort them for us
            tempGraph: Graph = Graph.buildGraph(nodes),
            tempEdgeCollection: EdgeCollection = tempGraph.edgeCollection;

        // start with the first, shortest edge in the edge collection.
       let p1 = tempEdgeCollection.sortedEdges[0].p1,
           p2 = tempEdgeCollection.sortedEdges[0].p2;

        visitedNodes[p1.toString()] = true;
        visitedNodes[p2.toString()] = true;
        edgesInMST.addBuiltEdge(tempEdgeCollection.sortedEdges[0]);

        // get all edges connected to these two points
        let candidateEdges: Array<Edge> = tempEdgeCollection.getEdgesForPoint(p1)
                .concat(tempEdgeCollection.getEdgesForPoint(p2)),
            visitedNodeCount: number = 2;

        console.log("candidate edges: " + JSON.stringify(candidateEdges));

        // now, we iterate over edges connected to the nodes in the MST, selecting the smallest
        // edge leading to a node we haven't included. We add that node to the MST and add its 
        // edges to our edge collection.
        while(visitedNodeCount < nodes.length) {
            let smallestLength: number = Number.MAX_VALUE,
                nextSmallest: Edge = new Edge(new Point(0,0), new Point(1,1), Number.MAX_VALUE);
            for (let edge of candidateEdges) {
                // does this ordering matter?
                if (! visitedNodes[edge.p1.toString()] || ! visitedNodes[edge.p2.toString()]) {
                    if (edge.length < smallestLength) {
                        nextSmallest = edge;
                    }
                }
            }
            if (nextSmallest.length == Number.MAX_VALUE) {
                throw "Could not complete the MST, couldn't find the next edge to add";
            }

            console.log("adding an nextSmallest: " + nextSmallest.p1.toString() + " -> " + nextSmallest.p2.toString() + " of length: " + nextSmallest.length);
            p1 = nextSmallest.p1;
            p2 = nextSmallest.p2;
            edgesInMST.addBuiltEdge(nextSmallest);
            // add the edges from the new node to the pool of candidate edges for the next round.
            if (visitedNodes[p1.toString()] = false) {
                candidateEdges = candidateEdges.concat(tempEdgeCollection.getEdgesForPoint(p1));
                visitedNodes[p1.toString()] = true;
            } else { 
                candidateEdges = candidateEdges.concat(tempEdgeCollection.getEdgesForPoint(p2));
                visitedNodes[p2.toString()] = true;
            }
            visitedNodeCount++;
        }

        return new Graph(nodes, edgesInMST);
    }

    static initializeVisitedNodes(nodes: Array<Point>) : any {
        let visitedNode: any = {};
        for (let node of nodes) {
            visitedNode[node.toString()] = false;
        }
        return visitedNode;
    }
}
