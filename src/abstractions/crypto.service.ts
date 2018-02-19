import {
    CipherString,
    SymmetricCryptoKey,
} from '../models/domain';

import { ProfileOrganizationResponse } from '../models/response';

export abstract class CryptoService {
    setKey: (key: SymmetricCryptoKey) => Promise<any>;
    setKeyHash: (keyHash: string) => Promise<{}>;
    setEncKey: (encKey: string) => Promise<{}>;
    setEncPrivateKey: (encPrivateKey: string) => Promise<{}>;
    setOrgKeys: (orgs: ProfileOrganizationResponse[]) => Promise<{}>;
    getKey: () => Promise<SymmetricCryptoKey>;
    getKeyHash: () => Promise<string>;
    getEncKey: () => Promise<SymmetricCryptoKey>;
    getPrivateKey: () => Promise<ArrayBuffer>;
    getOrgKeys: () => Promise<Map<string, SymmetricCryptoKey>>;
    getOrgKey: (orgId: string) => Promise<SymmetricCryptoKey>;
    clearKey: () => Promise<any>;
    clearKeyHash: () => Promise<any>;
    clearEncKey: (memoryOnly?: boolean) => Promise<any>;
    clearPrivateKey: (memoryOnly?: boolean) => Promise<any>;
    clearOrgKeys: (memoryOnly?: boolean) => Promise<any>;
    clearKeys: () => Promise<any>;
    toggleKey: () => Promise<any>;
    makeKey: (password: string, salt: string) => SymmetricCryptoKey;
    hashPassword: (password: string, key: SymmetricCryptoKey) => Promise<string>;
    makeEncKey: (key: SymmetricCryptoKey) => Promise<CipherString>;
    encrypt: (plainValue: string | Uint8Array, key?: SymmetricCryptoKey,
        plainValueEncoding?: string) => Promise<CipherString>;
    encryptToBytes: (plainValue: ArrayBuffer, key?: SymmetricCryptoKey) => Promise<ArrayBuffer>;
    decrypt: (cipherString: CipherString, key?: SymmetricCryptoKey, outputEncoding?: string) => Promise<string>;
    decryptFromBytes: (encBuf: ArrayBuffer, key: SymmetricCryptoKey) => Promise<ArrayBuffer>;
    rsaDecrypt: (encValue: string) => Promise<string>;
}
