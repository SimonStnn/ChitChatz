import { initWebsocket } from "@/controller/websocket";

export class AppState {
  private _ws!: WebSocket;
  private _jwt: string | null = null;
  private _rooms: string[] = [];
  private _room: string | null = null;
  private _clientName: string | null = null;
  private _refreshInterval: NodeJS.Timeout | number | null = null;

  // Getter and Setter for WebSocket
  get ws(): WebSocket {
    return this._ws;
  }

  public setupWebSocket(): WebSocket {
    if (!this._ws) {
      this._ws = initWebsocket();
      $("#info-dialog #state-ws").text(this.ws.url);
    }
    return this._ws;
  }

  // Getter and Setter for JWT
  get jwt(): string | null {
    return this._jwt;
  }

  set jwt(value: string | null) {
    this._jwt = value;
    $("#info-dialog #state-jwt").text(String(value));
  }

  // Getter and Setter for Rooms
  get rooms(): string[] {
    return this._rooms;
  }

  set rooms(value: string[]) {
    this._rooms = value;
  }

  // Getter and Setter for Current Room
  get room(): string | null {
    return this._room;
  }

  set room(value: string | null) {
    this._room = value;
    $("#info-dialog #state-room").text(String(value));
  }

  // Getter and Setter for Client Name
  get clientName(): string | null {
    return this._clientName;
  }

  set clientName(value: string | null) {
    this._clientName = value;
    $("#client-name").text(String(value));
    $("#info-dialog #state-client-name").text(String(value));
  }

  // Getter and Setter for Refresh Interval
  get refreshInterval(): NodeJS.Timeout | number | null {
    return this._refreshInterval;
  }

  set refreshInterval(value: NodeJS.Timeout | number | null) {
    this._refreshInterval = value;
  }
}

// Create a singleton instance of AppState
const state = new AppState();
export default state;
