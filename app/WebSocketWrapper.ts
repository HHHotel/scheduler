import logger from "electron-log";

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

    /** Interval with which to ping the server in ms */
    private static PING_INTERVAL = 30000;
    /** Timeout before attempting to reconnect to the server */
    private static RECONNECT_TIME = 5000;

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
    /** Stack of messages waiting to be send */
    private messageStack: IWebSocketMessage[] = [];

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
            this.sendAll(this.messageStack);
        }
        this.connection.onerror = (...args) => {
            logger.error("WebSocketClient: error", ...args);	
        }
        this.connection.onclose = (...args) => {
            logger.info("WebSocketClient: closed", ...args);	
            this.messageStack = [];
        }

        this.connection.onmessage = (msg: MessageEvent) => {
            const serverMsg = this.formatWebSocketMessage(msg);
            this.listeners.forEach((item) => {
                if (serverMsg.name === item.name) {
                    item.handler(serverMsg);
                }
            });
        };

        this.connection.addEventListener("close", (e) => {
            if (e.code !== 1000) {
                this.reconnect();
            }
        });

        const self = this;
        // tslint:disable-next-line: completed-docs
        function respondToPong(msg?: IWebSocketMessage) { 
            setTimeout(() => {
                self.ping();
            }, WebSocketClient.PING_INTERVAL);
        }

        this.on("pong", (msg) => respondToPong(msg as IWebSocketMessage));
        respondToPong();

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
    public send(name: string, data?: any) {
        const message: IWebSocketMessage = {
            name,
            data,
            url: this.url,
        };
        if (this.connection.readyState === WebSocket.OPEN) {
            this.connection.send(JSON.stringify(message));
        } else {
            this.messageStack.push(message);
        }
    }

    /**
     * Sends a batch of messages to the server
     * The connection is assumed to be open for this to work
     */
    public sendAll(msgList: IWebSocketMessage[]) {
        while (msgList.length > 0) {
            const msg = msgList.pop();
            this.connection.send(JSON.stringify(msg));
        }
    }

    /**
     * Pings the server
     */
    public ping() {
        this.send("ping");
    }

    /**
     * Attempts to reconnect to the WebSocket Server
     */
    private reconnect() {
        setTimeout(() => {
            logger.info("WebSocketClient: reconnecting...");
            this.open(this.url);
        }, WebSocketClient.RECONNECT_TIME);
    }

    /**
     * Get a better object from the MessageEvent returned by WebSocket
     * @param msg msg to convert
     * @returns {IWebSocketMessage} converted object
     */
    private formatWebSocketMessage(msg: MessageEvent): IWebSocketMessage {
        const serverMsg: IWebSocketMessage = JSON.parse(msg.data);
        return {
            name: serverMsg.name,
            data: serverMsg.data,
            url: msg.origin,
        };
    }
}
