// EncryptUtils.js - ECDH 前向保密方案

import config from "../config";

function createECPublicKeyRaw(xB64, yB64) {
    const x = Uint8Array.from(atob(xB64), c => c.charCodeAt(0))
    const y = Uint8Array.from(atob(yB64), c => c.charCodeAt(0))

    const x32 = new Uint8Array(32)
    const y32 = new Uint8Array(32)
    x32.set(x.slice(-32), 0)
    y32.set(y.slice(-32), 0)

    const ecPoint = new Uint8Array(65)
    ecPoint[0] = 0x04
    ecPoint.set(x32, 1)
    ecPoint.set(y32, 33)

    return ecPoint.buffer
}

async function importECPublicKey(pubKeyData) {
    let keyData

    if (typeof pubKeyData === 'string') {
        const b64 = pubKeyData
            .replace(/-----BEGIN EC PUBLIC KEY-----/, '')
            .replace(/-----END EC PUBLIC KEY-----/, '')
            .replace(/\s/g, '')
        const binary = atob(b64)
        const derBuffer = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
            derBuffer[i] = binary.charCodeAt(i)
        }
        keyData = derBuffer.buffer
    } else {
        keyData = createECPublicKeyRaw(pubKeyData.x, pubKeyData.y)
    }

    return await crypto.subtle.importKey(
        'raw',
        keyData,
        {name: 'ECDH', namedCurve: 'P-256'},
        false,
        []
    )
}

async function generateEphemeralKeyPair() {
    return await crypto.subtle.generateKey(
        {name: 'ECDH', namedCurve: 'P-256'},
        true,
        ['deriveKey', 'deriveBits']
    )
}

async function exportPublicKey(key) {
    const jwk = await crypto.subtle.exportKey('jwk', key)

    const xBytes = base64UrlToBytes(jwk.x)
    const yBytes = base64UrlToBytes(jwk.y)

    const result = new Uint8Array(65)
    result[0] = 0x04
    result.set(xBytes, 1)
    result.set(yBytes, 33)

    return result
}

async function ecdhDeriveSharedKey(privateKey, publicKey) {
    const shared = await crypto.subtle.deriveBits(
        {name: 'ECDH', public: publicKey},
        privateKey,
        256
    )

    const hashBuffer = await crypto.subtle.digest('SHA-256', shared)
    return hashBuffer
}

function base64UrlToBytes(s) {
    let base64 = s.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
    }
    const result = new Uint8Array(32)
    result.set(bytes.slice(-32), 0)
    return result
}

function toBase64(buffer) {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
}


// 预初始化 ECDH 密钥材料 — 确保只需生成一次，后续请求直接使用缓存
async function ensureInitialized(serverPublicKey) {
    if (isInitialized && cachedSharedKey) {
        return;
    }
    // 避免并发重复初始化
    if (initPromise) {
        return initPromise;
    }
    initPromise = (async () => {

        const serverPubKey = await importECPublicKey(serverPublicKey);
        cachedServerPubKey = serverPublicKey;
        const clientKeyPair = await generateEphemeralKeyPair();
        cachedClientKeyPair = clientKeyPair;
        const clientPubKeyRaw = await exportPublicKey(clientKeyPair.publicKey);
        cachedClientPubKeyRaw = clientPubKeyRaw.buffer;
        cachedSharedKey = await ecdhDeriveSharedKey(clientKeyPair.privateKey, serverPubKey);
        // 缓存 clientD 用于解密
        const jwk = await crypto.subtle.exportKey('jwk', clientKeyPair.privateKey);
        let dBase64 = jwk.d.replace(/-/g, '+').replace(/_/g, '/');
        while (dBase64.length % 4 !== 0) dBase64 += '=';
        cachedClientD = dBase64;
        lastClientPubKey = toBase64(clientPubKeyRaw);

        isInitialized = true;
    })();
    return initPromise;
}


async function importECPrivateKey(dBase64, xBase64, yBase64) {


    let fixedD = dBase64.replace(/-/g, '+').replace(/_/g, '/');
    while (fixedD.length % 4 !== 0) fixedD += '=';

    let dBytes;
    try {
        dBytes = Uint8Array.from(atob(fixedD), c => c.charCodeAt(0));
    } catch (e) {

        return null;
    }

    const xBytes = Uint8Array.from(atob(xBase64), c => c.charCodeAt(0));
    const yBytes = Uint8Array.from(atob(yBase64), c => c.charCodeAt(0));

    const d32 = new Uint8Array(32);
    const x32 = new Uint8Array(32);
    const y32 = new Uint8Array(32);
    if (dBytes.length === 32) {
        d32.set(dBytes, 0);
    } else {
        d32.set(dBytes.slice(-32), 0);
    }
    if (xBytes.length === 32) {
        x32.set(xBytes, 0);
    } else {
        x32.set(xBytes.slice(-32), 0);
    }
    if (yBytes.length === 32) {
        y32.set(yBytes, 0);
    } else {
        y32.set(yBytes.slice(-32), 0);
    }

    const jwk = {
        kty: 'EC',
        crv: 'P-256',
        d: toBase64Url(d32),
        x: toBase64Url(x32),
        y: toBase64Url(y32)
    };

    if (!jwk.d || !jwk.x || !jwk.y) {

        return null;
    }

    const key = await crypto.subtle.importKey(
        'jwk',
        jwk,
        {name: 'ECDH', namedCurve: 'P-256'},
        true,
        ['deriveBits']
    );
    return key;
}

