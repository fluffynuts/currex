#!/usr/bin/env node
import yargs = require("yargs");
import { readTextFile, fileExists } from "yafs";
import { homedir } from "os";
import { join } from "path";
import { Argument, grokArgs, IArgs } from "./args";
import { fetchRates, IRates } from "./fetch-rates";
import { convert } from "./currex";

const configFile = join(homedir(), ".currex.json");

interface IConfig {
    apiKey: string;
}


async function readConfig(): Promise<IConfig | undefined> {
    if (await fileExists(configFile)) {
        try {
            const contents = await readTextFile(configFile);
            return JSON.parse(contents) as IConfig;
        } catch (e) {
            /* fall through */
        }
    }
    return undefined;
}

async function readApiKey(): Promise<string | undefined> {
    if (process.env.CURREX_API_KEY !== undefined) {
        return process.env.CURREX_API_KEY;
    }
    const config = await readConfig();
    return config === undefined
        ? undefined
        : config.apiKey;
}

function apiKeyRequired() {
    console.error(`
Currex uses the free api from exchangerate-api.com, for which you'll need an api key.
It's free to sign up at https://app.exchangerate-api.com/sign-up

Once you have a key, please either:
- define the CURREX_API_KEY environment variable or
- create a config file at '${ configFile }' containing something like '{ "apiKey": "your_api_key"}'`
    );
    process.exit(1);
}

async function tryFetchRates(apiKey: string): Promise<IRates> {
    try {
        return await fetchRates(apiKey);
    } catch (e) {
        console.error(e.message);
        process.exit(2);
    }
}


function tryGrokArgs(args: Argument[], supportedCurrencies: Set<string>) {
    try {
        return grokArgs(args, supportedCurrencies);
    } catch (e) {
        console.error(e.message);
        process.exit(3);
    }
}

async function tryConvert(data: IArgs, rates: IRates): Promise<number> {
    try {
        return await convert(data, rates);
    } catch (e) {
        console.error(`Unable to perform conversion: ${ e.message }`);
        process.exit(4);
    }
}

(async function main() {
    const apiKey = await readApiKey();
    if (apiKey === undefined) {
        return apiKeyRequired();
    }

    const
        args = yargs.argv,
        rates = await tryFetchRates(apiKey),
        input = tryGrokArgs(
            args._,
            rates.supportedCurrencies
        ),
        result = await tryConvert(input, rates);
    const message = [`${
        input.fromAmount
    } ${
        input.from
    } is equivalent to ${
        input.verbose ? result : result.toFixed(2)
    } ${
        input.to
    } as at ${
        rates.last_updated
    }`];
    if (input.verbose) {
        message.push(`(next update is at ${ rates.next_update })`);
    }
    console.log(message.join(" "));
})();
