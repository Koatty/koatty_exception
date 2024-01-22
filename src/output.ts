/*
 * @Description: 
 * @Usage: 
 * @Author: richen
 * @Date: 2024-01-22 11:10:28
 * @LastEditTime: 2024-01-22 11:16:02
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */

import { KoaContext } from "koatty_core";
import { GrpcStatusCodeMap, StatusCodeConvert } from "./code";
import { StatusBuilder } from "@grpc/grpc-js";
/**
 * @description: exception output
 * @param {KoaContext} ctx
 * @param {string} body
 * @return {*}
 */
export function ExceptionOutPut(ctx: KoaContext, body: string): any {
  switch (ctx.protocol) {
    case "ws":
    case "wss":
      if (ctx.websocket) {
        body = `{"code": ${this.code}, "message": "${this.message}", "data": ${body}}`;
        ctx.length = Buffer.byteLength(body);
        ctx.websocket.send(body);
      }
      break;
    case "grpc":
      if (ctx.rpc && ctx.rpc.callback) {
        // http status convert to grpc status
        if (!this.code) {
          this.code = StatusCodeConvert(ctx.status);
        }
        body = body || GrpcStatusCodeMap.get(this.code) || "";
        ctx.rpc.callback(new StatusBuilder().withCode(this.code).withDetails(body).build(), null);
      }
      break;
    default:
      body = `{"code": ${this.code}, "message": "${this.message}", "data": ${body}}`;
      ctx.length = Buffer.byteLength(body);
      ctx.res.end(body);
      break;
  }
  return null;
}