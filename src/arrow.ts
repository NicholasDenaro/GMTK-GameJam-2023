import { Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { Wall } from "./wall";
import { Interactable } from "./interactable";
import { Grass } from "./grass";
import { screenHeight, screenWidth } from "./game";
import { Pot } from "./pot";

export class Arrow extends SpriteEntity {
  constructor(x: number, y: number, private flyDirection: number) {
    super(new SpritePainter(Sprite.Sprites['arrow'], {spriteWidth: 16, spriteHeight: 2, spriteOffsetX: -8, spriteOffsetY: -8}), x, y);
    if (flyDirection == 0 ) {
      this.imageIndex = 0;
    } else if (flyDirection == Math.PI) {
      this.imageIndex = 0;
      this.flipHorizontal = true;
    } else if (flyDirection == Math.PI / 2) {
      this.imageIndex = 1;
      this.flipVertical = true;
    } else if (flyDirection == 3 * Math.PI / 2) {
      this.imageIndex = 1;
    }
  }

  tick(scene: Scene): void | Promise<void> {
    this.x += Math.cos(this.flyDirection) * 3;
    this.y += Math.sin(this.flyDirection) * 3;

    if (this.x > screenWidth || this.x < 0 || this.y > screenHeight || this.y < 16) {
      scene.removeEntity(this);
      return;
    }

    const collisionEntities = [...scene.entitiesByType(Wall), ...scene.entitiesByType(Interactable)];

    for (let entity of collisionEntities) {
      if (entity.collision(this)) {
        scene.removeEntity(this);
        if (entity instanceof Grass || entity instanceof Pot) {
          scene.removeEntity(entity);
          Sound.Sounds['slash'].play();
        }
        break;
      }
    }
  }
}