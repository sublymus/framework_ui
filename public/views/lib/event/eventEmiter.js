import UidGenerator from '/views/lib/uidGenerator/uidGenerator.js'

class EventEmiter {
    #eventsManager = { };
    #data = null;
    constructor(data) {
        this.#data = data ?? {};
    }
    /**
     * @param {String} event 
     * @param {Object} value 
     * @returns 
     */
    emite(event, value) {
        this.#avalaible(event);
        let eventData = this.#eventsManager[event];
        if (eventData == undefined) return;         // this event is not yet listened to
        if (value == undefined) value = eventData.lastValue;
        const changed = eventData.lastValue !== value;
        eventData.lastValue = value;
        const listeners = eventData.listeners;     // event listener recovery
        for (const uid in listeners) {
           
            if ((uid.charAt(0) == '#') && !changed)  continue;

            new Promise(resolve => {
                resolve(listeners[uid].listener(value , eventData.lastValue));
                listeners[uid].count= listeners[uid].count+ 1;
            });
        }
    }
    /**
     * 
     * @param {String} event  gff
     * @param {Function} listener  rdrdfg
     * @param {Boolean} onChange  dg
     * @returns dgfhhg
     */
    when(events, listener, onChange) {
        if (typeof events !== "string") throw new Error(" first param must be String value like :  when('ckick change focus' , listener)")
        let uid = (onChange ? '#' : '') + UidGenerator.generate();          // the information on the choice of the onchange is stored in the key
        events.split(' ').forEach(event => {
            if (event == '') { 
                 // console.log('j\' eliminer un empty de plus');
                return;
            }
            this.#avalaible(event);
            let eventData = this.#eventsManager[event];
            eventData = eventData ? eventData : this.#eventsManager[event] = { // first listen
                listeners: { },
                lastValue: undefined,
            };
            eventData.listeners[uid] = {
                listener: function(value , lastValue) {listener(value,{value,lastValue, event, uid , count :this.count});},
                count: 0
            }
        });
        return this;
    }

    // emiteAll(emiteRequired, events) {
    //     if (emiteRequired == undefined) {
    //         for (const event in this.#eventsManager) {
    //             this.emite(event);
    //         }
    //     } else if (emiteRequired) {
    //         events.split(' ').map(event => {
    //             console.log("event =='' :", event == '');
    //             if (event != '') this.emite(event);
    //         });
    //     } else {
    //         for (const event in this.#eventsManager) {
    //             if (events.includes(event)) continue;
    //             this.emite(event);
    //         }
    //     }

    // }

    /**
     * 
     * @param {String} event the string of event that you want remove
     * @param {String} uid uid of event that you want remove
     * @returns listener removed or undifined if id or event is note define  
     */
    remove(e) {
        this.#avalaible(e.event);
        const eventData = this.#eventsManager[e.event];
        if (eventData == undefined) return;        // this event is not yet listened to
        const listeners = eventData.listeners;
        const listenerData = listeners[e.uid];
        delete listeners[e.uid];
        return listenerData.listener;
    }
    /**
     * 
     * @param {String} event the string of event that you want verify
     * @returns undefined
     */
    #avalaible(event) {
        if (this.#data.events) {

            if (!this.#data.events.includes(event)) {

                throw new Error(`event : <<${event}>>  is not defined`);
            }
        }
        return true;
    }

}

export default EventEmiter;