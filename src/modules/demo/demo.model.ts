import { ObjectId } from "mongodb";

export interface Demo {
    _id?: ObjectId;
    name: string;
    description: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface DemoDTO {
    name?: string;
    description?: string;
    active?: boolean;
}
