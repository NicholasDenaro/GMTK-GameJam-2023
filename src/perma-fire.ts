import { Scene, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { FPS } from "./game";
import { Interactable } from "./interactable";
import { Grass } from "./grass";
import { Tree } from "./tree";

export class FireImage extends SpriteEntity {

  constructor(x: number, y: number) {
    super(new SpritePainter(Sprite.Sprites['fire2']), x, y);
  }

  private imageTimer = 0;
  tick(scene: Scene): void | Promise<void> {
    this.imageTimer++;
    if (this.imageTimer >= 10) {
      this.imageIndex++;
      this.imageTimer = 0;
    }
    this.imageIndex %= Sprite.Sprites['fire2'].getGrid().columns;
  }

}

export class PermaFire extends Interactable {
  private lit = false;
  constructor(x: number, y: number) {
    super(new SpritePainter(ctx => {}, { spriteWidth: 16, spriteHeight: 16, spriteOffsetX: 0, spriteOffsetY: 0 }), x, y);
  }

  light(scene: Scene) {
    if (!this.lit) {
      this.lit = true;
      scene.addEntity(new FireImage(this.x + 3, this.y - 2));
    }
  }
}