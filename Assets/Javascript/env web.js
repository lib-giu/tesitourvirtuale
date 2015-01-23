/*#pragma strict

import System.IO;
import System.Collections.Generic;

var shelf : Transform;
var support : Transform;
var book : Transform;
var listBookcases = new List.<Bookcase>();
	

function Start () {

	
	
		var line : String;
		//var sr = new StreamReader("posizioni_scaffali_1.txt");
		
		var url = "./posizioni_scaffali_1.txt";
		
		var www : WWW = new WWW(url);
		yield www;
		
		var sr = new StringReader(www.text);
		
		try{
		
		var info : String[];
		var posx : float;
		var posz : float;
		var rot : float;
		
		//lettura file con info posizione degli scaffali
		line = sr.ReadLine();
		
		while(line != null){
			info = line.Split(";"[0]);
			posz = float.Parse(info[0]);
			posx = float.Parse(info[1]);
			rot = float.Parse(info[2]);
			
			var b = new Bookcase(posx, posz, rot);
			listBookcases.Add(b);
			//Debug.Log(listBookcases.Count);
			line = sr.ReadLine();
		}
		
		//lettura file con info libri
		
		//sr = new StreamReader("libri.txt");
		}catch(e){
		//let the user know what went wrong
		print("The file could not be read: ");
		print(e.Message);
	}
		url = "./libri-s10-11.txt";
		
		www = new WWW(url);
		yield www;
		
		sr = new StringReader(www.text);
		
		//sr = new StreamReader("libri-s10-11.txt");		
		try{
		line = sr.ReadLine();
		
		var nbookcase : int;
		var nshelf : int;
		var id : String;
		var title : String;
		var h : float;
		var w : float;
		var or : String;
		
		var listShelves = new List.<Shelf>();
		var listBooks = new List.<Book>();
		
		var bookcasenum : int = -1;
		var shelfnum : int = -1;
		var hmax = 0.00;
		
		while(line != null){
			
			info = line.Split(";"[0]);
			
			nbookcase = int.Parse(info[0])-1;
			nshelf = int.Parse(info[1])-1;
			id = info[2];
			title = info[3];
			h = float.Parse(info[4]);
			//print("h: "+h);
			w = float.Parse(info[5]) * 0.0002 + 0.006; // 0.0002: spessore di un foglio; 0.006: spessore della copertina
			or = info[6];
			
			if(nbookcase != bookcasenum){
				
				shelfnum = -1;	
				hmax = 0.0;
				bookcasenum = nbookcase;
				//print("Scaffale: "+bookcasenum);				
			}
			
						
		 	if(nshelf != shelfnum){
		 		//print("hmax: "+ hmax);
		 		var sh = new Shelf(nshelf, hmax);
		 		listBookcases[bookcasenum].listShelves.Add(sh);
		 		//print("offsety: "+ listBookcases[bookcasenum].listShelves[nshelf].offsety);
		 		if(h + 0.15 > hmax){
					hmax = h  + 0.15;
				} 
		 		shelfnum = nshelf;
		 		//print("Piano: "+shelfnum);
		 	}else{
		 	
			 	if(h + 0.15 > hmax){
					hmax = h  + 0.15;
				} 			 	
		 	}			 		
		 	
			var bk = new Book(id, title, h, w, or);
			listBookcases[bookcasenum].listShelves[shelfnum].listBooks.Add(bk);
			
			line = sr.ReadLine();
		} // fine while
		
		sr.Close();	//chiusura StreamReader
		
		drawBookcases();
	
		}catch(e){
		//let the user know what went wrong
		print("The file could not be read: ");
		print(e.Message);
	}// chiusura del try/catch
}	//chiusura di Start()

function Update () {
}

function drawBookcases(){	

	for(var bc in listBookcases){	// scaffali
	
	if(bc.listShelves.Count > 0){
		var oy : float = 0.00;
		var hmax : float = 0.00;
		for(var sh in bc.listShelves){		// ripiani nello scaffale			
			
			var oz : float = 0.00;
			oy += sh.offsety;
			
			if(sh.nshelf == 1){
				print("oy: " + oy);
			}
			
			createShelf(bc.posx, oy, bc.posz, bc.rot);
			
			for(var b in sh.listBooks){			// libri nel ripiano
			
				/*if(b.id.Equals("ea_544-895.dds")){
					print("h = "+ b.hight);
				}*/
		/*		if(bc.rot == 0){
					createBook(bc.posx + 0.05, oy + 0.05, bc.posz - 0.47 + oz, bc.rot, b.hight, b.width);
					oz += b.width + 0.01;
				} else if(bc.rot == 180){
					createBook(bc.posx - 0.05, oy + 0.05, bc.posz + 0.47 + oz, bc.rot, b.hight, b.width);
					oz -= b.width + 0.01;
				} else if(bc.rot == 90){
					createBook(bc.posx - 0.47 + oz, oy + 0.05, bc.posz - 0.05, bc.rot, b.hight, b.width);
					oz += b.width + 0.01;
				} else if(bc.rot == -90){
					createBook(bc.posx + 0.47 + oz, oy + 0.05, bc.posz + 0.05, bc.rot, b.hight, b.width);
					oz -= b.width + 0.01;
				}
				hmax = b.hight;			
				
				
				
			}	// chiusura for libri		
		}	//chiusura for ripiani
		
		createShelf(bc.posx, oy + hmax + 0.15, bc.posz, bc.rot);
		createSupport(bc.posx, oy + hmax + 0.15 + 0.05, bc.posz, bc.rot);	// hmax+0.15 è la posizione dell'ultimo scaffale, 0.05 è lo spessore dello scaffale
		
		}else{
			var offsety = 0.0;
			for(var i = 0; i < 8; i++){
				createShelf(bc.posx, offsety, bc.posz, bc.rot);
				offsety += 0.3;
			}
			createSupport(bc.posx, offsety - 0.3 + 0.05, bc.posz, bc.rot);
		}
		
	}	// chiusura for scaffali
	
}

function createShelf(posx : float, posy : float, posz : float, rot : int){

	var instance : Transform;
	//var instanceSupport : Transform;
	var pos = Vector3(posx, posy, posz);
	
	transform.rotation = Quaternion.AngleAxis(rot, Vector3.up);	
	instance = Instantiate(shelf, pos, transform.rotation);
}

function createSupport(posx : float, posy : float, posz : float, rot : int){

	var instance : Transform;
	//var instanceSupport : Transform;
	var pos = Vector3(posx, 0.0, posz);
	
	transform.rotation = Quaternion.AngleAxis(rot, Vector3.up);	
	instance = Instantiate(support, pos, transform.rotation);
	instance.localScale = Vector3(1, posy, 1);
}

function createBook(posx : float, posy : float, posz : float, rot : int, h : float, w : float){
	
	var instance : Transform;
	var pos = Vector3(posx, posy, posz);	
	
	transform.rotation = Quaternion.AngleAxis(rot, Vector3.up);
	
	instance = Instantiate(book, pos, transform.rotation);
	instance.localScale = Vector3(1, h, w);	
}

// NUOVE CLASSI

class Bookcase {

	var posx : float;
	var posz : float;
	var rot : float;
	var listShelves = new List.<Shelf>();
	
	function Bookcase(posx : float, posz : float, rot : float){
		
		this.posx = posx;
		this.posz = posz;
		this.rot = rot;
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
	
	function Book(id : String, title : String, h : float, w: float, or : String){
		this.id = id;
		this.title = title;
		this.hight = h;
		this.width = w;
		this.orientation = or;
	}
}
*/

