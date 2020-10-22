class Coin extends Phaser.GameObjects.Sprite {
    constructor(scene,x,y,frame) {
        super(scene, x, y, "iconsui", frame);
        this.scale = 0.25;

        this.velocidade = 400 + (level * 50);

        // 3.2 add to scene
        scene.add.existing(this);

        // 3.3
        //this.play("beam_anim");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = this.velocidade;
        this.body.setSize(this.width - 60, this.height - 60).setOffset(30,60);

        //tipo 0: normal, tipo 1: veneno (1 de dano + lento), tipo 2: duplo, tipo 3: duplo veneno (2 de dano + lento e atk reduzido)
        this.tipo = frame;

        // 4.2 add the beam to the projectiles group
        scene.projectiles.add(this);

  }

  pause(){
    this.body.velocity.y = 0;
  }

  resume(){
    this.body.velocity.y = this.velocidade;
  }

  update(){

    // 3.4 Frustum culling
    if(this.y > game.config.height ){
      this.destroy();
    }
  }
}