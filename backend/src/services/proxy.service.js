const fs = require('fs').promises;
const path = require('path');
const { logger } = require('../utils/logger');

class ProxyService {
  constructor() {
    this.dbPath = path.join(__dirname, '../../data/proxy-db.json');
    this.cfgPath = path.join(__dirname, '../../../config/3proxy.cfg');
    this.ensureDataDirectory();
  }

  async ensureDataDirectory() {
    const dir = path.dirname(this.dbPath);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
      await this.initializeDatabase();
    }
  }

  async initializeDatabase() {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify([], null, 2));
    } catch (error) {
      logger.error('Failed to initialize database:', error);
      throw new Error('Failed to initialize database');
    }
  }

  async getAllProxies() {
    try {
      const data = await fs.readFile(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      logger.error('Failed to read proxies:', error);
      throw new Error('Failed to read proxies');
    }
  }

  async addProxy(ip, port) {
    try {
      const proxies = await this.getAllProxies();
      const newProxy = { 
        id: Date.now().toString(), 
        ip, 
        port,
        bindIp: ip // Store the bind IP
      };
      proxies.push(newProxy);
      await fs.writeFile(this.dbPath, JSON.stringify(proxies, null, 2));
      await this.regenerateConfig();
      return newProxy;
    } catch (error) {
      logger.error('Failed to add proxy:', error);
      throw new Error('Failed to add proxy');
    }
  }

  async deleteProxy(id) {
    try {
      const proxies = await this.getAllProxies();
      const filteredProxies = proxies.filter(proxy => proxy.id !== id);
      await fs.writeFile(this.dbPath, JSON.stringify(filteredProxies, null, 2));
      await this.regenerateConfig();
    } catch (error) {
      logger.error('Failed to delete proxy:', error);
      throw new Error('Failed to delete proxy');
    }
  }

  async regenerateConfig() {
    try {
      const proxies = await this.getAllProxies();
      let content = `nscache 65536
timeouts 1 5 30 60 180 1800 15 60
log /dev/stdout
monitor /dev/stdout
maxconn 1000
nserver 8.8.8.8
nserver 8.8.4.4
nscache 65536
nscache6 65536
timeouts 1 5 30 60 180 1800 15 60
daemon
`;
      
      for (const { ip, port, bindIp } of proxies) {
        content += `proxy -n -a -p${port} -i${bindIp} -e${ip}
auth none
allow *\n`;
      }

      await fs.writeFile(this.cfgPath, content);
      logger.info('Configuration regenerated successfully');
    } catch (error) {
      logger.error('Failed to regenerate config:', error);
      throw new Error('Failed to regenerate configuration');
    }
  }
}

module.exports = { ProxyService }; 