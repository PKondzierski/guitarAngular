import { SectionModel } from "../section-model";

export interface CourseModel{
    id: number;
    title: string;
    description: string;
    aboutAuthor: string;
    sections: SectionModel[];
}
