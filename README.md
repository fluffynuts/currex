currex
---
CLI currency exchange rate calculator based on the free exchangerate-api.com api, using USD as a base
to convert between currencies not supported via direct query of the free api.

Requirements:
---

You will need a free api key from [exchangerate-api.com](https://app.exchangerate-api.com/sign-up). You
_do not_ need a paid subscription to be able to freely convert between any of the supported currencies.

Examples:
---

```
> npx currex usd to cad
1 USD is equivalent to 1.27 CAD as at Sat Jan 02 2021 02:00:02 GMT+0200 (South Africa Standard Time)

> npm currex 14.99 aud to cad
14.99 AUD is equivalent to 14.72 CAD as at Sat Jan 02 2021 02:00:02 GMT+0200 (South Africa Standard Time)
```

currex may also be imported as a module, providing the `convert` function:

```
await convert({
    from: "GBP",
    to: "AUD",
    fromAmount: 12.75
}, "your_api_key");
```

Credits:
---

- [TypeScript](https://npmjs.com/package/typescript) is awesome
- Inspired by a [dev.to post](https://dev.to/hb/10-fun-apis-to-use-for-your-next-project-2lco)
- Bootstrapped with [newts](https://npmjs.com/package/newts)
