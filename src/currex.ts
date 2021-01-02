// currex module main file
import { fetchRates, IRates } from "./fetch-rates";

export interface IConversionRequest {
    from: string;
    to: string;
    fromAmount: number;
}

function validateCurrency(
    currency: string,
    supportedCurrencies: Set<string>
) {
    if (!supportedCurrencies.has(currency)) {
        throw new Error(`currency '${ currency }' is not supported`);
    }
}

export async function convert(
    data: IConversionRequest,
    ratesOrApiKey: IRates | string
): Promise<number> {
    if (ratesOrApiKey === undefined) {
        throw new Error(`please provide rates object or api key to resolve rates`);
    }
    const
        rates = typeof ratesOrApiKey === "string"
            ? await fetchRates(ratesOrApiKey)
            : ratesOrApiKey;
    validateCurrency(data.from, rates.supportedCurrencies)
    validateCurrency(data.to, rates.supportedCurrencies)
    if (data.from === "USD") {
        return data.fromAmount * rates.usdRates[data.to];
    }
    const usdValue = data.fromAmount / rates.usdRates[data.from];
    return data.to === "USD"
        ? usdValue
        : usdValue * rates.usdRates[data.to];
}
