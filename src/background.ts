import { Scene, Sprite, SpriteEntity, SpritePainter } from "game-engine";

export class BackgroundEntity extends SpriteEntity {
  constructor(image: string) {
    super(new SpritePainter(Sprite.Sprites[image]));
  }
  tick(scene: Scene): void | Promise<void> {
  }
}