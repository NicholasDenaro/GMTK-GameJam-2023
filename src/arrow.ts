import { Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { Wall } from "./wall";
import { Interactable } from "./interactable";
import { Grass } from "./grass";
import { screenHeight, screenWidth } from "./game";
import { Pot } from "./pot";
import { HalfWall } from "./half-wall";
import { Switch } from "./switch";

export class ArrowImage extends SpriteEntity {
  constructor(private arrow: Arrow, flyDirection: number) {
    super(new SpritePainter(Sprite.Sprites[flyDirection == 0 || flyDirection == Math.PI ? 'arrowH' : 'arrowV']));
    this.flipHorizontal = flyDirection == Math.PI;
    this.flipVertical = flyDirection == Math.PI / 2;
  }

  tick(scene: Scene): void | Promise<void> {
    this.x = this.arrow.getPos().x;
    this.y = this.arrow.getPos().y;
  }
}

export class Arrow extends SpriteEntity {
  private arrowImage: ArrowImage;
  constructor(scene: Scene, x: number, y: number, private flyDirection: number) {
    super(new SpritePainter(ctx => {}, {spriteWidth: 1, spriteHeight: 1}), x, y);
    scene.addEntity(this.arrowImage = new ArrowImage(this, flyDirection));

  }

  tick(scene: Scene): void | Promise<void> {
    this.x += Math.cos(this.flyDirection) * 3;
    this.y += Math.sin(this.flyDirection) * 3;

    if (this.x > screenWidth || this.x < 0 || this.y > screenHeight || this.y < 16) {
      scene.removeEntity(this);
      scene.removeEntity(this.arrowImage);
      return;
    }

    const collisionEntities = [...scene.entitiesByType(Wall), ...scene.entitiesByType(Interactable)].filter(entity => !(entity instanceof HalfWall));

    for (let entity of collisionEntities) {
      if (entity.collision(this)) {
        scene.removeEntity(this);
        scene.removeEntity(this.arrowImage);
        if (entity instanceof Grass || entity instanceof Pot) {
          scene.removeEntity(entity);
          if (entity instanceof Pot) {
            Sound.Sounds['smash_pot'].play();
          }
          if (entity instanceof Grass) {
            Sound.Sounds['cut_grass'].play();
          }
        }
        if (entity instanceof Switch) {
          entity.doAction();
        }
        break;
      }
    }
  }
}