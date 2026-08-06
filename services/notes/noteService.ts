import type { Note } from "../../types/Note";

//import { mockPlants } from "../../constants/mockData";

class NoteService {
    
    async getNotes(): Promise<Note[]> {
        return [];
    }

    async getNote(id: string): Promise<Note | undefined> {
        //return mockPlants.find(plant => plant.id === id);
        return undefined;
    }

}

export default new NoteService();