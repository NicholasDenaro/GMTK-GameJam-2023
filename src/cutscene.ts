import { Scene } from "game-engine";
import { engine, scenes, screenTransition, transitionFade } from "./game";

export const cutscene = {
  active: false
}
export class Cutscene {
  private step = 0;
  constructor(private time: number, private action: (step: number) => void, private enterSceneKey?: string, private gotoSceneKey?: string, private transition?: boolean) {
  }

  start(scene?: Scene) {
    cutscene.active = true;
    this.step = 0;
    engine.addAction('cutscene', () => this.tick());
    if (this.enterSceneKey) {
      scenes.getSceneByKey(this.enterSceneKey).resetter.reset();
      if (this.transition) {
        transitionFade(scene, engine.getScene(this.enterSceneKey), false);
      } else {
        engine.switchToScene(this.enterSceneKey);
      }
    }
  }

  tick() {
    if (screenTransition.active) {
      this.action(this.step);
      return;
    }

    this.action(this.step);
    this.step++;
    if (this.step >= this.time) {
      this.stop();
    }
  }

  stop() {
    cutscene.active = false;
    engine.removeAction('cutscene');
    if (this.gotoSceneKey) {
      if (this.transition) {
        transitionFade(engine.getScene(this.enterSceneKey), engine.getScene(this.gotoSceneKey), false);
      } else {
        engine.switchToScene(this.gotoSceneKey);
      }
    }
  }
}