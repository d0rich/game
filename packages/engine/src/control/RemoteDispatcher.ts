import { Controller } from './Controller';

export class RemoteDispatcher {
  constructor(id: string, controller: Controller, ws: WebSocket) {
    const personalId = `controller:${id}:action:`;
    controller.addEventListener('left:start', () =>
      ws.send(personalId + 'left:start')
    );
    controller.addEventListener('left:stop', () =>
      ws.send(personalId + 'left:stop')
    );
    controller.addEventListener('right:start', () =>
      ws.send(personalId + 'right:start')
    );
    controller.addEventListener('right:stop', () =>
      ws.send(personalId + 'right:stop')
    );
    controller.addEventListener('up:start', () =>
      ws.send(personalId + 'up:start')
    );
    controller.addEventListener('up:stop', () =>
      ws.send(personalId + 'up:stop')
    );
    controller.addEventListener('attack1', () =>
      ws.send(personalId + 'attack1')
    );
    controller.addEventListener('attack2', () =>
      ws.send(personalId + 'attack2')
    );
    controller.addEventListener('attack3', () =>
      ws.send(personalId + 'attack3')
    );
    controller.addEventListener('punch', () => ws.send(personalId + 'punch'));
  }
}
