import { grokArgs } from "../src/args";
import { IArgs } from "../src";

describe(`args`, () => {
    const currencies = new Set(["USD", "EUR", "ZAR"]);

    it(`should grok 'from 1 usd to zar'`, async () => {
        // Arrange
        const
            args = ["from", "1", "usd", "to", "zar"],
            expected: IArgs = {
                from: "USD",
                to: "ZAR",
                fromAmount: 1,
                verbose: false
            };
        // Act
        const result = grokArgs(
            args,
            currencies
        );
        // Assert
        expect(result)
            .toEqual(expected);
    });

    it(`should grok 'from usd to eur`, async () => {
        // Arrange
        const
            args = ["from", "usD", "to", "EUR"],
            expected: IArgs = {
                from: "USD",
                to: "EUR",
                fromAmount: 1,
                verbose: false
            };
        // Act
        const result = grokArgs(
            args,
            currencies
        );
        // Assert
        expect(result)
            .toEqual(expected);
    });

    it(`should grok 'usd to eur`, async () => {
        // Arrange
        const
            args = ["usD", "to", "EUR"],
            expected: IArgs = {
                from: "USD",
                to: "EUR",
                fromAmount: 1,
                verbose: false
            };
        // Act
        const result = grokArgs(
            args,
            currencies
        );
        // Assert
        expect(result)
            .toEqual(expected);
    });

    it(`should grok '23 eur to zar'`, async () => {
        // Arrange
        const
            args = ["-v", "23", "eur", "to", "zar"],
            expected: IArgs = {
                from: "EUR",
                to: "ZAR",
                fromAmount: 23,
                verbose: true
            };
        // Act
        const result = grokArgs(
            args,
            currencies
        );
        // Assert
        expect(result)
            .toEqual(expected);
    });

    it(`should error if the source currency is unknown`, async () => {
        // Arrange
        const
            args = [ "foo", "to", "bar" ];
        // Act
        expect(() => grokArgs(args, currencies))
            .toThrow(/currency 'foo' is unknown or not supported/i);
        // Assert
    });

    it(`should error if the target currency is unknown`, async () => {
        // Arrange
        const
            args = [ "usd", "to", "bar" ];
        // Act
        expect(() => grokArgs(args, currencies))
            .toThrow(/currency 'bar' is unknown or not supported/i);
        // Assert
    });

});
