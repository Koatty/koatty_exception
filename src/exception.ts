/**
 * @ author: richen
 * @ copyright: Copyright (c) - <richenlin(at)gmail.com>
 * @ license: BSD (3-Clause)
 * @ version: 2020-12-15 11:49:15
 */

import { Helper } from "koatty_lib";
import { Span, Tags } from "opentracing";
import { KoattyContext } from "koatty_core";
import { IOCContainer } from "koatty_container";
import { DefaultLogger as Logger } from "koatty_logger";
import { GrpcStatusCodeMap, StatusCodeConvert } from "./code";
import { Output } from "./output";

/**
 * Indicates that an decorated class is a "ExceptionHandler".
 * @ExceptionHandler()
 * export class BusinessException extends Exception { 
 *    constructor(message: string, code: number, status: number) { ... }
 *    handler(ctx: KoattyContext) { 
 * 
 *      ...//Handling business exceptions 
 * 
 *    }
 * }
 *
 * @export
 * @param {string} [identifier] class name
 * @returns {ClassDecorator}
 */
export function ExceptionHandler(): ClassDecorator {
  return (target: any) => {
    const identifier = IOCContainer.getIdentifier(target);
    // if (identifier === "Exception") {
    //     throw new Error("class name cannot be `Exception`");
    // }
    // if (!identifier.endsWith("Exception")) {
    //     throw Error("class name must end with 'Exception'");
    // }
    // if (!target.prototype.type) {
    //     throw new Error("class's property 'type' must be set");
    // }
    if (!(target.prototype instanceof Exception)) {
      throw new Error(`class ${identifier} does not inherit from class 'Exception'`);
    }
    IOCContainer.saveClass("COMPONENT", target, "ExceptionHandler");
  };
}

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
    this.setCode(code);
    this.setStatus(status);
    this.setMessage(message);
    this.setSpan(span);
    this.setStack(stack);
  }

  setCode(code: number) {
    if (Helper.isNumber(code)) {
      this.code = code;
    }
    return this;
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
    if (this.stack) {
      message = `${message},stack:"${this.stack}"`;
    }
    message = `${message}}`;

    Logger.Error(message);
    // span
    if (this.span) {
      this.span.setTag(Tags.ERROR, true);
      this.span.setTag(Tags.HTTP_STATUS_CODE, ctx.status);
      this.span.setTag(Tags.HTTP_METHOD, ctx.method);
      this.span.setTag(Tags.HTTP_URL, ctx.url);
      this.span.log({ "error": message });
    }
    return;
  }

  /**
   * @description: Default exception handler
   * @param {KoattyContext} ctx
   * @return {*}
   */
  handler(ctx: KoattyContext): Promise<any> {
    try {
      ctx.status = this.status || ctx.status;
      // LOG
      this.log(ctx);
      let contentType = 'application/json';
      if (ctx.encoding !== false) {
        contentType = `${contentType}; charset=${ctx.encoding}`;
      }
      ctx.type = contentType;
      return this.output(ctx);
    } catch (error) {
      Logger.Error(error);
    }
  }

  /**
   * @description: 
   * @param {KoattyContext} ctx
   * @return {*}
   */
  output(ctx: KoattyContext): any {
    if (ctx.protocol == 'grpc') {
      // http status convert to grpc status
      if (this.code < 2) {
        this.code = StatusCodeConvert(ctx.status);
      }
      const body = JSON.stringify(ctx.body || this.message || "");
      return ctx.rpc.callback({
        code: this.code,
        details: body
      }, null);
    }

    const body = JSON.stringify(Output.fail(this.message || '', ctx.body || '', this.code));
    ctx.length = Buffer.byteLength(body);
    if (ctx.protocol == 'ws' || ctx.protocol == 'wss') {
      return ctx.websocket.send(body);
    }
    return ctx.res.end(body);
  }
}

