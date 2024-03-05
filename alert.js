class alert extends HTMLElement {
    constructor() {
        super();

         // import only when needed
        import('../focusgroup.attr/focusgroup.js'); // https://cdn.jsdelivr.net/gh/u1ui/focusgroup.attr@4.0.0/focusgroup.js
        import('../ico.el/ico.js'); // https://cdn.jsdelivr.net/gh/u1ui/ico.el@4.0.0/ico.js

        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <style>
                @import url('https://cdn.jsdelivr.net/gh/u1ui/ico.el@4.0.0/ico.css');
                :host:not([dismissible])::part(close) { display:none; }
                :host {
                    --u1-ico-dir:'https://cdn.jsdelivr.net/npm/@material-icons/svg@1.0.11/svg/{icon}/baseline.svg';
                }
                #container {
                    display:flex;
                    gap: 1em;
                }
                #body {
                    display:flex;
                    align-items: center;
                    flex: 1 1 auto;
                    flex-wrap: wrap;
                    gap: 1em;
                }
                #close {
                    flex: 0 0 2rem;
                    padding: 0;
                    border: 0;
                    background: none;
                    font-size: 1.5em;
                    cursor: pointer;
                    line-height: 1;
                }
                #content {
                    flex:1 1 12em;
                }
                slot {
                    display:block;
                }
                slot[name=icon] {
                    font-size:1.7em;
                    color:var(--color);
                    &::slotted(*), & > u1-ico {
                        display:block;
                        font-size:inherit;
                    }
                }
                slot[name=action] {
                    display: flex;
                    justify-content: end;                    
                    flex-wrap: wrap;
                    gap: .5em;
                    flex: 0 1 auto;
                    margin-inline-start: auto;
                }
                /* slot[name=action]:empty-slot { display:none; } not possible */
            </style>
            <div id=container>
                <div id=body>
                    <slot name=icon part=icon>
                        <u1-ico icon=info></u1-ico>
                    </slot>
                    <slot id=content></slot>
                    <slot name=action u1-focusgroup></slot>
                </div>
                <button id=close part=close aria-label=close>&times;</button>
            </div>
        `;
    }
    connectedCallback() {
        this.setAttribute('role', 'alert');

        const variant = this.getAttribute('variant');
        const icon = this.getAttribute('icon') || variant2Icon[variant] || 'info';
        this.shadowRoot.querySelector('[name=icon]').innerHTML = `<u1-ico icon=${icon}></u1-ico>`;
        this.shadowRoot.querySelector('#close').onclick = () => this.hide();
    }
    show() {
        this.setAttribute('open', '');
        this.setAttribute('aria-live', 'assertive');
        getToolsContainer().appendChild(this);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.hide(), 5000);
    }
    hide() {
        this.removeAttribute('open');
    }
}

const variant2Icon = {info:'info',success:'check',warn:'warning',error:'error'};

customElements.define('u1-alert', alert);

/*
alert.info = function(message, options) {
    const el = document.createElement('u1-alert');
    el.textContent = message;
    el.setAttribute('type', 'info');
    const icon = document.createElement('u1-ico');
    icon.setAttribute('icon', 'info');
    icon.setAttribute('slot', 'icon');
    icon.style.color = 'var(--color)';
    el.append(icon);
    el.show();
    return el;
}
alert.success = function(message, options) {
    const el = alert.info(message, options);
    el.setAttribute('type', 'success');
    return el;
}
alert.warn = function(message, options) {
    const el = alert.info(message, options);
    el.setAttribute('type', 'warn');
    return el;
}
alert.error = function(message, options) {
    const el = alert.info(message, options);
    el.setAttribute('type', 'error');
    return el;
}
*/

/*
function getToolsContainer() {
    const el = document.getElementById('u1-notification-stack');
    if (el) return el;
    const div = document.createElement('div');
    div.id = 'u1-notification-stack';
    document.body.appendChild(div);
    return div;
}
*/







class Waiter {
    constructor(callback, duration) {
        this.callback = callback;
        this.duration = duration;
        this.startTime = null;
        this.timerId = null;
        this.onProgress = null;
        this.pauseTime = false; // Zeitpunkt, zu dem die Pause gestartet wurde
        this.remaining = duration; // Verbleibende Zeit bis zum Ablauf des Timers
    }
    start() {
        this.pauseTime = null;
        this.startTime = Date.now();
        this._startTimer();
        return new Promise((resolve) => {
            this.resolve = resolve;
        });
    }
    pause() {
        if (this.pauseTime) return;
        clearTimeout(this.timerId);
        this.pauseTime = Date.now();
        this.remaining -= this.pauseTime - this.startTime; // Aktualisiere die verbleibende Zeit
    }
    _startTimer() {
        this.timerId = setTimeout(() => {
            this.callback?.();
            this._clear();
        }, this.remaining);
        if (this.onProgress) this._emitProgress();
    }
    _emitProgress() {
        const interval = 100; // Wie oft der Fortschritt aktualisiert wird (in ms)
        const intervalId = setInterval(() => {
            const now = Date.now();
            const passed = now - this.startTime;
            const left = this.duration - passed;
            const progress = Math.min((passed / this.duration), 1);
            this.onProgress({ left, passed, progress });
            if (passed >= this.duration) clearInterval(intervalId);
        }, interval);
    }
    _clear() {
        clearTimeout(this.timerId);
        this.resolve();
        this.startTime = null;
        this.timerId = null;
        this.pauseTime = false;
        this.remaining = this.duration; // Zurücksetzen der verbleibenden Zeit
    }
}
