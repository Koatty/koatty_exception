/*
 * @Description: 
 * @Usage: 
 * @Author: richen
 * @Date: 2022-02-10 18:16:36
 * @LastEditTime: 2022-02-21 15:31:18
 */

import { DefaultLogger as Logger } from "koatty_logger";
import { HttpStatusCode, HttpStatusCodeMap } from "../code";
import { Exception } from "../exception";


/**
 * Websocket error handler
 *
 * @export
 * @param {KoattyContext} ctx
 * @param {Exception} err
 * @returns {*}  {void}
 */
export function wsHandler(ctx: any, err: Exception): void {
    try {
        let body: any = ctx.body;
        if (!body) {
            body = err.message || ctx.message || "";
        }
        ctx.status = ctx.status || 500;
        if (HttpStatusCodeMap.has(err.status)) {
            ctx.status = <HttpStatusCode>err.status;
        }
        ctx.status = err.status ?? (ctx.status || 500);
        ctx.websocket.send(body);
        return null;
    } catch (error) {
        Logger.Error(error);
        return null;
    }
}
