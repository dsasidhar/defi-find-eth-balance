const express = require("express");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const app = express();
const port = 3000;

// USDT contract address on Ethereum mainnet
const USDT_CONTRACT_ADDRESS = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

// Initialize Moralis
async function initMoralis() {
  await Moralis.start({
    apiKey: `${process.env.MORAILS_API_KEY}`,
  });
}

initMoralis();

app.get("/balance/:address", async (req, res) => {
  try {
    const { address } = req.params;

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      address: address,
      chain: EvmChain.ETHEREUM,
      tokenAddresses: [USDT_CONTRACT_ADDRESS],
    });

    const balances = response.toJSON();

    console.log("Moralis response:", balances);

    if (balances.length > 0) {
      const usdtBalance = balances[0];
      const balanceInUsdt =
        parseFloat(usdtBalance.balance) / Math.pow(10, usdtBalance.decimals);

      res.json({
        address: address,
        usdt_balance: balanceInUsdt,
      });
    } else {
      res.json({
        address: address,
        usdt_balance: 0,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
