var Player = (function(Player, $, d3){
	"use strict";

	Player.initialize = function(song){
        App.song = song;
        App.songNotePosition = 1;
        App.songLinePosition = 1;

        Player.drawSongSheet(App.song);
        App.drawNextNote();

        App.listenForKeys(Player.playNoteInSong);
    }

    // Draw Song Sheet
    Player.drawSongSheet = function(song){
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

    // Main function called after every key press
    Player.playNoteInSong = function(code){
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
            else { // The note its incorrect show de red pointer over the actual note
                App.debug("Wrong...");
                App.nextNote.attr("fill", "rgb(255,99,71)"); // Tomato Color
                App.nextNote.transition().delay(100).attr("fill", "rgb(144,238,144)"); // Turn to green color
            }

        } 
        else App.debug('Another key pressed, its not a note. Maybe an incorrect makeymakey connection?');
    }

	return Player;

})(Player || {}, jQuery, d3);