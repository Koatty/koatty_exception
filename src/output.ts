/*
 * @Description: output data
 * @Usage: 
 * @Author: richen
 * @Date: 2024-01-03 22:03:34
 * @LastEditTime: 2024-03-15 06:16:52
 * @License: BSD (3-Clause)
 * @Copyright (c): <richenlin(at)gmail.com>
 */

import { Helper } from "koatty_lib";

/**
 * Interface for Api output
 */
export interface JsonResult {
  code: number; // 错误码
  message: string; // 消息内容
  data: any; // 数据
}

/**
 * Interface for Api CodeError
 */
export interface CodeError {
  code?: number;
  message?: string;
  data?: any;
}


export class Output {
  /**
   * Response to normalize json format content for success
   *
   * @param {KoattyContext} ctx  
   * @param {(string | JsonResult)} msg   待处理的message消息
   * @param {*} [data]    待处理的数据
   * @param {number} [code=200]    错误码，默认0
   * @returns {*}
   * @memberof BaseController
   */
  public static ok(msg: string | JsonResult, data?: any, code = 0): JsonResult {
    // typeof JsonResult
    if (msg && (msg as JsonResult).code !== undefined) {
      return {
        code: (<JsonResult>msg).code,
        message: (<JsonResult>msg).message,
        data: (<JsonResult>msg).data
      }
    }
    return {
      code: code,
      message: <string>msg,
      data: data
    }
  }

  /**
   * Response to normalize json format content for fail
   *
   * @param {KoattyContext} ctx   
   * @param {(Error | CodeError | string)} msg   
   * @param {*} [data]    
   * @param {number} [code=1]    
   * @returns {*}
   * @memberof BaseController
   */
  public static fail(err?: Error | CodeError | string, data?: any, code = 1): JsonResult {
    // typeof Error
    if (Helper.isError(err)) {
      return {
        code: code,
        message: (<Error>err).message,
        data: data
      }
    }
    // typeof CodeError
    if (err && (err as CodeError).code !== undefined) {
      return {
        code: (<CodeError>err).code,
        message: (<CodeError>err).message,
        data: (<CodeError>err).data
      }
    }
    return {
      code: code,
      message: "",
      data: data
    }
  }
}
