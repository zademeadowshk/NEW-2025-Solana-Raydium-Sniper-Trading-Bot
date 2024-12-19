# The New 2025 Solana Raydium Sniper Bot - High-Speed Token Trading | Free Crypto Trading Bot for USDC/SOL Pools | Profit-Powered Automation (Updated December 2024) 
SIORA The New 2025 Solana Raydium Sniper Bot: a free, high-speed crypto trading tool for sniping new Raydium USDC/SOL pools. Execute token buys before they hit the Raydium UI, leveraging optimized RPC nodes for maximum profit. Perfect for Solana blockchain enthusiasts and traders trading memecoins / memecoin seeking automated crypto profits.

![](readme/siora.jpg)

**Why Choose This Bot?**

This "New 2025 Solana Raydium Sniper Bot" is the ONLY original, cutting-edge tool for high-speed token trading on Solana. Unlike outdated or lower-quality imitators, this bot is built with the latest optimizations and features to ensure top-tier performance.

This Bot listens to new Raydium USDC or SOL pools and buys tokens for a fixed amount in USDC/SOL.
Depending on the speed of the RPC node, the purchase usually happens before the token is available on Raydium UI for swapping. You can run it for a few hours to check the earnings. If you want to support me, my Telegram is at the bottom. Note: Even for testing, besides using WSOL as the exchange token, it’s important to keep more SOL for transaction fees. The correct configuration is 0.9 SOL / 0.1 WSOL.

- `WSOL Snipe`
- `Auto-Sell`
- `TP/SL`
- `Min Liq`
- `Burn/Lock Check`
- `Renounce Check`
- `Fast Buy`

> [!NOTE]
> This is provided as is, for learning purposes.

## SETUP
To run the script you need to:
1. Use your Solana Wallet that you use for trading tokens
2. Have some SOL in it
3. Convert some SOL to USDC or WSOL (you need USDC or WSOL depending on the configuration set below, we personally use WSOL mostly, as it is faster.)

`Jupiter Wrap` : https://jup.ag/ (To Convert SOL To WSOL)

![](readme/jupiterwrap.png)

4. The ratio I suggest is 1:10, that is, for every 1 WSOL / USDC you'll use per trade, have 10 SOL in the wallet (so if you're using 0.1 WSOL / USDC per trade, have 1 SOL in wallet. Just make sure you have more SOL than WSOL / USDC)
5. Although SIORA has a 95%+ Win Rate, only use the amount that you're okay losing.
6. Never put all your eggs in one basket, but also, make sure you don't miss out on a golden basket, which is SIORA ;)

