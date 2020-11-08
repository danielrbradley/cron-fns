[![npm version](https://badge.fury.io/js/cron-fns.svg)](https://www.npmjs.com/package/cron-fns)
[![GitHub issues](https://img.shields.io/github/issues/danielrbradley/cron-fns.svg)](https://github.com/danielrbradley/cron-fns/issues)
[![TypeDoc docs](https://img.shields.io/badge/TypeDoc-docs-green.svg)](https://www.danielbradley.net/cron-fns/)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/danielrbradley/cron-fns/Release)](https://github.com/danielrbradley/cron-fns/actions?query=workflow%3ARelease)

# cron-fns

A simple, zero dependency implementation of cron schedule functions.

## Quick Start

```bash
npm install cron-fns --save
# or with yarn
yarn add cron-fns
```

## Usage

### `nextCronOccurrence(schedule, from?) => Date | undefined`

Fetches the next date that matches the schedule, or undefined if no other time is available.

```ts
import { nextCronOccurrence } from "cron-fns";

nextCronOccurrence("0,30 9-17 * * MON", new Date("2020-01-01T00:00:00"));
// Returns 2020-01-06T09:00:00

// `from` defaults to the current date if not specified.
nextCronOccurrence("0,30 9-17 * * MON 1987");
// Returns undefined if no more possible dates
```

### `nextCronOccurrences(schedule, from?)`

Returns a generator which iterates through each sequential date in order from the specified start point. The generator will only stop iterating if there is no more possible dates.

```ts
import { nextCronOccurrences } from "cron-fns";

nextCronOccurrences("0,30 9-10 * * MON", new Date("2020-01-01T00:00:00"));
// Returns a generator with the sequence:
// 2020-01-06T09:00:00
// 2020-01-06T09:30:00
// 2020-01-06T10:00:00
// ...
```

### `Cron`

```ts
import { Cron } from "cron-fns";
const cron = new Cron("0,30 9-17 * * MON");
cron.next(); // Returns the next date from now
cron.next(new Date("2020-01-01T00:00:00")); // Returns 2020-01-06T09:00:00
```

## Cron syntax rules

```ts
//                    ┌───────────── minute (0 - 59)
//                    │    ┌───────────── hour (0 - 23)
//                    │    │  ┌───────────── day of the month (1 - 31)
//                    │    │  │ ┌───────────── month (1 - 12)
//                    │    │  │ │  ┌───────────── day of the week (0 - 6) (Sunday to Saturday)
//                    │    │  │ │  │
//                    │    │  │ │  │
nextCronOccurrence("0,30 9-17 * * MON");
```

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
