/*
 * @Description: 
 * @Usage: 
 * @Author: richen
 * @Date: 2022-02-10 17:39:54
 * @LastEditTime: 2023-09-12 10:59:01
 */

import { GrpcStatusCodeMap, HttpStatusCodeMap, StatusCodeConvert } from "../code";
import { DefaultLogger as Logger } from "koatty_logger";
import { StatusBuilder } from "@grpc/grpc-js";
import { Exception } from "../exception";

/**
 * gRPC error handler
 *
 * @export
 * @param {KoattyContext} ctx
 * @param {Exception} err
 * @returns {*}  {Promise<any>}
 */
export function gRPCHandler(ctx: any, err: Exception): Promise<any> {
  try {
    let errObj, code = err.code ?? 2;
    // http status convert to grpc status
    const status = err.status || ctx.status;
    if (!err.code && HttpStatusCodeMap.has(status)) {
      code = StatusCodeConvert(status);
    }
    const body = ctx.body || err.message || GrpcStatusCodeMap.get(code) || null;

    if (body) {
      errObj = new StatusBuilder().withCode(code).withDetails(body).build();
    } else {
      errObj = new StatusBuilder().withCode(code).build();
    }
    return ctx.rpc.callback(errObj, null);
  } catch (error) {
    Logger.Error(error);
    ctx.rpc.callback(new StatusBuilder().withCode(2).build(), null);
    return;
  }
}