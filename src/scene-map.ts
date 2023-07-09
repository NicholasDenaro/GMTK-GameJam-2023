import { Scene } from "game-engine";

export class SceneMap {
  private scenes: {x: number, y: number, scene: string, reset: () => void}[] = [];

  setScene(scene: string, x: number, y: number, reset: () => void) {
    this.scenes.push({x, y, scene, reset});
  }

  getScene(coordX: number, coordY: number) {
    return this.scenes.filter(scene => scene.x == coordX && scene.y == coordY)[0] || null;
  }

  getSceneByKey(sceneKey: string) {
    return this.scenes.filter(scene => scene.scene == sceneKey)[0] || null;
  }

  clear() {
    this.scenes = [];
  }
}