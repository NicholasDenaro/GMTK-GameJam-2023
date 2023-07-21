import { Scene, Sound, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";
import { Wall } from "./wall";
import { TextboxEntity } from "./textbox";
import { NpcDialog } from "./npc";
import { Cursor } from "./player";
import { GameEntity } from "./game-entity";

export class SkeletonImage extends GameEntity {
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
  private dialogImage: NpcDialog;
  constructor(scene: Scene, x: number, y: number, private dialog: string[]) {
    super(new SpritePainter(() => {}, {spriteWidth: 10, spriteHeight: 10}), x, y);
    scene.addEntity(new SkeletonImage(x, y));
    scene.addEntity(this.dialogImage = new NpcDialog(this));
  }

  tick(scene: Scene): void | Promise<void> {
    this.dialogImage.hide();
    if (scene.entitiesByType(Cursor)[0]?.collision(this)) {
      this.dialogImage.show();
    }
  }

  showDialog(scene: Scene) {
    scene.addEntity(new TextboxEntity(this.dialog));
    Sound.Sounds['talk'].play();
  }

  setEmotion(emotion: string) {
    this.dialogImage.setEmotion(emotion);
  }
}

export class Grave extends Interactable {
  private dug = false;
  constructor(x: number, y: number, width: number, height: number, private dialog: string[]) {
    super(new SpritePainter(ctx => {}, {spriteWidth: width, spriteHeight: height}), x, y);
  }

  dig(scene: Scene) {
    if (!this.dug) {
      this.dug = true;
      scene.addEntity(new Skeleton(scene, this.x, this.y - 8, this.dialog));
    }
  }
}