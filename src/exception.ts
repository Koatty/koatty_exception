/**
 * @ author: richen
 * @ copyright: Copyright (c) - <richenlin(at)gmail.com>
 * @ license: BSD (3-Clause)
 * @ version: 2020-12-15 11:49:15
 */

import { DefaultLogger as Logger } from "koatty_logger";
import { Span, Tags } from "opentracing";
import { KoattyContext } from "koatty_core";
import { Helper } from "koatty_lib";
import { GrpcStatusCodeMap, StatusCodeConvert } from "./code";
import { StatusBuilder } from "@grpc/grpc-js";

/**
 * Predefined runtime exception
 *
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class Exception extends Error {
  public status: number = 500;
  public code: number = 1;
  public span: Span;
  readonly type = "Exception";

  /**
   * @description: Creates an instance of Exception.
   * @param {string} message err message
   * @param {number} code err code
   * @param {number} status http status
   * @param {string} stack err stack
   * @param {Span} span opentracing span
   * @return {Exception}
   */
  constructor(message: string, code?: number, status?: number, stack?: string, span?: Span) {
    super(message);
    this.status = status;
    this.code = code;
    this.stack = stack;
    this.span = span;
  }

  setStatus(status: number) {
    if (status >= 100 && status < 600) {
      this.status = status;
    }
    return this;
  }

  setMessage(message: string) {
    if (message) {
      this.message = message;
    }
    return this;
  }

  setCode(code: number) {
    if (Helper.isNumber(code)) {
      this.code = code;
    }
    return this;
  }

  setStack(stack: string) {
    if (stack) {
      this.stack = stack;
    }
    return this;
  }

  setSpan(span: Span) {
    if (span) {
      this.span = span;
    }
    return this;
  }
  /**
   * @description: logger
   * @param {KoattyContext} ctx
   * @return {*}
   */
  log(ctx: KoattyContext) {
    const now = Date.now();
    let message = `{"startTime":"${ctx.startTime}","duration":"${(now - ctx.startTime) || 0}","requestId":"${ctx.requestId}","endTime":"${now}","path":"${ctx.originalPath || '/'}","message":"${this.message}"`;
    // LOG
    if (this.stack) {
      message = `${message},stack:"${this.stack}"`;
    }
    message = `${message}}`;

    Logger.Error(message);
    // span
    if (this.span) {
      this.span.setTag(Tags.ERROR, true);
      this.span.setTag(Tags.HTTP_STATUS_CODE, this.status || 500);
      this.span.setTag(Tags.HTTP_METHOD, ctx.method);
      this.span.setTag(Tags.HTTP_URL, ctx.url);
      this.span.log({ 'event': 'error', 'message': this.message, 'stack': this.stack });
    }
    return;
  }

  /**
   * @description: Default exception handler
   * @param {KoattyContext} ctx
   * @return {*}
   */
  handler(ctx: KoattyContext): Promise<any> {
    // LOG
    this.log(ctx);
    try {
      ctx.status = this.status || ctx.status;
      let contentType = 'application/json';
      if (ctx.encoding !== false) {
        contentType = `${contentType}; charset=${ctx.encoding}`;
      }
      ctx.type = contentType;
      let body = JSON.stringify(ctx.body || "");

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
            ctx.length = Buffer.byteLength(body);
            ctx.rpc.callback(new StatusBuilder().withCode(this.code).withDetails(body).build(), null);
          }
          break;
        default:
          body = `{"code": ${this.code}, "message": "${this.message}", "data": ${body}}`;
          ctx.length = Buffer.byteLength(body);
          ctx.res.end(body);
          break;
      }
    } catch (error) {
      Logger.Error(error);
    }

    return null;
  }

}

