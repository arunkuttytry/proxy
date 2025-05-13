const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, 'proxy-db.json');
const cfgPath = path.join(__dirname, '../config/3proxy.cfg');

let proxies = require(dbPath);

function generateConfig() {
  let content = \`nscache 65536\ntimeouts 1 5 30 60 180 1800 15 60\nlog /dev/stdout\n\`;
  for (const { ip, port } of proxies) {
    content += \`proxy -n -a -p\${port} -i\${ip} -e\${ip}\nauth none\nallow *\n\`;
  }
  fs.writeFileSync(cfgPath, content);
}

app.get('/proxies', (req, res) => res.json(proxies));

app.post('/add', (req, res) => {
  const { ip, port } = req.body;
  proxies.push({ ip, port });
  fs.writeFileSync(dbPath, JSON.stringify(proxies, null, 2));
  generateConfig();
  res.json({ message: 'Proxy added', proxies });
});

app.post('/generate', (_, res) => {
  generateConfig();
  res.json({ message: 'Config regenerated' });
});

app.listen(4000, () => {
  console.log('Proxy UI API running on http://localhost:4000');
  generateConfig();
});