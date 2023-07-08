import { ControllerState, Scene, SpriteEntity, SpritePainter } from "game-engine";
import { screenWidth } from "./game";

const rfont = require.context('../assets/premade', false, /\.ttf$/);
const sfont = rfont('./BetterPixels.ttf');
console.log(sfont);
const font = new FontFace('game', `url(${sfont})`);
font.load().then(() => {
  console.log('loaded font');
  document.fonts.add(font);
},
(err) => {
  console.error(err);
});

export class TextboxEntity extends SpriteEntity {
  constructor() {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: 48}));
  }
  tick(scene: Scene): void | Promise<void> {

    if (scene.isControl('action1', ControllerState.Press)) {
      scene.removeEntity(this);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, screenWidth, 48);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '16px game';
    ctx.fillText('Hello World', 2, 16, screenWidth - 4);
  }
}