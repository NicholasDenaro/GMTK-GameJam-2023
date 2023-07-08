import { Scene, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { FPS } from "./game";
import { Interactable } from "./interactable";
import { Grass } from "./grass";
import { Tree } from "./tree";

export class Fire extends SpriteEntity {
  private timer = FPS;
  private burningEntity: Interactable;
  private first = true;
  constructor(x: number, y: number) {
    super(new SpritePainter(Sprite.Sprites['fire2'], {spriteWidth: 16, spriteHeight: 16, spriteOffsetX: -2, spriteOffsetY: -8}), x, y);
  }

  private imageTimer = 0;
  tick(scene: Scene): void | Promise<void> {
    this.imageTimer++;
    if (this.imageTimer >= 10) {
      this.imageIndex++;
      this.imageTimer = 0;
    }
    this.imageIndex %= Sprite.Sprites['fire2'].getGrid().columns;
    if (this.first) {
      for (let interactable of scene.entitiesByType(Interactable)) {
        if ((interactable instanceof Grass || interactable instanceof Tree) && interactable.collision(this)) {
          this.burningEntity = interactable;
          this.x = interactable.getPos().x + 4;
          this.y = interactable.getPos().y;
          break;
        }
      };
      this.first = false;
    }
    this.timer--;
    if (this.timer <= 0) {
      scene.removeEntity(this);
      if (this.burningEntity) {
        scene.removeEntity(this.burningEntity);
      }
    }
  }
}