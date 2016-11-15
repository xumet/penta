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
            App.playNote(note_id);

            // Save note,
            Composer.saveNoteInSong(note_id);
            // Show note

            // Si ultima nota en fila crear nueva fila

            
        } 
        else App.debug('Another key pressed, its not a note. Maybe an incorrect makeymakey connection?');
    }

    Composer.saveNoteInSong = function(code){
    	console.log("grabar nota en cancion " + code);
    }

	return Composer;

})(Composer || {}, jQuery, d3);