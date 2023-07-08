import { ControllerState, Painter2D, Scene, Sprite, SpriteEntity, SpritePainter } from "game-engine";
import { engine, scenes, screenHeight, screenWidth } from "./game";
import { Wall } from "./wall";
import { TextboxEntity } from "./textbox";

export class PlayerImage extends SpriteEntity {
  constructor(private player: Player, private sprite: string, private animation: string) {
    super(new SpritePainter(Sprite.Sprites[`${sprite}_${animation}`]));
  }

  tick(scene: Scene): void | Promise<void> {
    this.x = this.player.getPos().x;
    this.y = this.player.getPos().y;
    this.imageIndex = this.player.imageIndex;
    this.flipHorizontal = this.player.flipHorizontal;
  }

  setAnimation(animation: string) {
    this.animation = animation;
    (this.painter as SpritePainter).setSprite(Sprite.Sprites[`${this.sprite}_${this.animation}`]);
  }

  spriteFrames() {
    return Sprite.Sprites[`${this.sprite}_${this.animation}`].getGrid().columns;
  }
}

export class Player extends SpriteEntity {
  private pause: boolean;
  private worldCoordsX = 0;
  private worldCoordsY = 0;
  private baseImage: PlayerImage;
  private hairImage: PlayerImage;
  private toolImage: PlayerImage;
  constructor(scene: Scene, x: number, y: number) {
    super(new SpritePainter(() => { }, { spriteWidth: 16, spriteHeight: 16 }), x, y);
    scene.addEntity(this.baseImage = new PlayerImage(this, 'base', 'idle_strip9'));
    scene.addEntity(this.hairImage = new PlayerImage(this, 'bowlhair', 'idle_strip9'));
    scene.addEntity(this.toolImage = new PlayerImage(this, 'tools', 'idle_strip9'));
  }

  getWorldCoords(): {x: number, y: number} {
    return {x: this.worldCoordsX, y: this.worldCoordsY};
  }

  private transitionTimer = 0;
  private imageTimer = 0;
  tick(scene: Scene): Promise<void> | void {
    if (this.pause) {
      return;
    }

    if (engine.sceneKey(scene) == 'pause') {
      return;
    }

    const canMove = scene.entitiesByType(TextboxEntity).length == 0;

    let moving = false;
    this.imageTimer++;
    if (this.imageTimer > 10) {
      this.imageIndex++;
      this.imageTimer = 0;
    }
    if (canMove) {
      if (scene.isControl('left', ControllerState.Held)) {
        this.x--;
        this.flipHorizontal = true;
        moving = true;
        if (scene.entitiesByType(Wall).some(wall => wall.collision(this))) {
          this.x++;
        }
      }
      if (scene.isControl('right', ControllerState.Held)) {
        this.x++;
        this.flipHorizontal = false;
        moving = true;
        if (scene.entitiesByType(Wall).some(wall => wall.collision(this))) {
          this.x--;
        }
      }
      if (scene.isControl('up', ControllerState.Held)) {
        this.y--;
        moving = true;
        if (scene.entitiesByType(Wall).some(wall => wall.collision(this))) {
          this.y++;
        }
      }
      if (scene.isControl('down', ControllerState.Held)) {
        this.y++;
        moving = true;
        if (scene.entitiesByType(Wall).some(wall => wall.collision(this))) {
          this.y--;
        }
      }

      if (scene.isControl('action1', ControllerState.Press)) {
        scene.addEntity(new TextboxEntity());
      }
    }

    if (!moving) {
      this.transitionTimer = 0;
      this.baseImage.setAnimation('idle_strip9');
      this.hairImage.setAnimation('idle_strip9');
      this.toolImage.setAnimation('idle_strip9');
    } else {
      this.baseImage.setAnimation('walk_strip8');
      this.hairImage.setAnimation('walk_strip8');
      this.toolImage.setAnimation('walk_strip8');
    }

    let transition = false;
    if (this.x + this.painter.rectangle().width > screenWidth) {
      this.transitionTimer++;
      this.x = screenWidth - this.painter.rectangle().width;
      if (this.transitionTimer >= 10) {
        this.worldCoordsX++;
        transition = true;
        this.x = 0;
        this.transitionTimer = 0;
      }
    }

    if (this.x < 0) {
      this.transitionTimer++;
      this.x = 0;
      if (this.transitionTimer >= 10) {
        this.worldCoordsX--;
        transition = true;
        this.x = screenWidth - this.painter.rectangle().width;
        this.transitionTimer = 0;
      }
    }

    if (this.y + this.painter.rectangle().height > screenHeight) {
      this.transitionTimer++;
      this.y = screenHeight - this.painter.rectangle().height;
      if (this.transitionTimer >= 10) {
        this.worldCoordsY++;
        transition = true;
        this.y = 0;
        this.transitionTimer = 0;
      }
    }

    if (this.y < 0) {
      this.transitionTimer++;
      this.y = 0;
      if (this.transitionTimer >= 10) {
        this.worldCoordsY--;
        transition = true;
        this.y = screenHeight - this.painter.rectangle().height;
        this.transitionTimer = 0;
      }
    }

    if (transition) {
      const nextScene = scenes.getScene(this.worldCoordsX, this.worldCoordsY);
      engine.switchToScene(nextScene.scene);
      engine.addEntity(nextScene.scene, this);
      engine.addEntity(nextScene.scene, this.baseImage);
      engine.addEntity(nextScene.scene, this.hairImage);
      engine.addEntity(nextScene.scene, this.toolImage);
    }

    if (engine.sceneKey(scene) != 'pause' && scene.isControl('pause', ControllerState.Press)) {
      engine.addEntity('pause', this);
      engine.switchToScene('pause');
    }

    this.imageIndex %= this.baseImage.spriteFrames();
  }
}