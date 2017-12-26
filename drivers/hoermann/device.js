'use strict';

const Homey = require('homey');

class HoermannDevice extends Homey.Device {

    // this method is called when the Device is inited
    async onInit() {
        this.log('device init');
        this.log('name:', this.getName());
        this.log('class:', this.getClass());

        // register a capability listener
        this.registerCapabilityListener('locked', this.onCapabilityLocked.bind(this));
        this.setCapabilityValue('locked', true); //always start in locked state.
    }

    // this method is called when the Device is added
    onAdded() {
        this.log('device added');
    }

    // this method is called when the Device is deleted
    onDeleted() {
        this.log('device deleted');
    }
    
    getAddress() {
        return this.getData().address;
    }
    
    // this method is called when a 433 signal is received. the capability listener will not be fired.
    onSignal() {
        this.log('onSignal');
        this.setCapabilityValue('locked', false);
        this._debounceLocked();
    }

    // this method is called when the Device has requested a state change (turned on or off)
    async onCapabilityLocked( value, opts ) {
        this.log('onCapabilityLocked', value);
        if(value) return;
        await this.getDriver().sendSignal(this);
        this._debounceLocked();
    }
    
    _debounceLocked() {
        if(this._lockTimer) clearTimeout(this._lockTimer);
        this._lockTimer = setTimeout(() => {
            this.setCapabilityValue('locked', true);
        }, 60*1000); //door closes after 1 min
    }

}

module.exports = HoermannDevice;