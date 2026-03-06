export interface IAttribute {
    id?: string;
    categoryId: string;
    groupName: string;
    label: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IAttributeResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: IAttribute | IAttribute[];
}