import { Room } from '../interfaces/Room';
import { RoomFactory } from '../factories/RoomFactory';
import { DoorFactory } from '../factories/DoorFactory';


export class LevelGenerator {
	room: Room;
	roomFactory: RoomFactory;
	door: DoorFactory;
	// maybe not necessary
	//wallFactory: WallFactory;
}
