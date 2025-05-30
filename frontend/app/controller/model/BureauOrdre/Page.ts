//This interface represents a generic page of data in a paginated API. 

interface Page<T> {
    content: T[]; // An array of items on the current page.
    totalPages: number; // The total number of pages.
    totalElements: number; // The total number of items across all pages.
    last: boolean; // A boolean indicating whether the current page is the last one.
    size: number; // The number of items per page.
    number: number; // The current page number (usually starts from 0).
    sort: any; // Information about the sorting parameters. The type can be more specific depending on your sorting implementation.
    first: boolean; // A boolean indicating whether the current page is the first one.
    numberOfElements: number; // The number of items on the current page.
}