function toBase64Url(buffer) {
    let base64 = toBase64(buffer);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}


// 读取公钥
export async function fetchPublicKey() {
    cachedServerPubKey = config.serverPubKey;
    return config.serverPubKey;
}

let cachedClientKeyPair = null;
let lastClientPubKey = '';
let cachedClientD = '';
let cachedServerPubKey = null;
let lastRequestTime = 0;
let isInitialized = false;
let initPromise = null;
let cachedSharedKey = null;
let cachedClientPubKeyRaw = null;


export function getServerPubKey() {
    return cachedServerPubKey;
}
export function getClientD() {
    return cachedClientD;
}
export function getLastClientPubKey() {
    return lastClientPubKey;
}
export function clearPublicKeyCache() {
    cachedClientKeyPair = null;
    cachedSharedKey = null;
    cachedClientPubKeyRaw = null;
    lastClientPubKey = '';
    cachedClientD = '';
    cachedServerPubKey = null;
    lastRequestTime = 0;
    isInitialized = false;
    initPromise = null;
}

//加密
export async function encryptPayload(payload, serverPublicKey) {
    // 预初始化密钥材料（首次调用时生成，后续直接使用缓存）
    await ensureInitialized(serverPublicKey);

    // 使用缓存的预派生共享密钥直接加密 — 无锁，可并行
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const aesKey = await crypto.subtle.importKey('raw', cachedSharedKey, 'AES-GCM', false, ['encrypt']);
    const encoded = new TextEncoder().encode(JSON.stringify(payload));
    const ciphertext = await crypto.subtle.encrypt({name: 'AES-GCM', iv: iv}, aesKey, encoded);

    return {
        clientPubKey: lastClientPubKey,
        iv: toBase64(iv),
        ciphertext: toBase64(ciphertext)
    };
}
//API解密
export async function decryptResponse(encryptedData) {
    if (!encryptedData || !encryptedData.encrypted || !encryptedData.ciphertext) {
        return encryptedData;
    }
    if (!encryptedData.clientPubKey) {
        return encryptedData;
    }
    if (!cachedClientD || !cachedServerPubKey) {
        clearPublicKeyCache();
        throw new Error('DECRYPT_NO_CACHE: No cached client D or server pubkey');
    }
    const {clientPubKey, iv, ciphertext} = encryptedData;
    let clientPubKeyBytes;
    try {
        clientPubKeyBytes = Uint8Array.from(atob(clientPubKey), c => c.charCodeAt(0));
    } catch (e) {
        throw new Error('DECRYPT_FAILED: Invalid base64 in clientPubKey - ' + e.message);
    }
    if (clientPubKeyBytes.length !== 65 || clientPubKeyBytes[0] !== 0x04) {
        throw new Error('DECRYPT_FAILED: Invalid clientPubKey format - expected 65 bytes with 0x04 prefix');
    }
    const clientPubX = toBase64(clientPubKeyBytes.slice(1, 33));
    const clientPubY = toBase64(clientPubKeyBytes.slice(33, 65));
    const clientPrivKey = await importECPrivateKey(cachedClientD, clientPubX, clientPubY);
    if (!clientPrivKey) {
        throw new Error('DECRYPT_FAILED: Failed to import client private key');
    }
    const serverPubKey = await importECPublicKey(cachedServerPubKey);
    const sharedKeyBuffer = await ecdhDeriveSharedKey(clientPrivKey, serverPubKey);
    if (!sharedKeyBuffer) {
        throw new Error('DECRYPT_FAILED: Failed to derive ECDH shared key');
    }
    const ivBytes = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
    const ctBytes = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    const aesKey = await crypto.subtle.importKey(
        'raw',
        sharedKeyBuffer,
        'AES-GCM',
        false,
        ['decrypt']
    );
    try {
        const decrypted = await crypto.subtle.decrypt(
            {name: 'AES-GCM', iv: ivBytes},
            aesKey,
            ctBytes
        );
        const decryptedStr = new TextDecoder().decode(decrypted);
        return JSON.parse(decryptedStr);
    } catch (e) {
        throw new Error('DECRYPT_FAILED: AES-GCM decrypt error - ' + e.message);
    }
}

//ws解密
export async function decryptWsMessage(encryptedData) {
    if (!cachedSharedKey) {
        throw new Error('WS_DECRYPT_NO_KEY: No shared key cached');
    }
    if (!encryptedData || !encryptedData.iv || !encryptedData.ciphertext) {
        return encryptedData;
    }
    try {
        const iv = Uint8Array.from(atob(encryptedData.iv), c => c.charCodeAt(0));
        const ct = Uint8Array.from(atob(encryptedData.ciphertext), c => c.charCodeAt(0));
        const aesKey = await crypto.subtle.importKey('raw', cachedSharedKey, 'AES-GCM', false, ['decrypt']);
        const plaintext = await crypto.subtle.decrypt({name: 'AES-GCM', iv}, aesKey, ct);
        return JSON.parse(new TextDecoder().decode(plaintext));
    } catch (e) {
        console.error('[WS-DECRYPT] decryptWsMessage failed:', e.message);
        throw e;
    }
}
