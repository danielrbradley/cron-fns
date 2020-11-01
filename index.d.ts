/** @name Schedule
 *  @description Any field which is not defined or empty is assumed to be unconstrained.
 */
export declare type Schedule = {
    second?: number[];
    minute?: number[];
    hour?: number[];
    dayOfMonth?: number[];
    month?: number[];
    dayOfWeek?: number[];
    year?: number[];
};
export declare const next: (schedule: Schedule | string, from: Date) => Date | undefined;
