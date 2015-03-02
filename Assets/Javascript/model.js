﻿#pragma strict

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
	
	function Bookcase(posx : float, posz : float,
					rot : float, larg : float, depth : float) {
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
	var hmax : float = 40;
	
	function Shelf(ns : int, h : float) {
		this.nshelf = ns;		
		if(h > hmax){
			h = hmax + 5;
		}
		this.offsety = h;
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
	
	
	function Book(id : String, title : String, h : float, w: float,
				linkPdf : String, linkCatalog : String, imgUrl : String) {
		this.id = id;
		this.title = title;
		if(h > hmax){
			h = hmax;
		}
		this.hight = h;
		this.width = w;
		this.linkPdf = linkPdf;
		this.linkCatalog = linkCatalog;
		this.imgUrl = imgUrl;
		depth = 25;
	}
}
