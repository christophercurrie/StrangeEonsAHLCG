// Bindings whose controls can also be removed after binding, for editors
// that add and remove controls in place. bind() hands the editor functions
// over the bindings and activeBindings lists themselves, so changes to the
// lists take effect in the bound editor.
//
// Module: returns Bindings.
define( [ 'se/ui' ], function ( ui ) {
	function Bindings( editor, gameComponent ) {
		ui.Bindings.call( this, editor, gameComponent );
	}

	Bindings.prototype = Object.create( ui.Bindings.prototype );
	Bindings.prototype.constructor = Bindings;

	// Removes the bindings for control, a control passed to add.
	Bindings.prototype.remove = function( control ) {
		// as add binds the view of a scroll pane
		if ( control instanceof javax.swing.JScrollPane ) control = control.getViewport().getView();

		[ this.bindings, this.activeBindings ].forEach( function ( list ) {
			for ( let i = list.length - 1; i >= 0; i-- ) {
				if ( list[i].control.equals( control ) ) list.splice( i, 1 );
			}
		} );
	};

	// Updates every binding; the inherited function stops updating at the
	// first binding that changes (changed = changed || update()).
	Bindings.prototype.createUpdateFunction = function() {
		var bindings = this.bindings;
		return function updateFunction() {
			let changed = false;
			for ( let i = 0; i < bindings.length; ++i ) {
				try {
					if ( bindings[i].update() ) changed = true;
				} catch ( ex ) {
					Error.handleUncaught( ex );
				}
			}
			return changed;
		};
	};

	// Copies edits not yet copied by the editor's heartbeat to the settings.
	Bindings.prototype.flush = function() {
		return this.createUpdateFunction()();
	};

	return Bindings;
} );
