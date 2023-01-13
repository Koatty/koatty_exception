/*
 * @Description: 
 * @Usage: 
 * @Author: richen
 * @Date: 2022-02-10 18:16:36
 * @LastEditTime: 2023-01-13 10:02:03
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
    ctx.status = ctx.status || 500;
    if (HttpStatusCodeMap.has(err.status)) {
      ctx.status = <HttpStatusCode>err.status;
    }
    const msg = err.message || ctx.message || "";
    const body = `{"code":${err.code || 1},"message":"${msg}","data":${ctx.body ? JSON.stringify(ctx.body) : (ctx.body || null)}}`;
    return ctx.websocket.send(body);
  } catch (error) {
    Logger.Error(error);
    return null;
  }
}
