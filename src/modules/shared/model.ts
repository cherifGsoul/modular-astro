import { v4, validate } from "uuid";
import dayjs from "dayjs";

interface Predicate<T> {
    (v: any): v is T
}
export namespace Brand {
    export type t<T> = T & { readonly __brand: unique symbol }
}

export namespace NonEmptyString {
    export type t = Brand.t<string>
    export const isNonEmptyString = (s: any): s is t => typeof s === 'string' && s.length > 0
    export const fromString = (s: string) => {
        if (!isNonEmptyString(s)) throw new Error('Invalid non-empty string')
        return s
    }
}

export namespace PositiveNumber {
    export type t = Brand.t<number>
    export const isPositiveNumber: Predicate<t> = (n: any): n is t => typeof n === 'number' && n >= 0
    export const fromNumber = (n: number): t => {
        if (!isPositiveNumber(n)) throw new Error('invalid positive number')
        return n
    }
}

export namespace UUID {
    export type t = Brand.t<string>
    export const isUUID: Predicate<t> = (s: any): s is t => typeof s === 'string' && validate(s)
    export const fromString = (s: string): t => {
        if (!isUUID(s)) {
            throw new Error('invalid UUID')
        }
        return s;
    }
    export const generate = (): t => fromString(v4())
}

export namespace Period {
    export type t = {
        startDate: Date
        endDate: Date
    }

    export const between = (start: string | Date, end: string | Date): Period.t => {
        const startDay = dayjs(start)
        const endDay = dayjs(end)
        if (!startDay.isValid() || !endDay.isValid()) throw new Error('both start date and end date must be valid date value')
        if (endDay.isBefore(startDay)) throw new Error('start date must be before end date')
        return { startDate: startDay.toDate(), endDate: endDay.toDate() }
    }
}

export interface UseCase<Command, Event> {
    (c: Command): Promise<Event>
}
