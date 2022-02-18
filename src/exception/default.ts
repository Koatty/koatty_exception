/**
 * @ author: richen
 * @ copyright: Copyright (c) - <richenlin(at)gmail.com>
 * @ license: BSD (3-Clause)
 * @ version: 2020-12-15 11:49:15
 */

import { KoattyContext, KoattyNext } from "koatty_core";
import { DefaultLogger as Logger } from "koatty_logger";
import { HttpStatusCode, HttpStatusCodeMap } from "../code";


/**
 * Predefined runtime exception
 *
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class Exception extends Error {
    public status: number;
    public code: number;
    readonly type = "Exception";

    /**
     * Creates an instance of Exception.
     * @param {string} message
     * @param {number} [code=1]
     * @param {number} [status]
     * @memberof Exception
     */
    constructor(message: string, code = 1, status?: number) {
        super(message);
        this.status = status || 500;
        this.code = code || 1;
    }

    /**
     * Exception handler
     *
     * @param {KoattyContext} ctx
     * @returns {*}  
     * @memberof Exception
     */
    async handler(ctx: KoattyContext): Promise<any> {
        try {
            let body: any = ctx.body;
            if (!body) {
                body = this.message || ctx.message || "";
            }
            ctx.status = ctx.status || 500;
            if (HttpStatusCodeMap.has(this.status)) {
                ctx.status = <HttpStatusCode>this.status;
            }
            this.message = body;
            return responseBody(ctx, this);
        } catch (error) {
            Logger.Error(error);
            return null;
        }
    }
}

/**
 *
 *
 * @param {KoattyContext} ctx
 * @param {Exception} err
 * @returns {*}  
 */
function responseBody(ctx: KoattyContext, err: Exception) {
    let contentType = 'application/json';
    if (ctx.encoding !== false) {
        contentType = `${contentType}; charset=${ctx.encoding}`;
    }
    ctx.type = contentType;
    const { code, message } = err;
    const body = `{"code":${code || 1},"message":"${message ?? ""}"}`;
    ctx.set("Content-Length", `${Buffer.byteLength(body)}`);
    return ctx.res.end(body);
}

