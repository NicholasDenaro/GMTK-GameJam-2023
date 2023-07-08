import { Scene, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";
import { Grass } from "./grass";

export class Explosion extends SpriteEntity {
  private first = true;
  constructor(x: number, y: number) {
    super(new SpritePainter(Sprite.Sprites['explosion'], {spriteWidth: 32, spriteHeight: 32, spriteOffsetX: -16, spriteOffsetY: -16}), x, y);
  }

  private imageTimer = 0;
  tick(scene: Scene): void | Promise<void> {
    if (this.first) {
      scene.entitiesByType(Interactable).forEach(interactable => {
        if (interactable instanceof Grass) {
          if (interactable.collision(this)) {
            scene.removeEntity(interactable);
          }
        }
      });

      this.first = false;
    }
    this.imageTimer++;
    if (this.imageTimer >= 5) {
      this.imageIndex++;
      if (this.imageIndex >= Sprite.Sprites['explosion'].getGrid().columns) {
        scene.removeEntity(this);
      }
    }
  }
}