/*
 * @Description: 
 * @Usage: 
 * @Author: richen
 * @Date: 2022-02-10 17:39:54
 * @LastEditTime: 2022-02-19 00:50:08
 */

import { KoattyContext } from "koatty_core";
import { GrpcStatusCodeMap, HttpStatusCodeMap, StatusCodeConvert } from "../code";
import { DefaultLogger as Logger } from "koatty_logger";
import { StatusBuilder } from "@grpc/grpc-js";

export class GrpcException extends Error {
    public status: number;
    public code: number;
    readonly type = "GrpcException";

    /**
     * Creates an instance of Exception.
     * @param {string} message
     * @param {number} [code=1]
     * @param {number} [status]
     * @memberof Exception
     */
    constructor(message: string, code = 2, status?: number) {
        super(message);
        this.status = status || 500;
        this.code = code || 2;
    }

    /**
     * Exception handler
     *
     * @protected
     * @returns {*}  
     * @memberof Exception
     */
    async handler(ctx: KoattyContext): Promise<any> {
        let errObj;
        try {
            // http status convert to grpc status
            const status = this.status || ctx.status;
            if (!this.code && HttpStatusCodeMap.has(status)) {
                this.code = StatusCodeConvert(status);
            }
            this.code = this.code ?? 2;
            this.message = this.message || GrpcStatusCodeMap.get(this.code) || "";

            if (this.message !== "") {
                errObj = new StatusBuilder().withCode(this.code).withDetails(this.message).build();
            } else {
                errObj = new StatusBuilder().withCode(this.code).build();
            }
            ctx.rpc.callback(errObj, null);
            return;
        } catch (error) {
            Logger.Error(error);
            ctx.rpc.callback(new StatusBuilder().withCode(2).build(), null);
            return;
        }
    }
}