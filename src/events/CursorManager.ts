import { Object3D } from "three";
import { InstancedMesh2 } from "../instancedMesh/InstancedMesh2";

/** Valid cursor values based on the CSS cursor property. */
export type CursorsKeys = "auto" | "default" | "none" | "context-menu" | "help" | "pointer" | "progress" | "wait" |
    "cell" | "crosshair" | "text" | "vertical-text" | "alias" | "copy" | "move" | "no-drop" | "not-allowed" | "grab" | "grabbing" |
    "all-scroll" | "col-resize" | "row-resize" | "n-resize" | "e-resize" | "s-resize" | "w-resize" |
    "ne-resize" | "nw-resize" | "se-resize" | "sw-resize" | "ew-resize" | "ns-resize" | "nesw-resize" | "nwse-resize" | "zoom-in" | "zoom-out";

const cursorSet = new Set([
    "auto", "default", "none", "context-menu", "help", "pointer", "progress", "wait",
    "cell", "crosshair", "text", "vertical-text", "alias", "copy", "move", "no-drop", "not-allowed", "grab", "grabbing",
    "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize",
    "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out"
]);

/** Represents a cursor, either by a CSS cursor key or a URL. */
export type Cursor = CursorsKeys | String;

/** @internal */
export class CursorHandler {
    public enabled = true;
    private _cursor: Cursor;
    private _domElement: HTMLCanvasElement;

    constructor(domElement: HTMLCanvasElement) {
        this._domElement = domElement;
    }

    public update(objDragged: Object3D, objHovered: Object3D, objDropTarget: Object3D): void {
        if (!this.enabled || !objHovered) return;
        const cursor = this.getCursor(objDragged, objHovered, objDropTarget);
        if (cursor !== this._cursor) {
            this._cursor = cursor;
            if (cursorSet.has(cursor as string)) {
                this._domElement.style.cursor = cursor as string;
            } else {
                this._domElement.style.cursor = `url(${cursor}), default`;
            }
        }
    }

    private getCursor(objDragged: Object3D, objHovered: Object3D, objDropTarget: Object3D): Cursor {
        if (objDropTarget) return objDropTarget.cursorDrop ?? "alias";
        if (objDragged) return objDragged.cursorDrag ?? "grabbing";
        if (objHovered.cursor) return objHovered.cursor;
        if ((objHovered as InstancedMesh2).isInstancedMesh2) {
            if (!(objHovered as InstancedMesh2).__enabledStateHovered) return "default";
        } else if (!objHovered.enabledState) return "default";
        return objHovered.draggable ? "grab" : "pointer";
    }

}
