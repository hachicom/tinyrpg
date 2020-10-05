class Shop extends Phaser.GameObjects.Group {
    constructor (config) {
        super(config.scene);

        //mantendo referência à cena atual
        this.scene = config.scene;
        this.itensDB = config.itens;

        this.buymode = false;
        this.catalogo = "none";

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
            this.buymode = true;
            this.scene.showShopButtons(this.catalogo);
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
                this.setItensLabels("weapons");
                break;
            case 'def': 
                this.titlelable.text = this.scene.txtDB['DEFLABEL'];
                this.setItensLabels("shields");
                break;
            case 'spd': 
                this.titlelable.text = this.scene.txtDB['SPDLABEL'];
                this.setItensLabels("boots");
                break;
            case 'item': 
                this.titlelable.text = this.scene.txtDB['ITEMLABEL'];
                this.setItensLabels("items");
                break;
        }
        this.fieldween.play();
    }

    setItensLabels(tipo){
        this.txtItem0.text = this.scene.txtDB[this.itensDB[tipo][0]["name"]];
        this.txtPrice0.text = "y$ "+this.itensDB[tipo][0]["gold"];
        this.txtItem1.text = this.scene.txtDB[this.itensDB[tipo][1]["name"]];
        this.txtPrice1.text = "y$ "+this.itensDB[tipo][1]["gold"];
        this.txtItem2.text = this.scene.txtDB[this.itensDB[tipo][2]["name"]];
        this.txtPrice2.text = "y$ "+this.itensDB[tipo][2]["gold"];
        this.catalogo = tipo;

        if (this.catalogo == "items"){
            this.updatePriceLabels();
        }
    }

    updatePriceLabels(){
        let tipo = "items";
        if (typeof this.scene.player.inventory.items[this.itensDB[tipo][0]["name"]] != 'undefined' && 
        this.scene.player.inventory.items[this.itensDB[tipo][0]["name"]] >= this.itensDB[tipo][0]["qtd"]){
            this.txtPrice0.text = this.scene.txtDB["SOLDOUT"];
        }
        if (typeof this.scene.player.inventory.items[this.itensDB[tipo][1]["name"]] != 'undefined' && 
        this.scene.player.inventory.items[this.itensDB[tipo][1]["name"]] >= this.itensDB[tipo][1]["qtd"]){
            this.txtPrice1.text = this.scene.txtDB["SOLDOUT"];
        }
        if (typeof this.scene.player.inventory.items[this.itensDB[tipo][2]["name"]] != 'undefined' && 
        this.scene.player.inventory.items[this.itensDB[tipo][2]["name"]] >= this.itensDB[tipo][2]["qtd"]){
            this.txtPrice2.text = this.scene.txtDB["SOLDOUT"];
        }
    }

    getItemData(opt){
        let item = this.itensDB[this.catalogo][opt];
        if (item["type"] == 'item'){
            if (typeof this.scene.player.inventory.items[item["name"]] != 'undefined' && 
            this.scene.player.inventory.items[item["name"]] >= item["qtd"]){
                return {
                    msg: "SOLDOUT",
                    valor: 0,
                };
            }
        }else{
            if (typeof this.scene.player.inventory[item["type"]]["level"] != 'undefined' && 
            this.scene.player.inventory[item["type"]]["level"] >= item["level"]){
                return {
                    msg: "STUPIDEXCHANGE",
                    valor: 0,
                };
            }
        }
        
        return {
            msg: item["desc"],
            valor: item["gold"],
        };
    }

    buySumthinWillYa(opt){
        let item = this.itensDB[this.catalogo][opt];
        
        if (item.gold <= this.scene.player.gold){
            if (item.type != 'item'){
                this.scene.player.equipItem(item);
            }else{
                if (typeof this.scene.player.inventory.items[item.name] == 'undefined'){
                    this.scene.player.inventory.items[item.name] = 1;
                }else{
                    this.scene.player.inventory.items[item.name]++;
                }
                if (item.effect != "KEEP"){
                    this.scene.player.playEffect(item.effect);
                }

            }
            this.scene.player.gold -= item.gold;
            if (this.scene.player.gold < 0) this.scene.player.gold = 0;
            this.scene.messenger.showMessage([
                [this.scene.txtDB["OBRIGADOPELACOMPRAVOLTESEMPRE"],"none"]
            ],
            () => {
                if (item.type == 'item') this.updatePriceLabels();
                this.setBuyMode(true);
            });
        }else{
            this.scene.messenger.showMessage([
                [this.scene.txtDB["DINHEIROINSUFICIENTE"],"none"]
            ],
            () => {
                this.setBuyMode(true);
            });
        }
    }

    hideStore(){
        // this.textween.stop();
        this.scene.shopButtons.setVisible(false);
        this.setAllTextVisibility(false);
        this.fieldweenOut.play();
    }

    setBuyMode(mode){
        this.buymode = mode;
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