import { isNumeric } from "./common";
import { IConversionRequest } from "./currex";
export interface IArgs extends IConversionRequest {
    verbose: boolean;
}

function toFloat(arg: Argument): number {
    return typeof arg === "number"
        ? arg
        : parseFloat(arg);
}

function grokNumericsFrom(args: Argument[]): number[] {
    return args.filter(isNumeric).map(toFloat);
}

function grokCurrenciesFrom(
    args: Argument[],
    currencies: Set<string>
): string[] {
    return args
        .map(s => typeof s === "string" ? s.toUpperCase() : "")
        .filter(s => currencies.has(s));
}

function throwUnsupported(currency: string): IArgs {
    const message = currency === undefined
        ? `A conversion requires two 3-letter currency codes, eg 'convert from USD to EUR`
        : `Currency '${ currency }' is unknown or not supported`;
    throw new Error(message);
}

function validate(
    conversion: IArgs,
    args: Argument[]
): IArgs {
    if (conversion.from !== undefined &&
        conversion.to !== undefined) {
        return conversion;
    }
    const potentials = args.filter(
        s => typeof s === "string" &&  s.length === 3
    ) as string[];
    if (conversion.from === undefined) {
        return throwUnsupported(potentials[0]);
    }
    return throwUnsupported(potentials[1]);
}

export type Argument = string | number;

export function grokArgs(
    args: Argument[],
    knownCurrencies: Set<string>
): IArgs {
    const
        numerics = grokNumericsFrom(args),
        inputCurrencies = grokCurrenciesFrom(
            args,
            knownCurrencies
        );
    return validate({
        from: inputCurrencies[0],
        to: inputCurrencies[1],
        fromAmount: numerics[0] ?? 1,
        verbose: args.indexOf("-v") > -1
    }, args);
}

