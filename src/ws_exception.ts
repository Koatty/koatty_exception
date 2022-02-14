/*
 * @Description: 
 * @Usage: 
 * @Author: richen
 * @Date: 2022-02-10 18:16:36
 * @LastEditTime: 2022-02-11 10:36:34
 */

import { KoattyContext } from "koatty_core";
import { DefaultLogger as Logger } from "koatty_logger";
import { HttpStatusCode, HttpStatusCodeMap } from "./code";

export class WsException extends Error {
    public status: number;
    public code: number;
    readonly type = "WsException";

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
     * @protected
     * @returns {*}  
     * @memberof Exception
     */
    async handler(ctx: KoattyContext) {
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
 * @param {WsException} err
 * @returns {*}  
 */
function responseBody(ctx: KoattyContext, err: WsException): any {
    ctx.status = err.status ?? (ctx.status || 500);
    ctx.websocket.emit('error');
    return null;
}