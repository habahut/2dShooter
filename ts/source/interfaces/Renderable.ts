export interface Renderable {
    render(): void;

    /*
    TODO: all `Renderable` objects should have an absolute X and Y,
    and height and width. All Renderables will be rectangles, with AABB collision.
    This interface might need to change name to better reflect this new ability...

    getX(): number;
    getY(): number;
    getWidth(): number;
    getHeight(): number;
    */

}
