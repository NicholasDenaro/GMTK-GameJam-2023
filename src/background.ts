import { Scene, Sprite, SpriteEntity, SpritePainter } from "game-engine";

export class BackgroundEntity extends SpriteEntity {
  constructor(image: string, x = 0, y = 0) {
    super(new SpritePainter(Sprite.Sprites[image]), x, y);
  }
  tick(scene: Scene): void | Promise<void> {
  }
}