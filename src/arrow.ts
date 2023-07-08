import { Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { Wall } from "./wall";
import { Interactable } from "./interactable";
import { Grass } from "./grass";
import { screenHeight, screenWidth } from "./game";
import { Pot } from "./pot";
import { HalfWall } from "./half-wall";
import { Switch } from "./switch";

export class Arrow extends SpriteEntity {
  constructor(x: number, y: number, private flyDirection: number) {
    super(new SpritePainter(Sprite.Sprites[flyDirection == 0 || flyDirection == Math.PI ? 'arrowH' : 'arrowV']), x, y);
    this.flipHorizontal = flyDirection == Math.PI;
    this.flipVertical = flyDirection == Math.PI / 2;
  }

  tick(scene: Scene): void | Promise<void> {
    this.x += Math.cos(this.flyDirection) * 3;
    this.y += Math.sin(this.flyDirection) * 3;

    if (this.x > screenWidth || this.x < 0 || this.y > screenHeight || this.y < 16) {
      scene.removeEntity(this);
      return;
    }

    const collisionEntities = [...scene.entitiesByType(Wall), ...scene.entitiesByType(Interactable)].filter(entity => !(entity instanceof HalfWall));

    for (let entity of collisionEntities) {
      if (entity.collision(this)) {
        scene.removeEntity(this);
        if (entity instanceof Grass || entity instanceof Pot) {
          scene.removeEntity(entity);
          Sound.Sounds['slash'].play();
        }
        if (entity instanceof Switch) {
          entity.doAction();
        }
        break;
      }
    }
  }
}