"use strict";
var GraphQLFederationModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const apollo_server_express_1 = require("apollo-server-express");
const metadata_scanner_1 = require("@nestjs/core/metadata-scanner");
const load_package_util_1 = require("@nestjs/common/utils/load-package.util");
const core_1 = require("@nestjs/core");
const graphql_federation_factory_1 = require("./graphql-federation.factory");
const services_1 = require("./services");
const graphql_ast_explorer_1 = require("./graphql-ast.explorer");
const graphql_types_loader_1 = require("./graphql-types.loader");
const graphql_schema_builder_1 = require("./graphql-schema-builder");
const graphql_constants_1 = require("./graphql.constants");
const utils_1 = require("./utils");
const graphql_factory_1 = require("./graphql.factory");
let GraphQLFederationModule = GraphQLFederationModule_1 = class GraphQLFederationModule {
    constructor(httpAdapterHost, options, graphqlFederationFactory, graphqlTypesLoader, graphqlFactory) {
        this.httpAdapterHost = httpAdapterHost;
        this.options = options;
        this.graphqlFederationFactory = graphqlFederationFactory;
        this.graphqlTypesLoader = graphqlTypesLoader;
        this.graphqlFactory = graphqlFactory;
    }
    static forRoot(options = {}) {
        options = utils_1.mergeDefaults(options);
        return {
            module: GraphQLFederationModule_1,
            providers: [
                {
                    provide: graphql_constants_1.GRAPHQL_MODULE_OPTIONS,
                    useValue: options,
                },
            ],
        };
    }
    static forRootAsync(options) {
        return {
            module: GraphQLFederationModule_1,
            imports: options.imports,
            providers: [
                ...this.createAsyncProviders(options),
                {
                    provide: graphql_constants_1.GRAPHQL_MODULE_ID,
                    useValue: utils_1.generateString(),
                },
            ],
        };
    }
    static createAsyncProviders(options) {
        if (options.useExisting || options.useFactory) {
            return [this.createAsyncOptionsProvider(options)];
        }
        return [
            this.createAsyncOptionsProvider(options),
            {
                provide: options.useClass,
                useClass: options.useClass,
            },
        ];
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                provide: graphql_constants_1.GRAPHQL_MODULE_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }
        return {
            provide: graphql_constants_1.GRAPHQL_MODULE_OPTIONS,
            useFactory: (optionsFactory) => optionsFactory.createGqlOptions(),
            inject: [options.useExisting || options.useClass],
        };
    }
    onModuleInit() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.httpAdapterHost)
                return;
            const { httpAdapter } = this.httpAdapterHost;
            if (!httpAdapter)
                return;
            const { printSchema } = load_package_util_1.loadPackage('@apollo/federation', 'ApolloFederation');
            const { path, disableHealthCheck, onHealthCheck, cors, bodyParserConfig, typePaths, } = this.options;
            const app = httpAdapter.getInstance();
            const typeDefs = yield this.graphqlTypesLoader.getTypesFromPaths(typePaths);
            const mergedTypeDefs = utils_1.extend(typeDefs, this.options.typeDefs);
            const apolloOptions = yield this.graphqlFederationFactory.mergeOptions(Object.assign(Object.assign({}, this.options), { typeDefs: mergedTypeDefs }));
            if (this.options.definitions && this.options.definitions.path) {
                yield this.graphqlFactory.generateDefinitions(printSchema(apolloOptions.schema), this.options);
            }
            this.apolloServer = new apollo_server_express_1.ApolloServer(apolloOptions);
            this.apolloServer.applyMiddleware({
                app,
                path,
                disableHealthCheck,
                onHealthCheck,
                cors,
                bodyParserConfig,
            });
            if (this.options.installSubscriptionHandlers) {
                throw new Error('No support for subscriptions yet when using Apollo Federation');
            }
        });
    }
};
GraphQLFederationModule = GraphQLFederationModule_1 = tslib_1.__decorate([
    common_1.Module({
        providers: [
            graphql_federation_factory_1.GraphQLFederationFactory,
            graphql_factory_1.GraphQLFactory,
            metadata_scanner_1.MetadataScanner,
            services_1.ResolversExplorerService,
            services_1.DelegatesExplorerService,
            services_1.ScalarsExplorerService,
            graphql_ast_explorer_1.GraphQLAstExplorer,
            graphql_types_loader_1.GraphQLTypesLoader,
            graphql_schema_builder_1.GraphQLSchemaBuilder,
        ],
        exports: [],
    }),
    tslib_1.__param(0, common_1.Optional()),
    tslib_1.__param(1, common_1.Inject(graphql_constants_1.GRAPHQL_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [core_1.HttpAdapterHost, Object, graphql_federation_factory_1.GraphQLFederationFactory,
        graphql_types_loader_1.GraphQLTypesLoader,
        graphql_factory_1.GraphQLFactory])
], GraphQLFederationModule);
exports.GraphQLFederationModule = GraphQLFederationModule;
