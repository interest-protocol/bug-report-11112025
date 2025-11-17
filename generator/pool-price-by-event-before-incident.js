const fs = require('fs');

const DECIMALS = {
  MOVE: 8,
  USDC: 6,
  USDT: 6,
  WETH: 8,
  LP_TOKEN: 9,
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function calculatePoolPrice(event, coinPrices) {
  const date = formatDate(event.indexed_at);
  const pricesForDate = coinPrices[date];
  
  if (!pricesForDate) {
    console.warn(`No prices found for date: ${date}`);
    return null;
  }

  const { fas, amounts, shares } = event.data;
  
  // Calculate total USD value of assets being added
  let totalValueUSD = 0;
  
  for (let i = 0; i < fas.length; i++) {
    const token = fas[i];
    const amount = amounts[i];
    const price = pricesForDate[token];
    
    if (price === undefined) {
      console.warn(`No price found for token: ${token} on date: ${date}`);
      return null;
    }
    
    // Convert amount from raw units to human-readable units
    const decimals = DECIMALS[token] || 6;
    const amountInUnits = amount / Math.pow(10, decimals);
    
    // Calculate USD value
    const valueUSD = amountInUnits * price;
    totalValueUSD += valueUSD;
  }
  
  // Convert shares from raw units to human-readable units
  const sharesInUnits = shares / Math.pow(10, DECIMALS.LP_TOKEN);
  
  // Calculate price per LP token share
  const pricePerShare = totalValueUSD / sharesInUnits;
  
  return pricePerShare;
}

function generatePoolPrices() {
  console.log('Starting pool price generation...');
  // Read input files
  const coinPrices = JSON.parse(
    fs.readFileSync('../avg-coin-prices.json', 'utf-8')
  );
  console.log(`Loaded prices for ${Object.keys(coinPrices).length} dates`);
  
  const events = JSON.parse(
    fs.readFileSync('../add-liquidity-events-before-incident.json', 'utf-8')
  );
  console.log(`Loaded ${events.length} events`);
  
  // Calculate pool prices for each event
  const poolPrices = [];
  
  for (const event of events) {
    const price = calculatePoolPrice(event, coinPrices);
    
    if (price !== null) {
      const date = formatDate(event.indexed_at);
      
      // Calculate total value for reference
      const pricesForDate = coinPrices[date];
      let totalValueUSD = 0;
      for (let i = 0; i < event.data.fas.length; i++) {
        const token = event.data.fas[i];
        const amount = event.data.amounts[i];
        const tokenPrice = pricesForDate[token];
        const decimals = DECIMALS[token] || 6;
        const amountInUnits = amount / Math.pow(10, decimals);
        totalValueUSD += amountInUnits * tokenPrice;
      }
      
      poolPrices.push({
        id: event.id,
        pool: event.data.pool,
        date: date,
        poolTokens: event.data.fas,
        price: price,
        totalValueUSD: totalValueUSD,
        shares: event.data.shares / Math.pow(10, DECIMALS.LP_TOKEN),
      });
    }
  }
  
  // Write output file
  fs.writeFileSync(
    '../pool-price-before-incident.json',
    JSON.stringify(poolPrices, null, 2)
  );
  
  console.log(`Generated pool prices for ${poolPrices.length} events`);
}

try {
  generatePoolPrices();
  console.log('Script completed successfully');
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}

