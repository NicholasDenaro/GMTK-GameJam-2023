import { ControllerState, Scene, SpriteEntity, SpritePainter } from "game-engine";
import { engine, scenes } from "./game";
import { Player } from "./player";

export class PauseMenu extends SpriteEntity {
  constructor() {
    super(new SpritePainter(() => {}, {spriteWidth: 0, spriteHeight: 0}));
  }
  tick(scene: Scene): void | Promise<void> {
    if (scene.isControl('pause', ControllerState.Press) || scene.isControl('restart', ControllerState.Press)) {
      const lastScene = scene.entitiesByType(Player)[0].lastScene;
      engine.switchToScene(lastScene);
    }
  }
}