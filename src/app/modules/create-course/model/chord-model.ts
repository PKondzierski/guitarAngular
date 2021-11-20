import { BeatingModel } from "./beating-model";

export interface ChordModel{
    startChordTime: number;
    endChordTime: number;
    chordList: string[];
    beatingList: BeatingModel[];
}