import { DynamicModule, OnModuleInit } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GatewayBuildService, GatewayModuleOptions } from './interfaces';
export declare class GraphQLGatewayModule implements OnModuleInit {
    private readonly httpAdapterHost;
    private readonly buildService;
    private readonly options;
    private apolloServer;
    constructor(httpAdapterHost: HttpAdapterHost, buildService: GatewayBuildService, options: GatewayModuleOptions);
    static forRoot(options: GatewayModuleOptions): DynamicModule;
    onModuleInit(): Promise<void>;
}
