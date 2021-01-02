export function isNumeric(arg: string | number): boolean {
    if (typeof arg === "number") {
        return true;
    }
    return (typeof arg === "number" && !isNaN(arg)) ||
        !isNaN(parseFloat(arg));
}

