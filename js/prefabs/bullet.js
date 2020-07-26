class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y) {
        super(scene, x, y, "bullets");
        this.scale = 0.5;

        // 3.2 add to scene
        scene.add.existing(this);

        // 3.3
        //this.play("beam_anim");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = 400;
        this.body.setSize(this.width - 60, this.height - 60).setOffset(30,60);


        // 4.2 add the beam to the projectiles group
        scene.projectiles.add(this);

  }


  update(){

    // 3.4 Frustum culling
    if(this.y > game.config.height ){
      this.destroy();
    }
  }
}