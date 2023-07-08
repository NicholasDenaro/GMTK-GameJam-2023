import { Canvas2DView, ControllerBinding, Engine, FixedTickEngine, KeyboardController, Scene, MouseController, Sprite, Sound, GamepadController, View } from 'game-engine';
import { Player } from './player';
import { PauseMenu } from './pause-menu';
import { Wall } from './wall';
import { BackgroundEntity } from './background';
import { SceneMap } from './scene-map';
import { Npc } from './npc';
import { Rock } from './rock';
import { Grass } from './grass';
import { Hole } from './hole';


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
  }
);


export const screenWidth = 160;
export const screenHeight = 160;
const scale = 3;

export const FPS = 60;

export const engine: Engine = new FixedTickEngine(FPS);

const spriteAssets = require.context('../assets/', false, /\.png$/);
const spriteAssetsPremade = require.context('../assets/premade', false, /\.png$/);
new Sprite('buddy', spriteAssets('./buddy.png'), { spriteWidth: 16, spriteHeight: 16 });
//idle
new Sprite('base_idle_strip9', spriteAssetsPremade('./base_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_idle_strip9', spriteAssetsPremade('./bowlhair_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('longhair_idle_strip9', spriteAssetsPremade('./longhair_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_idle_strip9', spriteAssetsPremade('./tools_idle_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//walk
new Sprite('base_walk_strip8', spriteAssetsPremade('./base_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_walk_strip8', spriteAssetsPremade('./bowlhair_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_walk_strip8', spriteAssetsPremade('./tools_walk_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//jump
new Sprite('base_jump_strip9', spriteAssetsPremade('./base_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_jump_strip9', spriteAssetsPremade('./bowlhair_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_jump_strip9', spriteAssetsPremade('./tools_jump_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//dig
new Sprite('base_dig_strip13', spriteAssetsPremade('./base_dig_strip13.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_dig_strip13', spriteAssetsPremade('./bowlhair_dig_strip13.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_dig_strip13', spriteAssetsPremade('./tools_dig_strip13.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//attack
new Sprite('base_attack_strip10', spriteAssetsPremade('./base_attack_strip10.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_attack_strip10', spriteAssetsPremade('./bowlhair_attack_strip10.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_attack_strip10', spriteAssetsPremade('./tools_attack_strip10.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//roll - used for fall
new Sprite('base_roll_strip10', spriteAssetsPremade('./base_roll_strip10.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_roll_strip10', spriteAssetsPremade('./bowlhair_roll_strip10.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_roll_strip10', spriteAssetsPremade('./tools_roll_strip10.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//waiting - used for fishing?
new Sprite('base_waiting_strip9', spriteAssetsPremade('./base_waiting_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_waiting_strip9', spriteAssetsPremade('./bowlhair_waiting_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_waiting_strip9', spriteAssetsPremade('./tools_waiting_strip9.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//doing - used for pickup/place
new Sprite('base_doing_strip8', spriteAssetsPremade('./base_doing_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_doing_strip8', spriteAssetsPremade('./bowlhair_doing_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_doing_strip8', spriteAssetsPremade('./tools_doing_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//hurt
new Sprite('base_hurt_strip8', spriteAssetsPremade('./base_hurt_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_hurt_strip8', spriteAssetsPremade('./bowlhair_hurt_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_hurt_strip8', spriteAssetsPremade('./tools_hurt_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
//carry
new Sprite('base_carry_strip8', spriteAssetsPremade('./base_carry_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('bowlhair_carry_strip8', spriteAssetsPremade('./bowlhair_carry_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });
new Sprite('tools_carry_strip8', spriteAssetsPremade('./tools_carry_strip8.png'), { spriteWidth: 96, spriteHeight: 64, spriteOffsetX: 40, spriteOffsetY: 24 });

new Sprite('main1', spriteAssetsPremade('./main1.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('main2', spriteAssetsPremade('./main2.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('inventory', spriteAssetsPremade('./inventory.png'), { spriteWidth: screenWidth, spriteHeight: screenHeight });
new Sprite('tiles', spriteAssetsPremade('./spr_tileset_sunnysideworld_16px.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('crosshair', spriteAssets('./crosshair.png'), { spriteWidth: 8, spriteHeight: 8 });
new Sprite('coin', spriteAssetsPremade('./item8BIT_coin.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('shovel', spriteAssetsPremade('./item8BIT_shovel.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('sword', spriteAssetsPremade('./item8BIT_sword.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('bombs', spriteAssetsPremade('./item8BIT_bomb.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('bow', spriteAssetsPremade('./item8BIT_bow.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('feather', spriteAssetsPremade('./item8BIT_feather.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('glove', spriteAssetsPremade('./item8BIT_glove.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('compass', spriteAssetsPremade('./item8BIT_compass.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('lamp', spriteAssetsPremade('./item8BIT_lamp.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('mirror', spriteAssetsPremade('./item8BIT_mirror.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('harp', spriteAssetsPremade('./item8BIT_harp.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('heart', spriteAssetsPremade('./item8BIT_heart.png'), { spriteWidth: 16, spriteHeight: 16 });

new Sprite('fire1', spriteAssetsPremade('./spr_deco_fire_01_strip4.png'), { spriteWidth: 5, spriteHeight: 10 });
new Sprite('fire2', spriteAssetsPremade('./spr_deco_fire_02_strip4.png'), { spriteWidth: 8, spriteHeight: 12 });

new Sprite('bomb', spriteAssets('./bomb.png'), { spriteWidth: 16, spriteHeight: 16 });
new Sprite('explosion', spriteAssets('./explosion.png'), { spriteWidth: 32, spriteHeight: 32 });
new Sprite('arrow', spriteAssets('./arrow.png'), { spriteWidth: 16, spriteHeight: 16 });


const wavAssets = require.context('../assets/', false, /\.wav$/);
const wavAssetsPremade = require.context('../assets/premade', false, /\.wav$/);
new Sound('start', wavAssetsPremade('./GAME_MENU_SCORE_SFX001416.wav'));
new Sound('dayloop', wavAssetsPremade('./Daytime1Loop.wav'), true);
new Sound('talk', wavAssetsPremade('./MenuCursor01.wav'));
new Sound('pause', wavAssetsPremade('./MenuValid01.wav'));
new Sound('slash', wavAssetsPremade('./Attack03.wav'));
new Sound('dig', wavAssetsPremade('./Attack02.wav'));
new Sound('jump', wavAssetsPremade('./Jump03.wav'));
new Sound('fall', wavAssetsPremade('./Fall01.wav'));
new Sound('hurt', wavAssetsPremade('./Hurt01.wav'));
new Sound('explosion', wavAssetsPremade('./Attack02.wav'));
new Sound('bow', wavAssets('./bow3.wav'));

export const scenes = new SceneMap();

async function init() {

  await Sprite.waitForLoad();

  const view = new Canvas2DView(screenWidth, screenHeight, { scale: scale, bgColor: '#BBBBBB' });

  buildMap(view);

  engine.switchToScene('0,0');

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

function buildMap(view: View) {
  const keyController = new KeyboardController(keyMap);
  const scenePause = new Scene(view);
  scenePause.addController(keyController);
  // scene.addController(new MouseController(mouseMap));
  // scene.addController(new GamepadController(gamepadMap));

  build00(view, keyController);
  build10(view, keyController);

  // build layout
  scenes.setScene('0,0', 0, 0);
  scenes.setScene('1,0', 1, 0);

  engine.addScene('pause', scenePause);

  scenePause.addEntity(new BackgroundEntity('inventory'));
  scenePause.addEntity(new PauseMenu());

  
}

function build00(view: View, keyController: KeyboardController) {
  const scene = new Scene(view);

  scene.addController(keyController);
  scene.addEntity(new BackgroundEntity('main1'));
  // top
  scene.addEntity(new Wall(0, 16, screenWidth, 16));
  // left
  scene.addEntity(new Wall(0, 16, 16, 3 * 16));
  scene.addEntity(new Grass(0, 4 * 16));
  scene.addEntity(new Grass(0, 5 * 16));
  scene.addEntity(new Grass(0, 6 * 16));
  scene.addEntity(new Wall(0, 7 * 16, 16, 3 * 16));
  // bottom
  scene.addEntity(new Wall(0, screenHeight - 16, screenWidth, 16));
  scene.addEntity(new Player(scene, 48, 48));


  scene.addEntity(new Hole(4 * 16, 2 * 16));
  scene.addEntity(new Hole(5 * 16, 2 * 16));
  scene.addEntity(new Hole(6 * 16, 2 * 16));

  scene.addEntity(new Hole(5 * 16, 7 * 16));

  engine.addScene('0,0', scene);
}

function build10(view: View, keyController: KeyboardController) {
  const scene2 = new Scene(view);
  scene2.addController(keyController);

  scene2.addEntity(new BackgroundEntity('main2'));
  //top
  scene2.addEntity(new Wall(0, 16, 2 * 16, 16));
  scene2.addEntity(new Rock(32, 16));
  scene2.addEntity(new Wall(3 * 16, 16, screenWidth, 16));
  //right
  scene2.addEntity(new Wall(screenWidth - 16, 0, 16, screenHeight));
  //bottom
  scene2.addEntity(new Wall(0, screenHeight - 16, 16, 16));

  // house
  scene2.addEntity(new Wall(4 * 16 - 8, 64, 1.5 * 16, 3 * 16));
  scene2.addEntity(new Wall(4 * 16 - 8, 64, 5 * 16, 2 * 16));
  scene2.addEntity(new Wall(6.5 * 16 - 8, 64, 2.5 * 16, 3 * 16));
  // crate1
  scene2.addEntity(new Wall(screenWidth - 32, 3 * 16, 5 * 16, 3 * 16));
  // crate2
  scene2.addEntity(new Wall(screenWidth - 32, 7 * 16, 16, 16));

  scene2.addEntity(new Npc(scene2, 7 * 16, 7 * 16,
    ['I need a shovel to dig my\ngarden. Could you give\nme yours?', { options: ['keep shovel', 'give shovel'] }],
    ['Thank you, now it\'s\ntime to get planting.'], 0));

  engine.addScene('1,0', scene2);
}

init();