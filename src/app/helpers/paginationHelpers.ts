type IOptions = {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string | number;
}

type IOptionsResult = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string | number;
}
const calculatePagination = (options: IOptions): IOptionsResult => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 4;
    const skip = (Number(page) - 1) * limit;

    const sortBy: string = options.sortBy || 'createdAt';
    const sortOrder: string | number = options.sortOrder || 'asc';
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}

export const paginationHelpers = {
    calculatePagination
}