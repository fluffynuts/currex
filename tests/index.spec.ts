import "expect-even-more-jest";
import * as faker from "faker";
import { convert, IConversionRequest } from "../src";
import { IRates } from "../src/fetch-rates";

describe(`currex`, () => {
    it(`should use the provided USD-based conversions to convert from USD to EUR`, async () => {
        // Arrange
        const
            data: IConversionRequest = {
                fromAmount: 1,
                from: "USD",
                to: "EUR"
            }, rates: IRates = {
                usdRates: {
                    "USD": 1,
                    "EUR": 1.3
                },
                supportedCurrencies: new Set(["USD", "EUR", "ZAR", "CAD"]),
                last_updated: faker.date.past(),
                next_update: faker.date.future()
            };
        // Act
        const result = await convert(data, rates);
        // Assert
        expect(result)
            .toEqual(1.3);
    });

    it(`should convert from known currency back to usd`, async () => {
        // Arrange
        const
            data: IConversionRequest = {
                fromAmount: 1,
                to: "USD",
                from: "EUR",
            }, rates: IRates = {
                usdRates: {
                    "USD": 1,
                    "EUR": 1.3
                },
                supportedCurrencies: new Set(["USD", "EUR", "ZAR", "CAD"]),
                last_updated: faker.date.past(),
                next_update: faker.date.future()
            },
            expected = 1 / 1.3;
        // Act
        const result = await convert(data, rates);
        // Assert
        expect(result)
            .toEqual(expected);
    });

    it(`should convert through USD from between other currencies`, async () => {
        // Arrange
        const
            data: IConversionRequest = {
                fromAmount: 3,
                from: "CAD",
                to: "ZAR",
            }, rates: IRates = {
                usdRates: {
                    "USD": 1,
                    "EUR": 1.3,
                    "CAD": 1.5,
                    "ZAR": 14.5
                },
                supportedCurrencies: new Set(["USD", "EUR", "ZAR", "CAD"]),
                last_updated: faker.date.past(),
                next_update: faker.date.future()
            },
            expected = (3 / 1.5) * 14.5
        // Act
        const result = await convert(data, rates);
        // Assert
        expect(result)
            .toEqual(expected);
    });
});
