import { Scene, Sound } from "game-engine";
import { FPS } from "./game";
import { Player } from "./player";
import { GameEntity } from "./game-entity";
import { Hole } from "./hole";

export class Interactable extends GameEntity {
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
          if (!this.playBreakSound(scene)) {
            if (!scene.entitiesByType(Hole).some(hole => hole.collision(this))) {
              Sound.Sounds['dig'].play();
            } else {
              Sound.Sounds['fall'].play();
            }
          }
        } else {
          if (!this.playBreakSound(scene)) {
            if (!scene.entitiesByType(Hole).some(hole => hole.collision(this))) {
              Sound.Sounds['dig'].play();
            } else {
              Sound.Sounds['fall'].play();
            }
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

    if (!this.carried && !this.thrown && scene.entitiesByType(Hole).some(hole => hole.collision(this))) {
      scene.removeEntity(this);
      Sound.Sounds['fall'].play();
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

  playBreakSound(scene: Scene) {
    return false;
  }
}