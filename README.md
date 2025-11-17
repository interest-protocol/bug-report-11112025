# BUG Report - interestprotocol.com Incident

Due to the incident on [https://interestprotocol.com], our fronted was showing that user is quoting both coins, but wallet was displaying only one of them

Technically, contracts remains safe but users who didn't payed attention to the wallet information suffered money losses, and that's exactly what this repository is about

- [remove-liquidity-events-during-incident.json](Remove Liquidity Raw events during the incident): this is the events logs where users were affected for the pool imbalance on withdrawing one coin
- [add-liquidity-events-before-incident.json](Add Liquidity Raw events 2 days before the incident): these events are the basic structure where we will get the LP Prices to understand how much users loss due to pool imbalance
- [avg-coin-prices.json](Coin Prices): This file contains all the coins prices before and during the incident at 00:00 (from Coin Market Cap), each day for us to have a notion how much approximately users really lost
- [pool-price-before-incident.json](Pool Price before incident): this file contains all Add Liquidity above (before the incident), and the respective pool prices, and some more information generated and calculated by [generator/pool-price-by-event-before-incident.js](generator code)
- [loss-by-user.json](Loss by user/sender): this is a corelation between how much users loss in general, grouping all transactions in one array
