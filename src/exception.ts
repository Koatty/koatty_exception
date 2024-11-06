/**
 * @ author: richen
 * @ copyright: Copyright (c) - <richenlin(at)gmail.com>
 * @ license: BSD (3-Clause)
 * @ version: 2020-12-15 11:49:15
 */

import { IOCContainer } from "koatty_container";
import { KoattyContext } from "koatty_core";
import { Helper } from "koatty_lib";
import { DefaultLogger as Logger } from "koatty_logger";
import { Span, Tags } from "opentracing";
import { StatusCodeConvert } from "./code";
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
    this.setStack(stack);
    this.span = span;
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
   * @description: Default exception handler
   * @param {KoattyContext} ctx
   * @return {*}
   */
  async handler(ctx: KoattyContext): Promise<any> {
    try {
      ctx.status = this.status || ctx.status;
      // LOG
      this._log(ctx);
      ctx.type = ctx.encoding !== false ? `application/json; charset=${ctx.encoding}` : 'application/json';
      return this._output(ctx);
    } catch (error) {
      Logger.Error(error);
    }
  }

  /**
   * @description: logger
   * @param {KoattyContext} ctx
   * @return {*}
   */
  protected _log(ctx: KoattyContext) {
    const now = Date.now();
    const stackMessage = this.stack ? `,stack:"${this.stack}"` : '';
    const message = `{"startTime":"${ctx.startTime}","duration":"${now - ctx.startTime}","requestId":"${ctx.requestId}","endTime":"${now}","path":"${ctx.originalPath || '/'}","message":"${this.message}"${stackMessage}}`;

    Logger.Error(message);
    // span
    if (this.span) {
      this.span.setTag(Tags.ERROR, true);
      this.span.setTag(Tags.HTTP_STATUS_CODE, ctx.status);
      this.span.setTag(Tags.HTTP_METHOD, ctx.method);
      this.span.setTag(Tags.HTTP_URL, ctx.url);
      this.span.log({ "error": message });
    }
  }

  /**
   * @description: 
   * @param {KoattyContext} ctx
   * @return {*}
   */
  protected _output(ctx: KoattyContext): any {
    const isGrpc = ctx.protocol === 'grpc';
    const isWebSocket = ctx.protocol === 'ws' || ctx.protocol === 'wss';
    const responseBody = this.message || "";

    if (isGrpc) {
      if (this.code < 2) {
        this.code = StatusCodeConvert(ctx.status);
      }
      return ctx.rpc.callback({
        code: this.code,
        details: JSON.stringify(ctx.body || responseBody)
      }, null);
    }

    const body = JSON.stringify(Output.fail(responseBody, ctx.body || '', this.code));
    ctx.length = Buffer.byteLength(body);

    if (isWebSocket) {
      return ctx.websocket.send(body);
    }

    return ctx.res.end(body);
  }
}

