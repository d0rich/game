import { Controller } from './Controller';

export class RemoteController extends Controller {
  constructor(id: string, ws: WebSocket) {
    super();
    const personalId = `controller:${id}:action:`;
    ws.addEventListener('message', (message) => {
      const action = message.toString();
      if (!action.startsWith(personalId)) {
        return;
      }
      this.dispatchEvent(new Event(action.replace(personalId, '')));
    });
  }
}
