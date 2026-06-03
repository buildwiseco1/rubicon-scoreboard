const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/predictions.json', 'utf8'));
const baseRequired = ['id', 'asset', 'direction', 'deadline', 'confidence'];
const tradeRequired = [...baseRequired, 'entry', 'target', 'stopLoss'];

let errors = 0;

data.forEach(p => {
  const required = p.category === 'trade' ? tradeRequired : baseRequired;
  required.forEach(field => {
    if (p[field] === undefined || p[field] === null || p[field] === '') {
      console.error(`❌ PRED ${p.id} missing field: ${field}`);
      errors++;
    }
  });
});

if (errors === 0) {
  console.log('✅ predictions.json valid');
} else {
  console.error(`${errors} error(s) found`);
  process.exit(1);
}