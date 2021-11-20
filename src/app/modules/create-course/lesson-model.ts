import { ChordModel } from "./model/chord-model";
import { ReferenceLesson } from "./model/reference-lesson-model";

export interface LessonModel{
    id:number;
    duration: number | null;
    name: string;
    sequence: number;
    chords: ChordModel[];
    references: ReferenceLesson[];
}