import { Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";
import { Wall } from "./wall";
import { TextboxEntity } from "./textbox";

export class SkeletonImage extends SpriteEntity {
  constructor(x: number, y: number) {
    super(new SpritePainter(Sprite.Sprites['skeleton_idle_strip6']), x, y);
  }

  private imageTimer = 0;
  tick(scene: Scene): void | Promise<void> {

    this.imageTimer++;
    if (this.imageTimer > 10) {
      this.imageIndex++;
      this.imageTimer = 0;
    }

    this.imageIndex %= Sprite.Sprites['skeleton_idle_strip6'].getGrid().columns;
  }
  
}

export class Skeleton extends Interactable {
  constructor(scene: Scene, x: number, y: number, private dialog: string[]) {
    super(new SpritePainter(() => {}, {spriteWidth: 10, spriteHeight: 10}), x, y);
    scene.addEntity(new SkeletonImage(x, y));
  }

  showDialog(scene: Scene) {
    scene.addEntity(new TextboxEntity(this.dialog));
    Sound.Sounds['talk'].play();
  }
}

export class Grave extends Interactable {
  private dug = false;
  constructor(x: number, y: number, private dialog: string[]) {
    super(new SpritePainter(ctx => {}, {spriteWidth: 16, spriteHeight: 16}), x, y);
  }

  dig(scene: Scene) {
    if (!this.dug) {
      this.dug = true;
      scene.addEntity(new Skeleton(scene, this.x, this.y - 8, this.dialog));
    }
  }
}