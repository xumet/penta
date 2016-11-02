"use strict";

if(localStorage["token"] === undefined ){
    localStorage["token"] = 'blank';
}


var sw_song = [
                're','re','re','sol','si','dom','si','la','solm','rem','dom','si','la','solm','rem','dom','si','dom','la','re','re','re','sol','rem',
                'dom','si','la','solm','rem','dom','si','la','solm','rem','dom','si','dom','la','re','re','mi','mi','dom','si','la','sol','sol','la','si','la','mi','fa','re','re','mi','mi','dom','si','la','sol',
                'rem','la','la','re','re','mi','mi','dom','si','la','sol','sol','la','si','la','mi','fa','rem','rem','solm','fam','mim','rem','dom','si','la','sol','rem','la','la','la','re','re','re','sol','rem',
                'dom','si','la','solm','rem','dom','si','la','solm','rem','dom','si','dom','la','re','re','re','sol','rem',
                'dom','si','la','solm','rem','dom','si','la','solm','rem','dom','si','dom','la','rem','rem','rem','solm','sol','sol','sol','sol'
            ];

App.initialize();
App.initPlayer(sw_song);
//App.initComposer();