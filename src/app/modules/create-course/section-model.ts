import { LessonModel } from "./lesson-model";

export interface SectionModel {
  id:number | null;
  duration: number;
  name: string;
  sequence: number;
  lessons: LessonModel[];
}