## CONFIG
1. Configure the script by updating `.env.example` file (**remove the .example from the file name when done, make sure its .env extension**).
2. `PRIVATE_KEY` (your wallet private key)
3. `RPC_ENDPOINT` (https RPC endpoint, you can use Helius / Quicknode to get a free fast rpc nodes if you're just testing)
4. `RPC_WEBSOCKET_ENDPOINT` (websocket RPC endpoint, I'll suggest helius / quicknode, if testing)
5. `QUOTE_MINT` (which pools to snipe, USDC or WSOL)
6. `QUOTE_AMOUNT` (amount used to buy each new token)
7. `COMMITMENT_LEVEL` 
8. `CHECK_IF_IS_BURNED` (liquidity burn check)
9. `CHECK_IF_IS_LOCKED` (liquidity lock check)
10. `USE_SNIPE_LIST` (buy only tokens listed in snipe-list.txt)
11. `SNIPE_LIST_REFRESH_INTERVAL` (how often snipe list should be refreshed in milliseconds)
12. `CHECK_IF_MINT_IS_RENOUNCED` (script will buy only if mint is renounced)
13. `MIN_POOL_SIZE` (script will buy only if pool size is greater than specified amount)
14. `TAKE_PROFIT=50` (in %)
15. `STOP_LOSS=30` (in %)
16. `BIRDEYE_API_KEY=` (TP/SL, Burn/Lock) generate it for free here : https://docs.birdeye.so/docs/authentication-api-keys

![](readme/env.png)
  
## INSTALL
(You can always put this Readme File into ChatGPT & ask for a Detailed Step-by-Step Installation Tutorial From Scratch if you're new to installing bots.)

---
1. Navigate the bot by typing `cd (bot file location)`
2. Install dependencies by typing: `npm install`
3. Run the script by typing: `npm run start` in terminal

![](readme/preview.png)

## TAKE PROFIT

> [!NOTE]
> By default, 50 % 

## STOP LOSS

> [!NOTE]
> By default, 30 %

## AUTO SELL
By default, auto sell is enabled. If you want to disable it, you need to:
1. Change variable `AUTO_SELL` to `false`
2. Update `MAX_SELL_RETRIES` to set the maximum number of retries for selling token
3. Update `AUTO_SELL_DELAY` to the number of milliseconds you want to wait before selling the token (this will sell the token after the specified delay. (+- RPC node speed)).

If you set AUTO_SELL_DELAY to 0, token will be sold immediately after it is bought.
There is no guarantee that the token will be sold at a profit or even sold at all. The developer is not responsible for any losses incurred by using this feature.

![](readme/token.png)

## SNIPE LIST
By default, script buys each token which has a new liquidity pool created and open for trading.
There are scenarios when you want to buy one specific token as soon as possible during the launch event.
To achieve this, you'll have to use snipe list.
1. Change variable `USE_SNIPE_LIST` to `true` 
2. Add token mint addresses you wish to buy in `snipe-list.txt` file (add each address as a new line).

This will prevent script from buying everything, and instead it will buy just listed tokens.
You can update the list while script is running. Script will check for new values in specified interval (`SNIPE_LIST_REFRESH_INTERVAL`).

Pool must not exist before the script starts.
It will buy only when new pool is open for trading. If you want to buy token that will be launched in the future, make sure that script is running before the launch.

![](readme/snipelist.png)


## COMMON ISSUES

> [!IMPORTANT]
> If you have an error which is not listed here, please create a new issue in this repository.
> To collect more information on an issue, please change `LOG_LEVEL` to `debug`.
> 
> ### EMPTY TRANSACTION
> If you see empty transactions on SolScan most likely fix is to change commitment level to `finalized`.
> 
> ### UNSOPPORTED RPC NODE
> If you see following error in your log file:  
> `Error: 410 Gone:  {"jsonrpc":"2.0","error":{"code": 410, "message":"The RPC call or parameters have been disabled."}, "id": "986f3599-b2b7-47c4-b951-074c19842bad"}`  
> It means your RPC node doesn't support methods needed to execute script.
> FIX: Change your RPC node. You can use Shyft, Helius or Quicknode. 
> 
> ### NO TOKEN ACCOUNT
> If you see following error in your log file:  
> `Error: No SOL token account found in wallet:`  
> it means that wallet you provided doesn't have USDC/WSOL token account.
> FIX: Go to dex and swap some SOL to USDC/WSOL. When you swap sol to wsol you should see it in wallet.
>
> ### Tokens Deducted
> After a few successful transactions we might charge some fee

## CONTACT
I'm Hiring for Siora
Also Available For Hire

Any support will motivate us into constantly updating the bot and add new features and finally release a global version. If you use this bot please leave a tip at Solana Addres:

EjB9z23evnXU3MUkKUFqWDGXfrkBLdYFdNCpuHe97RoW

## DISCLAIMER

> [!IMPORTANT]
> Use this script at your own risk.


Tags: Solana Bot, Solana Sniper Bot, Solana Sniping Bot, Solana Sniper, Solana Sniping, Raydium Bot, Raydium Sniper Bot, Raydium Sniping Bot, Raydium Sniper, Raydium Sniping, Raydium Pool, Memecoins, Meme Coins, Memecoins Bot, Memecoins Sniper Bot, Memecoins Sniping Bot, Memecoins Sniper, Memecoins Sniping, Pump Fun Sniper, Pump Fun Bot, Pump Fun Sniping, Pump Fun Sniper Bot, Pump Fun Sniping Bot
