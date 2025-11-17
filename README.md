# BUG Report - interestprotocol.com Incident

Due to the incident on https://interestprotocol.com, our fronted was showing that user is quoting both coins, but wallet was displaying only one of them

Technically, contracts remains safe but users who didn't payed attention to the wallet information suffered money losses, and that's exactly what this repository is about

- [Remove Liquidity Raw events during the incident](remove-liquidity-events-during-incident.json): this is the events logs where users were affected for the pool imbalance on withdrawing one coin
- ()[Add Liquidity Raw events 2 days before the incident]: these events are the basic structure where we will get the LP Prices to understand how much users loss due to pool imbalance
- [Coin Prices](avg-coin-prices.json): This file contains all the coins prices before and during the incident at 00:00 (from Coin Market Cap), each day for us to have a notion how much approximately users really lost
- [Pool Price before incident](pool-price-before-incident.json): this file contains all Add Liquidity above (before the incident), and the respective pool prices, and some more information generated and calculated by [generator code](generator/pool-price-by-event-before-incident.js)
- [Loss by user/sender](loss-by-user.json): this is a corelation between how much users loss in general, grouping all transactions in one array
