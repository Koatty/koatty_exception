/**
 * @ author: richen
 * @ copyright: Copyright (c) - <richenlin(at)gmail.com>
 * @ license: BSD (3-Clause)
 * @ version: 2020-12-15 11:49:15
 */

import * as Helper from "koatty_lib";
import { GrpcStatusCode, HttpStatusCode } from "./code";

const PREVENT_NEXT_PROCESS = 'PREVENT_NEXT_PROCESS';
/**
 * Prevent next process
 *
 * @returns {Promise.reject}
 */
export function prevent(): Promise<never> {
    return Promise.reject(new Error(PREVENT_NEXT_PROCESS));
}

/**
 * Check is prevent error
 *
 * @param {Error} err
 * @returns {boolean}
 */
export function isPrevent(err: Error): boolean {
    return Helper.isError(err) && err.message === PREVENT_NEXT_PROCESS;
}

/**
 * Predefined exception
 *
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class Exception extends Error {
    public status: HttpStatusCode | GrpcStatusCode;
    public code: number;

    /**
     * Creates an instance of Exception.
     * @param {string} message
     * @param {number} [code=1]
     * @param {(HttpStatusCode | GrpcStatusCode)} [status]
     * @memberof Exception
     */
    constructor(message: string, code = 1, status?: HttpStatusCode | GrpcStatusCode) {
        super(message);
        if (status as HttpStatusCode) {
            status = status || 500;
        } else {
            status = status || 2;
        }
        this.status = status;
        this.code = code;
    }
}

/**
 * Check if the error is a predefined exception
 *
 * @template T
 * @param {(Exception | T)} err
 * @returns {boolean}  {err is Exception}
 */
export const isException = <T extends { message: string, code?: number, status?: HttpStatusCode | GrpcStatusCode }>(
    err: Exception | T,
): boolean =>
    err instanceof Exception ||
    !!(err && typeof err.status === 'number' && typeof err.message === 'string');


