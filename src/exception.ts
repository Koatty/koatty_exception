/**
 * @ author: richen
 * @ copyright: Copyright (c) - <richenlin(at)gmail.com>
 * @ license: BSD (3-Clause)
 * @ version: 2020-12-15 11:49:15
 */

import { DefaultLogger as Logger } from "koatty_logger";
import { gRPCHandler } from "./handler/grpc";
import { httpHandler } from "./handler/http";
import { wsHandler } from "./handler/ws";
import { Span, Tags } from "opentracing";
import { KoattyContext } from "koatty_core";
import { Helper } from "koatty_lib";

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
   * Default exception handler
   * @param ctx 
   */
  handler(ctx: KoattyContext): Promise<any> {
    // LOG
    this.stack ? Logger.Error(this.stack) : Logger.Error(this.message);
    // span
    if (this.span) {
      this.span.setTag(Tags.ERROR, true);
      this.span.setTag(Tags.HTTP_STATUS_CODE, this.status || 500);
      this.span.setTag(Tags.HTTP_METHOD, ctx.method);
      this.span.setTag(Tags.HTTP_URL, ctx.url);
      this.span.log({ 'event': 'error', 'message': this.message, 'stack': this.stack });
      // this.span.finish();
    }
    switch (ctx.protocol) {
      case "grpc":
        return gRPCHandler(ctx, this);
      case "ws":
      case "wss":
        return wsHandler(ctx, this);
      default:
        return httpHandler(ctx, this);
    }
  }

}

