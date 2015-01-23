#pragma strict

function Start () {

}

function Update () {

}

// -- NUOVE CLASSI --

class Bookcase {
	
	var posx : float;
	var posz : float;
	var rot : float;
	var larg : float;
	var depth : float;
	var listShelves = new List.<Shelf>();
	
	function Bookcase(posx : float, posz : float, rot : float, larg : float, depth : float){
	
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
	
	function Shelf(ns : int, h : float){
		this.nshelf = ns;
		this.offsety = h;
	}
}

class Book {

	var id : String;
	var title : String;
	var hight : float;
	var width : float;
	var orientation : String;
	var depth : float;
	
	function Book(id : String, title : String, h : float, w: float, or : String){
		this.id = id;
		this.title = title;
		this.hight = h;
		this.width = w;
		this.orientation = or;
		depth = 25;
	}
}

class NewCube{

	var id : String;
	var name :  String;
	var side : int;
	var x : float;
	var z : float;
	
	function NewCube(id : String, name : String, side : int, x :float, z : float){
		
		this.id = id;
		this.name = name;
		this.side = side;
		this.x = x;
		this.z = z;
	}
}






















