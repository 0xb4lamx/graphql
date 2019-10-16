"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const apollo_server_core_1 = require("apollo-server-core");
const utils_1 = require("./utils");
const services_1 = require("./services");
const federation_1 = require("@apollo/federation");
let GraphQLFederationFactory = class GraphQLFederationFactory {
    constructor(resolversExplorerService, delegatesExplorerService, scalarsExplorerService) {
        this.resolversExplorerService = resolversExplorerService;
        this.delegatesExplorerService = delegatesExplorerService;
        this.scalarsExplorerService = scalarsExplorerService;
    }
    extendResolvers(resolvers) {
        return resolvers.reduce((prev, curr) => utils_1.extend(prev, curr), {});
    }
    mergeOptions(options = {}) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const resolvers = this.extendResolvers([
                this.resolversExplorerService.explore(),
                this.scalarsExplorerService.explore(),
                this.delegatesExplorerService.explore(),
            ]);
            const schema = federation_1.buildFederatedSchema([
                {
                    typeDefs: apollo_server_core_1.gql `${options.typeDefs}`,
                    resolvers,
                }
            ]);
            return Object.assign(Object.assign({}, options), { schema, typeDefs: undefined });
        });
    }
};
GraphQLFederationFactory = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [services_1.ResolversExplorerService,
        services_1.DelegatesExplorerService,
        services_1.ScalarsExplorerService])
], GraphQLFederationFactory);
exports.GraphQLFederationFactory = GraphQLFederationFactory;
