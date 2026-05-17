import { InputState } from '../core/game';

export function bindInput(input: InputState): () => void {
  function onKeyDown(e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp':    input.thrust = true; break;
      case 'KeyS': case 'ArrowDown':  input.brake = true; break;
      case 'KeyA': case 'ArrowLeft':  input.turnLeft = true; break;
      case 'KeyD': case 'ArrowRight': input.turnRight = true; break;
      case 'Space':    input.fireTorp = true; e.preventDefault(); break;
      case 'KeyF':     input.firePhaser = true; break;
      case 'KeyC':     input.cloakPressed = true; break;
      case 'Tab':      input.mapToggle = true; e.preventDefault(); break;
      case 'KeyB':     input.bombKey = true; break;
      case 'KeyV':     input.beamDownKey = true; break;
      case 'KeyG':     input.beamUpKey = true; break;
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    switch (e.code) {
      case 'KeyW': case 'ArrowUp':    input.thrust = false; break;
      case 'KeyS': case 'ArrowDown':  input.brake = false; break;
      case 'KeyA': case 'ArrowLeft':  input.turnLeft = false; break;
      case 'KeyD': case 'ArrowRight': input.turnRight = false; break;
    }
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);

  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  };
}
