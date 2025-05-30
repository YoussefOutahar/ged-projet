export function toTitleCase(str: string | null | undefined | any) {
    if (typeof str !== 'string' || !str) return str;
    return str.replace(/\w\S*/g, function (txt: string) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};
