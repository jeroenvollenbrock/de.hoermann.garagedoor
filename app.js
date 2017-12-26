const Homey = require('homey');

class HormannApp extends Homey.App {
  
  onInit() {
    this.log('HormannApp is running!');
  }
  
}

module.exports = HormannApp; 