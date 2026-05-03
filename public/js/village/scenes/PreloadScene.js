export class PreloadScene extends Phaser.Scene {
  constructor() {
    super("PreloadScene");
  }

  preload() {
    this.load.image("dojo_sky_strip", "/assets/dojo/ui/sky_strip.png");
    this.load.image("dojo_moon_eternal", "/assets/dojo/ui/moon_eternal.png");
    this.load.image("dojo_moon_earned", "/assets/dojo/ui/moon_earned.png");

    for (const tile of [
      "grass_a",
      "grass_b",
      "grass_c",
      "path_stone",
      "path_corner_ne",
      "path_corner_nw",
      "path_corner_se",
      "path_corner_sw",
      "plaza_center"
    ]) {
      this.load.image(`dojo_tile_${tile}`, `/assets/dojo/tiles/${tile}.png`);
    }

    for (const hut of [
      "moji_scroll_hut",
      "miji_forge",
      "maji_dojo",
      "meji_tea_house",
      "muji_launch_pad",
      "meowts_shrine"
    ]) {
      this.load.image(`dojo_hut_${hut}`, `/assets/dojo/huts/${hut}.png`);
    }

    for (const prop of [
      "tree_cherry_a",
      "tree_cherry_b",
      "lantern_stone",
      "lantern_paper",
      "flower_bed",
      "sign_post",
      "rock_a",
      "fence_segment"
    ]) {
      this.load.image(`dojo_prop_${prop}`, `/assets/dojo/props/${prop}.png`);
    }

    for (const id of ["moji", "miji", "maji", "meji", "muji", "meowts"]) {
      this.load.image(`dojo_interior_${id}`, `/assets/dojo/interiors/${id}_interior.png`);
      this.load.spritesheet(`dojo_kunoichi_${id}`, `/assets/dojo/characters/${id}_atlas.png`, {
        frameWidth: 32,
        frameHeight: 32
      });
    }
    this.load.spritesheet("dojo_tyche", "/assets/dojo/characters/tyche_atlas.png", {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.scene.start("VillageScene");
  }
}
