/*
 * @Description: 
 * @Usage: 
 * @Author: richen
 * @Date: 2022-02-19 15:42:47
 * @LastEditTime: 2022-03-02 16:33:37
 */

import { DefaultLogger as Logger } from "koatty_logger";
import { HttpStatusCode, HttpStatusCodeMap } from "../code";
import { Exception } from "../exception";

/**
 * HTTP error handler
 *
 * @export
 * @param {KoattyContext} ctx
 * @param {Exception} err
 * @returns {*}  
 */
export function httpHandler(ctx: any, err: Exception) {
    try {
        ctx.status = ctx.status || 500;
        if (HttpStatusCodeMap.has(err.status)) {
            ctx.status = <HttpStatusCode>err.status;
        }

        let contentType = 'application/json';
        if (ctx.encoding !== false) {
            contentType = `${contentType}; charset=${ctx.encoding}`;
        }
        ctx.type = contentType;
        const msg = err.message || ctx.message || "";
        const body = `{"code":${err.code || 1},"message":"${msg}","data":${ctx.body ? JSON.stringify(ctx.body) : (ctx.body || null)}}`;
        ctx.set("Content-Length", `${Buffer.byteLength(body)}`);
        return ctx.res.end(body);
    } catch (error) {
        Logger.Error(error);
        return null;
    }
}
