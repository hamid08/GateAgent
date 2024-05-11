
export class BaseGridFilterModel {

    constructor(
        searchTerm: string,
        pageIndex: number = 1,
        pageSize: number = 10,
    ) {

        this.searchTerm = searchTerm;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
    }
    searchTerm: string;
    pageIndex: number = 1;
    pageSize: number = 2;

}


export class GridResultModel {

    constructor(
        list: object[],
        total: number,
        page: number,
        size: number,
    ) {

        this.list = list;
        this.total = total;
        this.page = page;
        this.size = size;
    }
    list: object[];
    total: number;
    page: number;
    size: number;

}