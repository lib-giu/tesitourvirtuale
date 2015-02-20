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
	
	function Shelf(ns : int, h : float) {
		this.nshelf = ns;
		this.offsety = h;
	}
}

class Book {

	var id : String;
	var title : String;
	var hight : float;
	var width : float;	
	var depth : float;
	
	function Book(id : String, title : String, h : float, w: float) {
		this.id = id;
		this.title = title;
		this.hight = h;
		this.width = w;
		depth = 25;
	}
}