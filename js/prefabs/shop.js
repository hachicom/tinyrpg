class Shop extends Phaser.GameObjects.Group {
    constructor (config) {
        super(config.scene);

        //mantendo referência à cena atual
        this.scene = config.scene;

        //this.setActors(config.player,config.enemy);

        //Elementos gráficos
        this.field = this.create(game.config.width/2 + 50,100,"windowshop").setOrigin(0.5,0);

        //textos
        this.titlelable = this.scene.add.text(this.field.x - 20,this.field.y + 48, "shop",txtStyle1).setOrigin(0.5,0);
        this.add(this.titlelable);
        
        this.txtItem0 = this.scene.add.text(this.field.x + 20,this.field.y + 152, "item 1 xyz",txtStyle3).setOrigin(0,0);
        this.add(this.txtItem0);
        this.txtPrice0 = this.scene.add.text(this.field.x + 20,this.txtItem0.y + 64, "y$ 10",txtStyle4).setOrigin(0,0);
        this.add(this.txtPrice0);

        this.txtItem1 = this.scene.add.text(this.field.x + 20,this.field.y + 342, "item 2 wkz",txtStyle3).setOrigin(0,0);
        this.add(this.txtItem1);
        this.txtPrice1 = this.scene.add.text(this.field.x + 20,this.txtItem1.y + 64, "y$ 200",txtStyle4).setOrigin(0,0);
        this.add(this.txtPrice1);

        this.txtItem2 = this.scene.add.text(this.field.x + 20,this.field.y + 532, "item 3 wkz",txtStyle3).setOrigin(0,0);
        this.add(this.txtItem2);
        this.txtPrice2 = this.scene.add.text(this.field.x + 20,this.txtItem2.y + 64, "y$ 3000",txtStyle4).setOrigin(0,0);
        this.add(this.txtPrice2);

        this.explainLabel = this.scene.add.text(this.field.x - 120,this.field.y + 720, "clique icones p/ comprar",txtStyle5).setOrigin(0,0);
        this.add(this.explainLabel);
        
        this.setAllTextVisibility(false);
        
        
        this.fieldween = this.scene.tweens.add({
            targets: this.field,
            y: { from: game.config.height, to: 100 },
            ease: 'Circular',
            duration: 1000,
            repeat: 0,
            paused: true
        });

        this.fieldween.on('complete', function(tween, targets){
            this.setAllTextVisibility(true);
            // this.textween.seek(0);
            // this.textween.play();
            this.scene.shopButtons.setVisible(true); 
        }, this);

        this.fieldweenOut = this.scene.tweens.add({
            targets: this.field,
            y: { from: 100, to: game.config.height},
            ease: 'Bounce',
            duration: 1000,
            repeat: 0,
            paused: true
        });

        this.fieldweenOut.on('complete', function(tween, targets){
            // this.titlelable.setVisible(false);
            this.setVisible(false);
            this.scene.modo = 'comando';
        }, this);

        this.modo = 'criado'; //criado,inicio,jogando,fim
        
        //Adicionando à cena atual
        config.scene.add.existing(this);
        config.scene.physics.add.existing(this);

        this.setVisible(false);
    }

    showStore(tipo){
        this.setVisible(true);
        this.field.y = game.config.height;
        this.setAllTextVisibility(false);
        switch(tipo){
            case 'atk': 
                this.titlelable.text = this.scene.txtDB['ATKLABEL'];
                break;
            case 'def': 
                this.titlelable.text = this.scene.txtDB['DEFLABEL'];
                break;
            case 'spd': 
                this.titlelable.text = this.scene.txtDB['SPDLABEL'];
                break;
            case 'item': 
                this.titlelable.text = this.scene.txtDB['ITEMLABEL'];
                break;
        }
        this.fieldween.play();
    }

    getItemData(opt){
        return {
            msg: 'TESTEDESCRICAOPRODUTO',
            valor: 10,
        };
    }

    buySumthinWillYa(opt){
        console.log(opt);
        /*        
        if (this.custoenfermaria <= this.player.gold){
            this.player.hp = this.player.maxhp;
            this.player.gold -= this.custoenfermaria;
            if (this.player.gold < 0) this.player.gold = 0;
            this.messenger.showMessage([
                [this.txtDB["SEUSPONTOSDEVIDAFORAMRECUPERADOS"],"none"]
            ],
            () => {
                this.modo = 'comando';
            });
        }else{
            this.messenger.showMessage([
                [this.txtDB["DINHEIROINSUFICIENTE"],"none"]
            ],
            () => {
                this.modo = 'comando';
            });
        }
         */
    }

    hideStore(){
        // this.textween.stop();
        this.scene.shopButtons.setVisible(false); 
        this.titlelable.setVisible(false);
        this.fieldweenOut.play();
    }
    
    setAllTextVisibility(bool){        
        this.titlelable.setVisible(bool);
        this.explainLabel.setVisible(bool);
        this.txtItem0.setVisible(bool);
        this.txtPrice0.setVisible(bool);
        this.txtItem1.setVisible(bool);
        this.txtPrice1.setVisible(bool);
        this.txtItem2.setVisible(bool);
        this.txtPrice2.setVisible(bool);
    }
}