var Composer = (function(Composer, $, d3){
	"use strict";

	Composer.initialize = function() {
		Composer.song = {};
        Composer.songNotePosition = 1;
        Composer.songLinePosition = 1;
        App.listenForKeys(Composer.recordNote);
	}

	Composer.recordNote = function(code){
        var key = _.findWhere(App.keys, {code : code.toString()});
        if(key != undefined){
            var note_id = key['note_id'];
            // Play note audio file
            App.playNote(note_id);
            // Save note,
            Composer.saveNoteInSong(note_id);
            // Show note
            Composer.showNote(note_id);
            // If its the last note in actual line move everything to next line
        } 
        else App.debug('Another key pressed, its not a note. Maybe an incorrect makeymakey connection?');
    }

    Composer.saveNoteInSong = function(code){
    	App.debug("Note " + code + " saved into current song.");
    }

    Composer.showNote = function(code){
    	App.debug("Display " + code + " note in th3e music sheet.");
    }

	return Composer;

})(Composer || {}, jQuery, d3);