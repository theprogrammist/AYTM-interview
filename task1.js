class EventEmitter {
    constructor() {
        this.events = {};
        this.on('error', this.defalutErrorHandler);
    }
    defalutErrorHandler(eventName, e) {
        console.log(e.stack);
    }
    on(eventName, fn) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(fn);
        return () => this.events[eventName] = this.events[eventName].filter((eventFn) => fn !== eventFn);
    }
    emit(eventName, data) {
        const event = this.events[eventName];
        if (event) {
            event.forEach((fn) => {
                try {
                    fn.call(this, eventName, data);
                }
                catch (e) {
                    console.log('Error message: ' + e.message);
                    this.emit('error', e);
                }
            });
        }
    }
}
// construct event emitter
const emitter = new EventEmitter();
// subscribe listener to events
const unsubscribeListener = emitter.on('someEventType', (eventType, payload) => {
    console.log(eventType + ' ' + payload);
});
// emit event with type and payload
emitter.emit('someEventType', 'payload');
emitter.emit('someEventType2', 'payload2');
// unsubscribe listener
unsubscribeListener();
let unsubTest = emitter.on('test', (ev, data) => { console.log(data); throw new Error('TestError'); });
emitter.emit('test', 'test1');
emitter.emit('test', 'test2');
