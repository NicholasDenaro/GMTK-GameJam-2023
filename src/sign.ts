import { Scene, Sound, SpritePainter } from "game-engine";
import { Interactable } from "./interactable";
import { TextboxEntity } from "./textbox";

export class Sign extends Interactable {

  constructor(x: number, y: number, private dialog: string[]) {
    super(new SpritePainter(ctx => {}, {spriteWidth: 16, spriteHeight: 16}), x, y);
  }

  showDialog(scene: Scene) {
    scene.addEntity(new TextboxEntity(this.dialog));
    Sound.Sounds['talk'].play();
  }
}