import { Scene, Sound, Sprite, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";
import { Hole } from "./hole";

export class Pot extends Interactable {

  constructor(private initialX: number, private initialY: number) {
    super(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16, spriteOffsetX: 0, spriteOffsetY: 0 }), initialX, initialY);
    this.imageIndex = 1265;
  }

  reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    super.reset();
  }

  playBreakSound(scene: Scene) {
    if (!scene.entitiesByType(Hole).some(hole => hole.collision(this))) {
      Sound.Sounds['smash_pot'].play();
    }
    return true;
  }
}