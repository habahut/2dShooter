import { Point } from "../../source/util/Point";

export class PointTestUtil {
    static verifyPoints(points: Array<Point>, expectedPoints: Array<Point>) : boolean {
	if (points.length != expectedPoints.length) return false;

	for (let point of points) {
	    let found: boolean = false;
	    for (let expectedPoint of expectedPoints) {
		if (point.equalsCoords(expectedPoint)) {
		    found = true;
		    break;
		}
	    }

	    if (! found) return false;
	}

	return true;
    }
}
