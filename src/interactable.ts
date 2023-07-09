import { Scene, Sound, SpriteEntity } from "game-engine";
import { FPS } from "./game";

export class Interactable extends SpriteEntity {
  private thrownDirection: number;
  private thrown: boolean = false;
  private carried: boolean = false;
  private carriedBy: SpriteEntity;
  private throwTimer: number = FPS * 0.3;
  tick(scene: Scene): void | Promise<void> {
    if (this.thrown) {
      this.throwTimer--;
      if (this.throwTimer <= 0) {
        scene.removeEntity(this);
        Sound.Sounds['slash'].play();
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

  throw(direction: number) {
    this.carried = false;
    this.carriedBy = undefined;
    this.thrown = true;
    this.thrownDirection = direction;
  }

  setCarriedBy(entity: SpriteEntity) {
    this.carried = true;
    this.carriedBy = entity;
  }

  reset() {
    this.carried = false;
    this.thrown = false;
    this.throwTimer = FPS * 0.3;
  }
}