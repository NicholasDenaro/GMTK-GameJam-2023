import { Scene, Sound, SpriteEntity } from "game-engine";
import { FPS } from "./game";
import { Pot } from "./pot";
import { Grass } from "./grass";
import { Player } from "./player";
import { HeavyRock } from "./heavy-rocky";

export class Interactable extends SpriteEntity {
  private thrownDirection: number;
  private thrown: boolean = false;
  private carried: boolean = false;
  protected carriedBy: Player;
  private throwTimer: number = FPS * 0.3;
  tick(scene: Scene): void | Promise<void> {
    if (this.thrown) {
      this.throwTimer--;
      if (this.throwTimer <= 0) {
        const self = this;
        if (this.breakWhenThrown()) {
          scene.removeEntity(this);
          if (!this.playBreakSound()) {
            Sound.Sounds['dig'].play();
          }
        }
        
        this.thrown = false;
        this.throwTimer = FPS * 0.3;
      }
      if (this.thrownDirection == 0 || this.thrownDirection == Math.PI) {
        this.y += 0.8;
        this.x += Math.cos(this.thrownDirection) * 3;
      }
      if (this.thrownDirection == Math.PI / 2) { // down
        this.y += Math.sin(this.thrownDirection) * 3;
      }
      if (this.thrownDirection == 3 * Math.PI / 2) { // up
        this.y += Math.sin(this.thrownDirection) * 2;
      }
    }
    if (this.carried) {
      this.x = this.carriedBy.getPos().x;
      this.y = this.carriedBy.getPos().y - 16;
    }
  }

  breakWhenThrown() {
    return true;
  }

  throw(direction: number) {
    this.carried = false;
    this.carriedBy = undefined;
    this.thrown = true;
    this.thrownDirection = direction;
  }

  drop(x: number, y: number) {
    this.carried = false;
    this.carriedBy = undefined;
    this.x = x;
    this.y = y;
    this.zIndex = 0;
  }

  setCarriedBy(entity: Player) {
    this.carried = true;
    this.carriedBy = entity;
    this.zIndex = -14;
  }

  reset() {
    this.carried = false;
    this.thrown = false;
    this.throwTimer = FPS * 0.3;
    this.zIndex = 0;
  }

  playBreakSound() {
    return false;
  }
}