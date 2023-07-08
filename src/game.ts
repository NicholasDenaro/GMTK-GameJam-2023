import { Canvas2DView, ControllerBinding, Engine, FixedTickEngine, KeyboardController, Scene, MouseController, Sprite, Sound, GamepadController } from 'game-engine';
import { Player } from './player';
import { PauseMenu } from './pause-menu';
import { Wall } from './wall';
import { BackgroundEntity } from './background';
import { SceneMap } from './scene-map';
import { Npc } from './npc';
import { Rock } from './rock';

export const screenWidth = 160;
export const screenHeight = 160;
const scale = 3;

export const engine: Engine = new FixedTickEngine(60);

const spriteAssets = require.context('../assets/', false, /\.png$/);
const spriteAssetsPremade = require.context('../assets/premade', false, /\.png$/);
new Sprite('buddy', spriteAssets('./buddy.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('base_idle_strip9', spriteAssetsPremade('./base_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_idle_strip9', spriteAssetsPremade('./bowlhair_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('longhair_idle_strip9', spriteAssetsPremade('./longhair_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_idle_strip9', spriteAssetsPremade('./tools_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('base_walk_strip8', spriteAssetsPremade('./base_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_walk_strip8', spriteAssetsPremade('./bowlhair_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_walk_strip8', spriteAssetsPremade('./tools_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('main1', spriteAssetsPremade('./main1.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('main2', spriteAssetsPremade('./main2.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('tiles', spriteAssetsPremade('./spr_tileset_sunnysideworld_16px.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('crosshair', spriteAssets('./crosshair.png'), { spriteWidth: 8, spriteHeight: 8 });
const wavAssets = require.context('../assets/', false, /\.wav$/);
const wavAssetsPremade = require.context('../assets/premade', false, /\.wav$/);
new Sound('start', wavAssetsPremade('./GAME_MENU_SCORE_SFX001416.wav'));
new Sound('dayloop', wavAssetsPremade('./Daytime1Loop.wav'), true);
new Sound('talk', wavAssetsPremade('./MenuCursor01.wav'));
new Sound('pause', wavAssetsPremade('./MenuValid01.wav'));

export const scenes = new SceneMap();

async function init() {

  await Sprite.waitForLoad();

  const view = new Canvas2DView(screenWidth, screenHeight, { scale: scale, bgColor: '#BBBBBB' });
  const scene = new Scene(view);
  const scene2 = new Scene(view);
  const scenePause = new Scene(view);
  scene.addController(new KeyboardController(keyMap));
  scene2.addController(new KeyboardController(keyMap));
  scenePause.addController(new KeyboardController(keyMap));
  scene.addController(new MouseController(mouseMap));
  scene.addController(new GamepadController(gamepadMap));

  scenes.setScene('main', 0, 0);
  scenes.setScene('main2', 1, 0);

  engine.addScene('main', scene);
  engine.addScene('main2', scene2);
  engine.addScene('pause', scenePause);

  scenePause.addEntity(new PauseMenu());

  scene.addEntity(new BackgroundEntity('main1'));
  scene.addEntity(new Wall(0, 16, screenWidth, 16));
  scene.addEntity(new Wall(0, 0, 16, screenHeight));
  scene.addEntity(new Wall(0, screenHeight - 16, screenWidth, 16));
  scene.addEntity(new Player(scene, 48, 48));

  scene2.addEntity(new BackgroundEntity('main2'));
  //top
  scene2.addEntity(new Wall(0, 16, 2 * 16, 16));
  scene2.addEntity(new Rock(32, 16));
  scene2.addEntity(new Wall(3 * 16, 16, screenWidth, 16));
  //others
  scene2.addEntity(new Wall(screenWidth - 16, 0, 16, screenHeight));
  scene2.addEntity(new Wall(0, screenHeight - 16, screenWidth, 16));

  // house
  scene2.addEntity(new Wall(4 * 16 - 8, 64, 1.5 * 16, 3 * 16));
  scene2.addEntity(new Wall(4 * 16 - 8, 64, 5 * 16, 2 * 16));
  scene2.addEntity(new Wall(6.5 * 16 - 8, 64, 2.5 * 16, 3 * 16));
  // crate1
  scene2.addEntity(new Wall(screenWidth - 32, 3 * 16, 5 * 16, 3 * 16));
  // crate2
  scene2.addEntity(new Wall(screenWidth - 32, 7 * 16, 16, 16));

  scene2.addEntity(new Npc(scene2, 7 * 16, 7 * 16,
    ['I need a shovel to dig my\ngarden. Could you give\nme yours?', {options: ['keep shovel', 'give shovel']}],
    ['Thank you, now it\'s\ntime to get planting.']));

  engine.switchToScene('main');

  Sound.setVolume(0.1);

  // Sound.Sounds['start'].play();
  Sound.Sounds['dayloop'].play();

  await engine.start();
}

const keyMap = [
  {
    binding: new ControllerBinding<undefined>('left'),
    keys: ['ArrowLeft'],
  },
  {
    binding: new ControllerBinding<undefined>('right'),
    keys: ['ArrowRight'],
  },
  {
    binding: new ControllerBinding<undefined>('up'),
    keys: ['ArrowUp'],
  },
  {
    binding: new ControllerBinding<undefined>('down'),
    keys: ['ArrowDown'],
  },
  {
    binding: new ControllerBinding<undefined>('action1'),
    keys: ['x'],
  },
  {
    binding: new ControllerBinding<undefined>('action2'),
    keys: ['z'],
  },
  {
    binding: new ControllerBinding<undefined>('pause'),
    keys: ['Enter'],
  },
];

const mouseMap = [
  {
    binding: new ControllerBinding<{ x: number, y: number, dx: number, dy: number }>('interact'),
    buttons: [0],
  }
];

const gamepadMap = [
  {
    binding: new ControllerBinding<{ value: number }>('button1'),
    buttons: [
      { type: 'buttons', index: 0 },
    ],
  },
  {
    binding: new ControllerBinding<{ value: number }>('button2'),
    buttons: [
      { type: 'buttons', index: 1 },
    ],
  },
  {
    binding: new ControllerBinding<{ value: number }>('axis1'),
    buttons: [
      { type: 'axes', index: 0 },
    ],
  },
  {
    binding: new ControllerBinding<{ value: number }>('axis2'),
    buttons: [
      { type: 'axes', index: 1 },
    ],
  }
];

init();