class EventEmitter {
    private events: { [key: string]: any };
    constructor() {
        this.events = {};
        this.on('error', this.defalutErrorHandler)
    }

    protected defalutErrorHandler(eventName: string, e: Error) {
        console.log(e.stack);
    }

    public on( eventName: string, fn: CallableFunction ):CallableFunction {
        if( !this.events[eventName] ) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(fn);

        return () =>
            this.events[eventName] = this.events[eventName].filter((eventFn: CallableFunction) => fn !== eventFn);
    }

    public emit(eventName: string, data:any) {
        const event = this.events[eventName];
        if( event ) {
            event.forEach( (fn: { call: (arg0: EventEmitter, arg1: string, arg2: any) => void; }) => {

                try {
                    fn.call(this, eventName, data)
                } catch(e) {
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
const unsubscribeListener = emitter.on('someEventType', (eventType: string, payload: any) => {
    console.log(eventType + ' ' + payload)
})

// emit event with type and payload
emitter.emit('someEventType', 'payload');
emitter.emit('someEventType2', 'payload2');

// unsubscribe listener
unsubscribeListener();

let unsubTest = emitter.on('test',(ev:string,data:string) => {console.log(data); throw new Error('TestError')});

emitter.emit('test', 'test1');
emitter.emit('test', 'test2');
