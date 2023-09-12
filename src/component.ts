/*
 * @Description: 
 * @Usage: 
 * @Author: richen
 * @Date: 2022-01-25 10:32:15
 * @LastEditTime: 2023-09-12 10:48:58
 */

import { IOCContainer } from "koatty_container";
import { Exception } from "./exception";

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
