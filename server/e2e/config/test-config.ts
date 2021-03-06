import path from 'path';

import { API_PATH } from '../../../shared/shared-constants';
import { DefaultAssetNamingStrategy } from '../../src/config/asset-naming-strategy/default-asset-naming-strategy';
import { VendureConfig } from '../../src/config/vendure-config';

import { TestingAssetPreviewStrategy } from './testing-asset-preview-strategy';
import { TestingAssetStorageStrategy } from './testing-asset-storage-strategy';
import { TestingEntityIdStrategy } from './testing-entity-id-strategy';

/**
 * We use a relatively long timeout on the initial beforeAll() function of the
 * e2e tests because on the first run (and always in CI) the sqlite databases
 * need to be generated, which can take a while.
 */
export const TEST_SETUP_TIMEOUT_MS = 120000;

/**
 * Config settings used for e2e tests
 */
export const testConfig: VendureConfig = {
    port: 3050,
    apiPath: API_PATH,
    cors: true,
    defaultChannelToken: 'e2e-default-channel',
    authOptions: {
        sessionSecret: 'some-secret',
        tokenMethod: 'bearer',
        requireVerification: true,
    },
    dbConnectionOptions: {
        type: 'sqljs',
        database: new Uint8Array([]),
        location: '',
        autoSave: false,
        logging: false,
    },
    promotionOptions: {},
    customFields: {},
    entityIdStrategy: new TestingEntityIdStrategy(),
    paymentOptions: {
        paymentMethodHandlers: [],
    },
    emailOptions: {
        emailTemplatePath: __dirname,
        transport: {
            type: 'none',
        },
    },
    importExportOptions: {
        importAssetsDir: path.join(__dirname, '..', 'fixtures'),
    },
    assetOptions: {
        assetNamingStrategy: new DefaultAssetNamingStrategy(),
        assetStorageStrategy: new TestingAssetStorageStrategy(),
        assetPreviewStrategy: new TestingAssetPreviewStrategy(),
    },
};
