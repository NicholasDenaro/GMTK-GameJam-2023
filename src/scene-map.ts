import { Scene } from "game-engine";
import { EntityResetter } from "./game";

export class SceneMap {
  private scenes: { x: number, y: number, sceneKey: string, scene: Scene, resetter: EntityResetter}[] = [];

  setScene(scene: Scene, sceneKey: string, x: number, y: number, resetter: EntityResetter) {
    this.scenes.push({ x, y, scene, sceneKey, resetter});
  }

  getScene(coordX: number, coordY: number) {
    return this.scenes.filter(scene => scene.x === coordX && scene.y === coordY)[0] || null;
  }

  getSceneByKey(sceneKey: string) {
    return this.scenes.filter(sceneData => sceneData.sceneKey == sceneKey)[0] || null;
  }

  clear() {
    this.scenes = [];
  }

  getAll() {
    return this.scenes;
  }
}