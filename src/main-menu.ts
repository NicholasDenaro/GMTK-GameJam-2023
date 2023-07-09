import { ControllerState, Scene, SpriteEntity, SpritePainter } from "game-engine";
import { buildMap, engine, statefulMode, keyController, screenHeight, screenWidth, stopwatch } from "./game";

export class MainMenu extends SpriteEntity {
  constructor() {
    super(new SpritePainter(ctx => this.draw(ctx), {spriteWidth: screenWidth, spriteHeight: screenHeight}));
  }
  tick(scene: Scene): void | Promise<void> {
    if (scene.isControl('pause', ControllerState.Press)) {
      statefulMode.enabled = scene.isControl('action1', ControllerState.Down);
      buildMap(scene.getView(), keyController);
      engine.switchToScene('0,0');
      stopwatch.start = Date.now();
      console.log(`ez mode: ${statefulMode.enabled}`);
    }
    if (scene.isControl('sprint', ControllerState.Press)) {
      engine.switchToScene('credits');
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.font = '40px game';
    ctx.strokeText('Postgame', 14, 40);
    ctx.fillText('Postgame', 14, 40);
    ctx.strokeText('Giveaway', 14, 64);
    ctx.fillText('Giveaway', 14, 64);

    ctx.font = '16px game';
    ctx.strokeText('Press Enter to start', 20, screenHeight * 2 / 3 - 8);
    ctx.fillText('Press Enter to start', 20, screenHeight * 2 / 3 - 8);

    ctx.strokeText('Press Shift for credits', 12, screenHeight * 3 / 4 - 8);
    ctx.fillText('Press Shift for credits', 12, screenHeight * 3 / 4 - 8);

    ctx.strokeText('x+Enter=stateful mode', 12, screenHeight * 3 / 4 + 8);
    ctx.fillText('x+Enter=stateful mode', 12, screenHeight * 3 / 4 + 8);

    ctx.fillStyle = '#000000CC';
    ctx.fillRect(4, screenHeight * 5 / 6 + 8 - 12, screenWidth - 8, 28);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '12px game';
    ctx.strokeText('Controls: Arrow Keys, X, Z', 5, screenHeight * 5 / 6 + 4);
    ctx.fillText('Controls: Arrow Keys, X, Z', 5, screenHeight * 5 / 6 + 4);

    ctx.strokeText('Enter key: inventory', 5, screenHeight * 5 / 6 + 12);
    ctx.fillText('Enter key: inventory', 5, screenHeight * 5 / 6 + 12);

    ctx.strokeText('Escape key: reset', 5, screenHeight * 5 / 6 + 20);
    ctx.fillText('Escape key: reset', 5, screenHeight * 5 / 6 + 20);
  }
}