var App = (function(App){
    "use strict";

    App.settings = {
        "debug" : true,
        "width" : null,
        "height" : null,
        "note_size" : 50,
        "img_path" : "img/png500/"
    }

    App.initialize = function() {

    	$(document).ready(function(){
            
            if(App.settings.debug){
                $("main").append('<div id="debugOutput">App debug is ON<br>-----------------------<br></div>');
            }

            App.debug("jQuery up and running");

            if(typeof(d3) != 'undefined') App.debug('d3 loaded'); else App.debug('ERROR loading d3 !!!');

            App.settings.width = $( document ).width();
            App.settings.height = $( document ).height();

            App.debug("width: " + App.settings.width);
            App.debug("height: " + App.settings.height);

            App.svg = d3.select("#musicsheet").append("svg");
            App.svg.attr("id", "pentagram"),
            App.svg.attr("width", App.settings.width - 34);
            App.svg.attr("height", 2000);// App.settings.height - 50);


            App.defs = App.svg.append('svg:defs');

            App.svgSheet = App.svg.append("g");

            // Musical notes, Used latin notation (do,re,mi...), added english name for clarification.
            App.notes = [
                {id : '0', name : 'solm', img : 'zanahoria1.png', english_name: 'Gs'},
                {id : '1', name : 'fam', img : 'cebolla1.png', english_name: 'Fs'},
                {id : '2', name : 'mim', img : 'pimiento1.png', english_name: 'Es'},
                {id : '3', name : 'rem', img : 'tomate1.png', english_name: 'Ds'},
                {id : '4', name : 'dom', img : 'kiwi3.png', english_name: 'Cs'},
                {id : '5', name : 'si', img : 'naranja3.png', english_name: 'B'},
                {id : '6', name : 'la', img : 'melocoton2.png', english_name: 'A'},
                {id : '7', name : 'sol', img : 'limon1.png', english_name: 'G'},
                {id : '8', name : 'fa', img : 'manzana3.png', english_name: 'F'},
                {id : '9', name : 'mi', img : 'pera2.png', english_name: 'E'},
                {id : '10', name : 're', img : 'platano4.png', english_name: 'D'},
                {id : '11', name : 'do', img : 'sandia2.png', english_name: 'C'}
            ];

            // Keyboard Chard Codes for the keys used by makey makey
            App.keys = [
                {chard : 'w', code : '87', note_id : '0'},
                {chard : 'a', code : '65', note_id : '1'},
                {chard : 's', code : '83', note_id : '2'},
                {chard : 'd', code : '68', note_id : '3'},
                {chard : 'f', code : '70', note_id : '4'},
                {chard : 'g', code : '71', note_id : '5'},
                {chard : 'up', code : '38', note_id : '6'},
                {chard : 'down', code : '40', note_id : '7'},
                {chard : 'left', code : '37', note_id : '8'},
                {chard : 'right', code : '39', note_id : '9'},
                {chard : 'space', code : '32', note_id : '10'},
                {chard : 'click', code : '-1', note_id : '11'}
            ];

            // Sample Song: Star Wars 
            var sw_song = [
                're','re','re','sol','si','dom','si','la','solm','rem','dom','si','la','solm','rem','dom','si','dom','la','re','re','re','sol','rem',
                'dom','si','la','solm','rem','dom','si','la','solm','rem','dom','si','dom','la','re','re','mi','mi','dom','si','la','sol','sol','la','si','la','mi','fa','re','re','mi','mi','dom','si','la','sol',
                'rem','la','la','re','re','mi','mi','dom','si','la','sol','sol','la','si','la','mi','fa','rem','rem','solm','fam','mim','rem','dom','si','la','sol','rem','la','la','la','re','re','re','sol','rem',
                'dom','si','la','solm','rem','dom','si','la','solm','rem','dom','si','dom','la','re','re','re','sol','rem',
                'dom','si','la','solm','rem','dom','si','la','solm','rem','dom','si','dom','la','rem','rem','rem','solm','sol','sol','sol','sol'
            ];

            var cello = [
                // TODO
            ];

            var piano = [
                {id : '', file : 'piano/piano-key-g5.wav'},
                {id : '', file : 'piano/piano-key-f5.wav'},
                {id : '', file : 'piano/piano-key-e5.wav'},
                {id : '', file : 'piano/piano-key-d5.wav'},
                {id : '', file : 'piano/piano-key-c5.wav'},
                {id : '', file : 'piano/piano-key-b4.wav'},
                {id : '', file : 'piano/piano-key-a4.wav'},
                {id : '', file : 'piano/piano-key-g4.wav'},
                {id : '', file : 'piano/piano-key-f4.wav'},
                {id : '', file : 'piano/piano-key-e4.wav'},
                {id : '', file : 'piano/piano-key-d4.wav'},
                {id : '', file : 'piano/piano-key-c4.wav'}
            ];

            App.instrument = piano;
            
            // Load de files for every note
            App.sounds = [];
            for(var i = 0; i < App.instrument.length; i++){
                App.sounds[i] = document.createElement('audio');
                App.sounds[i].setAttribute('src', 'sounds/' + App.instrument[i].file);
            }

            App.song = sw_song;
            App.songNotePosition = 1;
            App.songLinePosition = 1;

            App.setNotesPatterns(App.notes);

            App.drawSongSheet(App.song);

            App.drawNextNote();
            
            // Launch an fake animation for preload the music sheet in GPU memory
            $("#musicsheet").animate({
                top: "-=1"
            }, 10);
            
            // Listen keyboard for key press (masked by the makey makey)
            $( "body" ).keydown(function(event) {
                App.debug("Press key: " + event.keyCode);
                App.playSong(event.keyCode);
            });

            // Listen right mouse button (masked by the makey makey)
            $(document).on('contextmenu', function(event){
                event.preventDefault();
                App.playSong('-1');
            });
        });
    }

    // Create the imageIcons (patterns) for notes
    App.setNotesPatterns = function(data){
        var note_id;
        var note_img;

        for(var i = 0; i< data.length; i++){
            note_id = data[i]['id'];
            note_img = data[i]['img'];

            App.defs.append("svg:pattern")
                .attr("id", ("pattern_" + note_id))
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", App.settings.note_size)
                .attr("height", App.settings.note_size)
                .attr("patternUnits", "objectBoundingBox")// "userSpaceOnUse")
                //.attr("patternContentUnits", "objectBoundingBox")
                .append("svg:image")
                .attr("xlink:href", (App.settings.img_path + note_img ))
                .attr("width", App.settings.note_size)
                .attr("height", App.settings.note_size)
                .attr("x", 0)
                .attr("y", 0);
        }
    };
 
    // Draw a single line of the Pentagram
    App.drawPentaLine = function(y){
        App.svgSheet.append("line")
        .attr("x1", 0)
        .attr("y1", y)
        .attr("x2", App.svg.attr("width"))
        .attr("y2", y)
        .attr("stroke-width", 1)
        .attr("stroke", "black");
    }

    // Draw a pentagram (5 lines)
    App.drawPenta = function(y){
        for (var i = 0; i < 5; i++) {
            App.drawPentaLine(y + (App.settings.note_size * i));
        };
    }

    // Draw the icon note
    App.drawNote = function(pattern_id , pos_x, pos_y){
        App.svgSheet.append("rect")
        .attr("x", pos_x)
        .attr("y", pattern_id * (App.settings.note_size / 2) + pos_y)
        .attr("width", App.settings.note_size)
        .attr("height", App.settings.note_size)
        .attr("fill", "url(#pattern_" + pattern_id + ")");
    }

    // Draw Song Sheet
    App.drawSongSheet = function(song){
        // Calc number of notes by line
        var notes_in_line = parseInt(App.svg.attr("width") / App.settings.note_size);
        App.debug('notes_in_line: ' + notes_in_line);
        
        var note;
        var note_id;
        var note_name;
        App.debug('lines: ' + Math.ceil(song.length / notes_in_line));

        for (var i = 0; i < Math.ceil(song.length / notes_in_line) ; i++) {
            // Draw the pentagram
            App.drawPenta(i * (App.settings.note_size * 7 ) + App.settings.note_size);
            App.debug(" ++++++++++ Draw Penta num: " + (i+1));
            
            // Draw notes in current pentagram
            for(var n = 0; n < notes_in_line; n++)
            {
                note_name = song[n + (notes_in_line * i) ];
                note = _.findWhere(App.notes, {name : note_name});
                note_id = note['id'];
                App.drawNote(note_id, n * App.settings.note_size , App.settings.note_size * 7 * i);
                App.debug(note_name);
                if(n + (notes_in_line * i) == song.length -1) n = notes_in_line;
            };  
        };
    }

    // Create the pointer, start at the first note
    App.drawNextNote = function(){
        App.nextNote = App.svgSheet.append("rect")
            .attr("x",0)
            .attr("y",0)
            .attr("width", App.settings.note_size)
            .attr("height", App.settings.note_size * 7)
            .attr("fill", "rgb( 144,238,144)")
            .attr("opacity", 0.4);
    }

    // Scroll the Music Sheet down to show the next pentagram
    App.nextPentagramLine = function(){
        $("#musicsheet").animate({
            top: "-=" + (App.settings.note_size * 7)
        }, 1000, function(){
            App.debug("Animation complete");
        });
    }

    // Main function called after every key press
    App.playSong = function(code){
        var key = _.findWhere(App.keys, {code : code.toString()});
        if(key != undefined){
            var note_id = key['note_id'];
            App.playNote(note_id);
            var note = _.findWhere(App.notes, {id : note_id});
            var note_name = note['name'];
            
            // If its the correct note move the green pointer
            if(note_name == App.song[App.songNotePosition - 1]){
                App.debug("OK for " + note_name);
                
                // If its the last note in actual line move everything to next line
                if(0 == (App.songNotePosition ) % (parseInt(App.svg.attr("width") / App.settings.note_size))){
                    App.nextPentagramLine();
                    App.nextNote.attr("y", parseInt(App.nextNote.attr("y")) +  (App.settings.note_size * 7));
                    App.nextNote.attr("x",0);
                    App.songLinePosition++;
                }
                else {
                    App.nextNote.transition().attr("x", App.settings.note_size * (App.songNotePosition % (parseInt(App.svg.attr("width") / App.settings.note_size) ) ) );
                }
                
                App.songNotePosition++;

            }
            else {
                App.debug("Wrong...");
                App.nextNote.attr("fill", "rgb(255,99,71)"); // Tomato Color
                App.nextNote.transition().delay(100).attr("fill", "rgb(144,238,144)"); // Turn to green color
            }

        } else App.debug('Another key pressed, its not a note. Maybe an incorrect makey makey connection');
    }

    // Play the note
    App.playNote = function(note){
        App.debug("Playing " + note + " note.");
        App.sounds[note].pause();
        App.sounds[note].currentTime = 0;
        App.sounds[note].play();

    }
    
    // Output debug message
    App.debug = function(text){
        if(App.settings.debug){
            console.log("Penta-> " + text);
            $("#debugOutput").append(text+ "<br>");
        }
    }

    return App;

})(App || {}, jQuery, d3);

