import { Scene } from "game-engine";

export class SceneMap {
  private scenes: {x: number, y: number, scene: string}[] = [];

  setScene(scene: string, x: number, y: number) {
    this.scenes.push({x, y, scene});
  }

  getScene(coordX: number, coordY: number) {
    return this.scenes.filter(scene => scene.x == coordX && scene.y == coordY)[0] || null;
  }
}