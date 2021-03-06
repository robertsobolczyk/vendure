import {
    CreateCustomer,
    CreateCustomerInput,
    GetCustomer,
    GetCustomerList,
    UpdateAddressInput,
    UpdateCustomer,
    UpdateCustomerAddress,
    UpdateCustomerInput,
} from 'shared/generated-types';

import {
    CREATE_CUSTOMER,
    GET_CUSTOMER,
    GET_CUSTOMER_LIST,
    UPDATE_CUSTOMER,
    UPDATE_CUSTOMER_ADDRESS,
} from '../definitions/customer-definitions';

import { BaseDataService } from './base-data.service';

export class CustomerDataService {
    constructor(private baseDataService: BaseDataService) {}

    getCustomerList(take: number = 10, skip: number = 0) {
        return this.baseDataService.query<GetCustomerList.Query, GetCustomerList.Variables>(
            GET_CUSTOMER_LIST,
            {
                options: {
                    take,
                    skip,
                },
            },
        );
    }

    getCustomer(id: string) {
        return this.baseDataService.query<GetCustomer.Query, GetCustomer.Variables>(GET_CUSTOMER, { id });
    }

    createCustomer(input: CreateCustomerInput, password?: string) {
        return this.baseDataService.mutate<CreateCustomer.Mutation, CreateCustomer.Variables>(
            CREATE_CUSTOMER,
            {
                input,
                password,
            },
        );
    }

    updateCustomer(input: UpdateCustomerInput) {
        return this.baseDataService.mutate<UpdateCustomer.Mutation, UpdateCustomer.Variables>(
            UPDATE_CUSTOMER,
            {
                input,
            },
        );
    }

    updateCustomerAddress(input: UpdateAddressInput) {
        return this.baseDataService.mutate<UpdateCustomerAddress.Mutation, UpdateCustomerAddress.Variables>(
            UPDATE_CUSTOMER_ADDRESS,
            {
                input,
            },
        );
    }
}
