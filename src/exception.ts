/**
 * @ author: richen
 * @ copyright: Copyright (c) - <richenlin(at)gmail.com>
 * @ license: BSD (3-Clause)
 * @ version: 2020-12-15 11:49:15
 */

import { gRPCHandler } from "./handler/grpc";
import { httpHandler } from "./handler/http";
import { wsHandler } from "./handler/ws";


/**
 * Predefined runtime exception
 *
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class Exception extends Error {
    public status: number;
    public code: number;
    readonly type = "Exception";

    /**
     * Creates an instance of Exception.
     * @param {string} message
     * @param {number} [code=1]
     * @param {number} [status]
     * @memberof Exception
     */
    constructor(message: string, code = 1, status = 0) {
        super(message);
        this.status = status;
        this.code = code;
    }

    /**
     * Default exception handler
     *
     * @param {KoattyContext} ctx
     * @returns {*}  
     * @memberof Exception
     */
    async default(ctx: any): Promise<any> {
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

