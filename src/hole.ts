import { Scene, Sprite, SpriteEntity, SpritePainter } from "game-engine";

export class HoleImage extends SpriteEntity {
  constructor(x: number, y: number, imageIndex: number) {
    super(new SpritePainter(Sprite.Sprites['tiles'], {spriteWidth: 16, spriteHeight: 16}), x, y);
    this.imageIndex = imageIndex;
  }

  tick(scene: Scene): void | Promise<void> {
  }
}

export class Hole extends SpriteEntity {
  constructor(scene: Scene, x: number, y: number, imageIndex: number) {
    super(new SpritePainter(ctx => {}, {spriteWidth: 8, spriteHeight: 9, spriteOffsetX: -4, spriteOffsetY: -4}), x, y);
    scene.addEntity(new HoleImage(x, y, imageIndex));
  }

  tick(scene: Scene): void | Promise<void> {
  }
}