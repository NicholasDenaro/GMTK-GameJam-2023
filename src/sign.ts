import { Scene, Sound, Sprite, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";
import { TextboxEntity } from "./textbox";

export class Sign extends Interactable {

  constructor(x: number, y: number, private dialog: string[]) {
    super(new SpritePainter(Sprite.Sprites['tiles'], {spriteWidth: 16, spriteHeight: 16}), x, y);
    this.imageIndex = 878;
  }

  showDialog(scene: Scene) {
    scene.addEntity(new TextboxEntity(this.dialog));
    Sound.Sounds['talk'].play();
  }
}