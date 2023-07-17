import { Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";
import { Hole } from "./hole";

export class Grass extends Interactable {
  constructor(private initialX: number, private initialY: number) {
    super(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), initialX, initialY);
    this.imageIndex = 701;
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    super.reset();
  }

  playBreakSound(scene: Scene) {
    if (!scene.entitiesByType(Hole).some(hole => hole.collision(this))) {
      Sound.Sounds['cut_grass'].play();
    }
    return true;
  }
}