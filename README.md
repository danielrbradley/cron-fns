# cron-fns

A simple, zero dependency implementation of cron schedule functions.

## Quick Start

```bash
npm install cron-fns --save
# or with yarn
yarn add cron-fns
```

## Usage

```ts
import { nextCronOccurrence } from "cron-fns";

//                    ┌───────────── minute (0 - 59)
//                    │    ┌───────────── hour (0 - 23)
//                    │    │  ┌───────────── day of the month (1 - 31)
//                    │    │  │ ┌───────────── month (1 - 12)
//                    │    │  │ │  ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
//                    │    │  │ │  │
//                    │    │  │ │  │
nextCronOccurrence("0,30 9-17 * * MON", new Date("2020-01-01T00:00:00"));

// Result: 2020-01-06T09:00:00
```

## Cron syntax rules

- Use a single space to separate fields.
- Enumerate multiple values for a field by separating by a comma (`,`).
- Specify a range of values with a hyphen (`-`).
- Ranges and enumeration cannot be mixed.

## Cron variations & notes

### Optional years

If you specify 6 fields then the last field is the year. If not specifed it doesn't limit by year.

### Optional seconds

If you specify 7 fields then the first field is the second. If not specified it chooses the zeroth second of each minute.

### Timezones

All times and dates are based on the system (or browser's) local timezone.
