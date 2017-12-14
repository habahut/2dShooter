import { Room } from '../interfaces/Room';
import { RoomFactory } from '../factories/RoomFactory';
import { WallObjectFactory } from '../factories/WallObjectFactory';


export class LevelGenerator {
	room: Room;
	roomFactory: RoomFactory;
	door: WallObjectFactory;
	// maybe not necessary
	//wallFactory: WallFactory;
}
