var scoreboard = scoreboard || (function(_canvasObject) {
	/* to be initialized with canvas object.  will pull (or
	 * be fed) position and object information from api or 
	 * from user input
	 */

	function Shape(p, xpos, ypos) {
		// generic object to be displayed
		this.p = p; // parent
		this.xpos = xpos || 0;
		this.ypos = ypos || 0;
	}

	Shape.prototype.draw = function(_context) {
		_context.fillRect(this.xpos, this.ypos, 100, 100);
	}

	function TextShape(p, xpos, ypos, text, font) {
		Shape.call(this, p, xpos, ypos);
		this.text = text || 'undefined';
		this.font = font || 'asciiBasic';
	}
	TextShape.prototype = Object.create(Shape.prototype);

	TextShape.prototype.drawChar = function(_char, _x, _y, _s) {
		var i = (_char.charCodeAt(0) - 32)*5;
		var t = fonts[this.font].slice(i, i+5);
		var ctx = this.p.context;
		for(var j=0; j<t.length; j++) {
			var p = ('000000' + t[j].toString(2)).slice(-7);
			for(var i=0; i<p.length; i++) {
				if(p[i] == '1') ctx.fillRect(_x*_s + j*_s, 7*_s + _y*_s - i*_s, _s, _s);
			}
		}


		return t;

	}

	TextShape.prototype.draw = function() {
		for(var i=0; i<this.text.length; i++) {
			this.drawChar(this.text[i], this.xpos + 6*i, this.ypos, this.p.pixelSize);
		}
	}


	function RectangleShape(p, xpos, ypos, width, height) {
		Shape.call(this, p, xpos, ypos);
		this.width = width;
		this.height = height;
	}
	RectangleShape.prototype = Object.create(Shape.prototype);


	function BoardExtent(p, xpos, ypos, width, height) {
		// grab objects from 
		this.parentCanvasObject = _canvasObject;

	}

	BoardExtent.prototype.draw = function() {
		/* represent extend of BoardExtent visually, potentially
		 * highlight captured objects
		 */
	}


	function Display(xpos, ypos, width, height, psize) {
		this.xpos = xpos;
		this.ypos = ypos;
		this.width = width;
		this.height = height;
		this.parentCanvas = _canvasObject;
		this.children = [];
		this.pixelSize = psize;
	}

	Display.prototype.addChild = function(_child) {
		// add validation here
		this.children.push(_child);
	}

	Display.prototype.adjustSize = function() {
		// update width / height to match pixel size
		this.context = this.parentCanvas.getContext('2d');
		var w = this.width*this.pixelSize;
		var h = this.height*this.pixelSize;
		if(w != this.parentCanvas.width) this.parentCanvas.width = w;
		if(h != this.parentCanvas.height) this.parentCanvas.height = h;
		this.context.fillStyle = "white";
		this.context.fillRect(0, 0, this.width*this.pixelSize, this.height*this.pixelSize);
		this.context.fillStyle = "black";
	}

	Display.prototype.draw = function() {
		this.adjustSize();
		for(var i=0; i<this.children.length; i++) {
			this.children[i].draw(this.context);
		}
	}

	var dw = new Display(0, 0, 100, 100, 4);
	dw.addChild(new TextShape(dw, 0, 5, '0000'));
	dw.addChild(new TextShape(dw, 0, 15, 'hello'));
	dw.addChild(new TextShape(dw, 0, 25, 'what\'s'));
	dw.addChild(new TextShape(dw, 0, 35, 'up'));
	dw.draw();


	return {
		'draw' : function() { dw.draw()},
		'incr' : function(_up) {
			if(_up) dw.pixelSize < 10 ? dw.pixelSize++ : null;
			else dw.pixelSize > 1 ? dw.pixelSize-- : null;
			dw.draw();
		},
		'changePixelSize' : function(_s) {
			dw.pixelSize = _s;
			dw.draw();
		},
		'addObject' : function(_x, _y, _text) {
			dw.addChild(new TextShape(dw, _x, _y, _text));
			dw.draw();
		},
		'clearObjects' : function() {
			dw.children = [];
			dw.draw();
		},
		'listObjects' : function() {
			return dw.children;
		}
	}
});

var s = scoreboard(document.getElementById('boardPreview'));
