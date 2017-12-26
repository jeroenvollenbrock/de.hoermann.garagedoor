'use strict';

const Homey = require('homey');

class HoermannDriver extends Homey.Driver {
    
    async onInit() {
        if(this.getDevices().length > 0) {
            await this.getSignal();
        }
    }
    
    _onPayload(data, first) {
        if(!first) return;
        const device = this.getDevice({address:data});
        if(!device || device instanceof Error ) return;
        device.onSignal();
    }

    async getSignal() {
        if(this._signal) return this._signal;
        this._signal = new Homey.Signal433('hoermann');
        this._signal.on('payload', this._onPayload.bind(this));
        return this._signal.register();
    }

    async sendSignal(device) {
        let signal = await this.getSignal();
        return signal.tx(device.getAddress());
    }
    
    async onPair( socket ) {
        let signal = await this.getSignal();
        
        let device = {
            name: 'Hörmann Garage Door',
            data: { address: null},
        };
        
        const onPayload = (payload, first) => {
            if(!first) return;
            if(device.data.address) return;
            device.data.address = payload;
            this.log('payload', payload);
            socket.emit('found_device');
        };
        signal.on('payload', onPayload);
        
        socket.on('disconnect', () => {
            signal.removeListener('payload', onPayload);
        })
        .on('done', (err, callback) => {
            callback(null, device);
        });
    }

}

module.exports = HoermannDriver;