import { Scene, Sound, Sprite, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";
import { TextboxEntity } from "./textbox";
import { NpcDialog } from "./npc";
import { Cursor } from "./player";

export class Sign extends Interactable {

  private dialogImage: NpcDialog;
  constructor(scene: Scene, x: number, y: number, private dialog: string[]) {
    super(new SpritePainter(Sprite.Sprites['tiles'], { spriteWidth: 16, spriteHeight: 16 }), x, y);
    scene.addEntity(this.dialogImage = new NpcDialog(this));
    this.imageIndex = 878;
  }

  tick(scene: Scene): void | Promise<void> {
    this.dialogImage.hide();
    if (scene.entitiesByType(Cursor)[0].collision(this)) {
      this.dialogImage.show();
    }
  }

  showDialog(scene: Scene) {
    scene.addEntity(new TextboxEntity(this.dialog));
    Sound.Sounds['talk'].play();
  }
}