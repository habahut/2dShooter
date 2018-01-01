import { Point } from "./Point";

// simple implementation of a graph, used for the LevelGenerator
//
// will probably need some version of this for the AI to navigate correctly...

export class Graph {
    nodes: Array<Point>;
    edgeCollection: EdgeCollection;

    constructor(nodes: Array<Point>, edgeCollection: EdgeCollection) {
        this.nodes = nodes;
        this.edgeCollection = edgeCollection;
    }

    // default constructor: creates an edge between every point in the graph.
    static buildGraph(points: Array<Point>) : Graph {
        let edgeCollection = new EdgeCollection;
        for (let i = 0;i < points.length; i++) {
            for (let j = 0 ; j < points.length; j++) {
                // skip if the same node 
                if (i == j) continue;

                let p1: Point = points[i],
                    p2: Point = points[j];

                // also skip if we have done this edge already
                if (edgeCollection.getEdge(p1, p2) != undefined) continue;

                let length: number = calculateDistance(p1, p2);
                edgeCollection.addEdge(p1, p2, length);
            }
        }

        return new Graph(points, edgeCollection);
    }

    /*VisibleForTesting*/getEdgeCollection() {
        return this.edgeCollection;
    }
}

function  calculateDistance(p1: Point, p2: Point) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

export class EdgeCollection {
    // should iterate over sortedEdges, not edges. Perhaps edges should be private?
    edges: any;
    sortedEdges: Array<Edge>;

    constructor() {
        this.edges = {};
        this.sortedEdges = [];
    }

    addEdge(p1: Point, p2: Point, length: number) : void {
        if (p1.equalsCoords(p2)) {
            throw "p1 == p2, cant add this as an edge";
        }
        let edge = new Edge(p1, p2, length);
        if (this.edges[this.pointsToString(p1, p2)] == undefined
                && this.edges[this.pointsToString(p2, p1)] == undefined) {
            this.edges[this.pointsToString(p1, p2)] = edge;
            this.insertSortedEdge(edge);
        } else {
            throw "Trying to re-add an edge!";
        }
    }

    // Annoying that typescript doesn't really let you overload functions, so have to make 
    // a new name for the same thing essentially.
    addBuiltEdge(edge: Edge) : void {
        this.addEdge(edge.p1, edge.p2, edge.length);
    }

    insertSortedEdge(edge: Edge) : void {
        let inserted = false;
        if (this.sortedEdges.length == 0) {
            this.sortedEdges.push(edge);
            return;
        }
        for (let i = 0; i < this.sortedEdges.length; i++) {
            if (this.sortedEdges[i].length > edge.length) {
                this.sortedEdges.splice(i, 0, edge);
                inserted = true;
                break;
            }
        }

        // this is the largest edge, so just append it to the end of the list.
        if (! inserted) this.sortedEdges.push(edge);
    }

    getEdge(p1: Point, p2: Point) : Edge {
        if (this.edges[this.pointsToString(p1, p2)] != undefined) {
            return this.edges[this.pointsToString(p1, p2)];
        }
        return this.edges[this.pointsToString(p2, p1)];
    }

    // Returns all edges linking from Point p. p is always p1 in the edges returned
    // (they may be reordered). The returned array will be sorted.
    getEdgesForPoint(p: Point) : Array<Edge> {
        let edges: Array<Edge> = [];
        for(let edge of this.sortedEdges) {
            if (edge.p1.equalsCoords(p)) {
                edges.push(edge);
            } else if (edge.p2.equalsCoords(p)) {
                edges.push(new Edge(edge.p2, edge.p1, calculateDistance(edge.p1, edge.p2)));
            }
        }
        return edges;
    }

    pointsToString(p1: Point, p2: Point) : string {
        return p1.toString() + p2.toString();
    }

    size() {
        return this.sortedEdges.length;
    }
}

export  class Edge {
    p1: Point;
    p2: Point;
    length: number;

    // TODO: this is stupid, it shouldn't take the length as a parameter
    constructor(p1: Point, p2: Point, length: number) {
        this.p1 = p1;
        this.p2 = p2;
        this.length = length;
    }

    equals(e: Edge) {
        return (this.p1.equalsCoords(e.p1) && this.p2.equalsCoords(e.p2) && this.length == e.length
            || this.p1.equalsCoords(e.p2) && this.p2.equalsCoords(e.p1) && this.length == e.length);
    }
}

