import { Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { FPS } from "./game";
import { Explosion } from "./explosion";

export class Bomb extends SpriteEntity {
  private timer = FPS * 2;
  constructor(x: number, y: number) {
    super(new SpritePainter(Sprite.Sprites['bomb'], {spriteWidth: 16, spriteHeight: 16, spriteOffsetX: -8, spriteOffsetY: -8}), x, y);
  }
  private imageTimer = 0;
  tick(scene: Scene): void | Promise<void> {
    if (this.timer > FPS) {
      this.imageTimer++;
    } else if (this.timer > FPS / 2) {
      this.imageTimer += 2;
    } else {
      this.imageTimer += 4;
    }
    if (this.imageTimer >= 10) {
      this.imageIndex++;
      this.imageTimer = 0;
    }
    this.imageIndex %= Sprite.Sprites['bomb'].getGrid().columns;
    this.timer--;
    if (this.timer <= 0) {
      scene.removeEntity(this);
      scene.addEntity(new Explosion(this.x - 8, this.y - 8));
      Sound.Sounds['explosion'].play();
    }
  }
}