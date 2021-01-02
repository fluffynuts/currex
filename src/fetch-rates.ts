import bent from "bent";

const json = bent("json");

interface ExchangeRateApiResult {
    result: "success" | "error";
    documentation: string;
    terms_of_use: string;
    time_last_update_unix: number;
    time_last_update_utc: string;
    time_next_update_unix: number;
    time_next_update_utc: string;
    base_code: string;
    conversion_rates: {
        [currency: string]: number;
    }
}

export interface IRates {
    supportedCurrencies: Set<string>;
    usdRates: {
        [code: string]: number
    },
    last_updated: Date;
    next_update: Date;
}

export async function fetchRates(apiKey: string): Promise<IRates> {
    const
        url = `https://v6.exchangerate-api.com/v6/${ apiKey }/latest/USD`;
    try {
        const current: ExchangeRateApiResult = await json(url);
        return {
            supportedCurrencies: new Set(
                Object.keys(current.conversion_rates)
                    .filter(s => s)
                    .map(s => s.toUpperCase())
            ),
            usdRates: current.conversion_rates,
            last_updated: new Date(current.time_last_update_utc),
            next_update: new Date(current.time_next_update_utc)
        };
    } catch
        (e) {
        throw new Error(`Unable to query current rates from '${ url }': ${ e.message }`);
    }
}
