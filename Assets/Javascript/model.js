#pragma strict

//
// Data model of this project
//

function Start () {
	/* nothing to do */
}

function Update () {
	/* nothing to do */
}

class Bookcase {	
	var posx : float;
	var posz : float;
	var rot : float;
	var larg : float;
	var depth : float;
	var listShelves = new List.<Shelf>();
	
	function Bookcase(posx : float, posz : float, rot : float, larg : float, depth : float) {
		this.posx = posx;
		this.posz = posz;
		this.rot = rot;
		this.larg = larg;
		this.depth = depth;
	}
}

class Shelf {
	var nshelf : int;
	var offsety : float; 
	var listBooks = new List.<Book>();
	var butt : ButtonInfo;
	var hmax : float = 40;
	
	function Shelf(ns : int, h : float, b : ButtonInfo) {
		this.nshelf = ns;		
		if(h > hmax){
			h = hmax + 5;
		}
		this.offsety = h;
		this.butt = b;
	}
	
	function Shelf(ns : int, h : float) {
		this.nshelf = ns;		
		if(h > hmax){
			h = hmax + 5;
		}
		this.offsety = h;
	}
}

class ButtonInfo {
	var id : String;
	var nBookcase : int;
	var nShelf : int;
	function ButtonInfo (nBookcase : int, nshelf : int) {
		this.nBookcase = nBookcase;
		this.nShelf = nshelf;
		id = nBookcase + "|" + nshelf;
	}
}

class Book {
	var id : String;
	var title : String;
	var hight : float;
	var width : float;	
	var depth : float;
	var linkPdf : String;
	var linkCatalog : String;
	var imgUrl : String;
	var hmax : float = 40;
	var limited : boolean = false;
	
	function Book(id : String, title : String, h : float, w: float, linkPdf : String, linkCatalog : String, imgUrl : String) {
		this.id = id;
		this.title = title;
		if(h > hmax){
			h = hmax;
			limited = true;
		}
		this.hight = h;
		this.width = w;
		this.linkPdf = linkPdf;
		this.linkCatalog = linkCatalog;
		this.imgUrl = imgUrl;		
		depth = 25;
	}
}