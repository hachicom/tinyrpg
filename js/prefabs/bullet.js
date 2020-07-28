class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y,level,frame) {
        super(scene, x, y, "bullets", frame);
        this.scale = 0.5;

        // 3.2 add to scene
        scene.add.existing(this);

        // 3.3
        //this.play("beam_anim");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = 400 + (level * 50);
        this.body.setSize(this.width - 60, this.height - 60).setOffset(30,60);

        //tipo 0: normal, tipo 1: duplo. tipo 2: veneno (1 de dano + lento), tipo 3: duplo veneno (2 de dano + lento)
        this.tipo = frame;

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