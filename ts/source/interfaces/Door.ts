import { DoorState } from '../enums/DoorState';

export interface Door {
    absoluteX: number;
    absoluteY: number;
    state: DoorState;
    height: number;
    width: number;
}
