import logger from "electron-log";

const RECONNECT_TIME = 5000;

export interface IWebSocketMessage {
    /** Data payload sent by server */
    data: any;
    /** Name of event that triggered this message */
    name: string;
    /** Url origin for this message */
    url: string;
}

/**
 * Client Wrapper for the default Browser WebSocket Object
 */
export default class WebSocketClient {

    /** Native WebSocket Client */
    private connection: WebSocket;
    /** Array holding the listeners attached to this object */
    private listeners: Array<{
        /** name associated with the listner */
        name: string,
        /** function associated with event */
        handler: (msg: IWebSocketMessage | Event) => void
    }>;
    /** WebSocket Server url */
    private url: string;

    constructor(url: string) {
        // tslint:disable-next-line: completed-docs
        function replacer(match: string, p1: string) {
            return `ws${p1}`;
        }
        const httpre = new RegExp("http\(s?://\)");
        this.url = url.replace(httpre, replacer);

        this.connection = new WebSocket(this.url);
        this.listeners = [];

        this.open(this.url);
    }

    /** Establishes the Websocket connection */
    public open(url: string) {
        // tslint:disable-next-line: completed-docs
        function replacer(match: string, p1: string) {
            return `ws${p1}`;
        }
        const httpre = new RegExp("http\(s?://\)");
        url = url.replace(httpre, replacer);

        this.connection = new WebSocket(url);

        this.connection.onopen = (...args) => {
            logger.info("WebSocketClient: open", ...args);
        }
        this.connection.onerror = (...args) => {
            logger.error("WebSocketClient: error", ...args);	
        }
        this.connection.onclose = (...args) => {
            logger.info("WebSocketClient: closed", ...args);	
        }

        this.connection.addEventListener("close", (e) => {
            if (e.code !== 1000) {
                this.reconnect();
            }
        });

        // Persist listeners when connection is reset
        this.listeners.forEach((item) => {
            this.on(item.name, item.handler, true);
        });
    }

    /**
     * Bind to an event sent by the server given by name
     * @param name event to bind to
     */
    public on(name: string, handler: (msg: IWebSocketMessage | Event) => void, nopersist?: boolean) {
        if (name === "open" || name === "close" || name === "error") {
            const listener = (ev: Event) => {
                handler(ev);
            };
            this.connection.addEventListener(name, listener);
        } else {
            const listener: any = (msg: MessageEvent) => {
                const serverMsg = JSON.parse(msg.data);
                if (serverMsg.type === name) {
                    handler(this.formatWebSocketMessage(msg));
                }
            };
            this.connection.addEventListener("message", listener);
        }

        if (!nopersist) {
            // Persist listeners when connection is reset
            this.listeners.push({ name, handler });
        }
    }

    /**
     * Close the websocket connection
     */
    public close() {
        this.connection.close();
    }

    /**
     * Sends data to the server
     */ 
    public send(data: any) {
        this.connection.send(JSON.stringify(data));
    }

    /**
     * Attempts to reconnect to the WebSocket Server
     */
    private reconnect() {
        setTimeout(() => {
            logger.info("WebSocketClient: reconnecting...");
            this.open(this.url);
        }, RECONNECT_TIME);
    }

    /**
     * Get a better object from the MessageEvent returned by WebSocket
     * @param msg msg to convert
     * @returns {IWebSocketMessage} converted object
     */
    private formatWebSocketMessage(msg: MessageEvent): IWebSocketMessage {
        const serverMsg = JSON.parse(msg.data);
        return {
            name,
            data: serverMsg.payload,
            url: msg.origin,
        };
    }
}
