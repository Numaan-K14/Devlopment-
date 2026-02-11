import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

import { Transaction } from "sequelize";

// Define RequestInterface or import it from the correct location
interface RequestInterface {
  // is_apsis_user: boolean;
  query: any;
  transaction?: Transaction;
}

@Injectable({ scope: Scope.REQUEST })
export class RequestParamsService {
  // tenant: Tenant;
  // schema_name: string;
  // user: User | ApsisUser | TenantUser;
  query: any;
  // is_apsis_user: boolean = false;
  pagination: {
    limit?: number;
    offset?: number;
  };
  transaction?: Transaction;

  constructor(@Inject(REQUEST) private readonly request: RequestInterface) {
    // this.user = this.request.user;
    // this.tenant = this.request.tenant;
    // this.schema_name = this.request.tenant && this.request.tenant.schema_name;
    // this.is_apsis_user = this.request.is_apsis_user;
    this.query = this.request.query.search;
    this.pagination = this.getPagination(this.request.query);
    this.transaction = this.request.transaction;
  }

  getPagination = (query: any) => {
    let pagination = {};
    if (!(query.limit && query.page)) {
      return pagination;
    }
    query.limit = parseInt(query.limit, 10) || 2;
    query.page = parseInt(query.page, 10) + 1 || 1;
    query.offset = query.limit * (query.page - 1);
    pagination = {
      limit: query.limit || 2,
      offset: query.limit * (query.page - 1),
    };

    return pagination;
  };
}
