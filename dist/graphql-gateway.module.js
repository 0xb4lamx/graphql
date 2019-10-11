"use strict";
var GraphQLGatewayModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const apollo_server_express_1 = require("apollo-server-express");
const core_1 = require("@nestjs/core");
const graphql_constants_1 = require("./graphql.constants");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
let GraphQLGatewayModule = GraphQLGatewayModule_1 = class GraphQLGatewayModule {
    constructor(httpAdapterHost, buildService, options) {
        this.httpAdapterHost = httpAdapterHost;
        this.buildService = buildService;
        this.options = options;
    }
    static forRoot(options) {
        return {
            module: GraphQLGatewayModule_1,
            providers: [
                {
                    provide: graphql_constants_1.GRAPHQL_GATEWAY_MODULE_OPTIONS,
                    useValue: options,
                },
            ],
        };
    }
    onModuleInit() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.httpAdapterHost)
                return;
            const { httpAdapter } = this.httpAdapterHost;
            if (!httpAdapter)
                return;
            const { ApolloGateway } = load_package_util_1.loadPackage('@apollo/gateway', 'ApolloGateway');
            const app = httpAdapter.getInstance();
            const { options: { __exposeQueryPlanExperimental, debug, serviceList, path, disableHealthCheck, onHealthCheck, cors, bodyParserConfig, installSubscriptionHandlers, }, buildService, } = this;
            const gateway = new ApolloGateway({
                __exposeQueryPlanExperimental,
                debug,
                serviceList,
                buildService,
            });
            const { schema, executor } = yield gateway.load();
            this.apolloServer = new apollo_server_express_1.ApolloServer({
                executor,
                schema,
            });
            this.apolloServer.applyMiddleware({
                app,
                path,
                disableHealthCheck,
                onHealthCheck,
                cors,
                bodyParserConfig,
            });
            if (installSubscriptionHandlers) {
                throw new Error('No support for subscriptions yet when using Apollo Federation');
            }
        });
    }
};
GraphQLGatewayModule = GraphQLGatewayModule_1 = tslib_1.__decorate([
    common_1.Module({}),
    tslib_1.__param(0, common_1.Optional()),
    tslib_1.__param(1, common_1.Optional()), tslib_1.__param(1, common_1.Inject(graphql_constants_1.GRAPHQL_GATEWAY_BUILD_SERVICE)),
    tslib_1.__param(2, common_1.Inject(graphql_constants_1.GRAPHQL_GATEWAY_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [core_1.HttpAdapterHost, Function, Object])
], GraphQLGatewayModule);
exports.GraphQLGatewayModule = GraphQLGatewayModule;
