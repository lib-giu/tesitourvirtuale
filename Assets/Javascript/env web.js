#pragma strict

import System.IO;
import System.Collections.Generic;

var shelf : Transform;
var support : Transform;
var book : Transform;
var listBookcases = new List.<Bookcase>();

function Start () {

	var line : String;
	var sr = new StreamReader("posizioni_scaffali_1.txt");

/*	var url = "./posizioni_scaffali_1.txt";

	var www : WWW = new WWW(url);
	yield www;

	var sr = new StringReader(www.text);
*/
	try{

		var info : String[];
		var posx : float;
		var posz : float;
		var rot : float;
		var larg : float;
		var depth : float;

		//read file with position of bookcase
		line = sr.ReadLine();

		while(line != null){
			info = line.Split(";"[0]);
			posz = float.Parse(info[0]);
			posx = float.Parse(info[1]);
			rot = float.Parse(info[2]);
			larg = float.Parse(info[3]);
			depth = float.Parse(info[4]);

			var b = new Bookcase(posx, posz, rot, larg, depth);
			listBookcases.Add(b);
			//Debug.Log(listBookcases.Count);
			line = sr.ReadLine();
		}

	}catch(e){
		//let the user know what went wrong
		print("The file could not be read: ");
		print(e.Message);
	}
	
	sr = new StreamReader("libri-s10-11.txt");	

/*	url = "./libri-s10-11.txt";

	www = new WWW(url);
	yield www;
	
	sr = new StringReader(www.text);		
*/	
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
			w = float.Parse(info[5]) * 0.0002 + 0.006; // 0.0002: thickness of sheet of paper; 0.006: thickness of cover
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
		
		sr.Close();	//close StreamReader or StreamReader
		
	}catch(e){
		//let the user know what went wrong
		print("The file could not be read: ");
		print(e.Message);
	}// close try/catch
	
	drawBookcases();
}	//close Start()

function Update () {
}

function drawBookcases(){	

	for(var bc in listBookcases){	// bookcases
	
	if(bc.listShelves.Count > 0){
	
		var oy : float = 0.00;
		var hmax : float = 0.00;
		
		for(var sh in bc.listShelves){		// shelves in the bookcase			
			
			var oz : float = 0.00;
			oy += sh.offsety;
			
			if(sh.nshelf == 1){
				print("oy: " + oy);
			}
		
			createShelf(bc.posx, oy, bc.posz, bc.rot, bc.larg, bc.depth);
			
			for(var b in sh.listBooks){			// books on the shelf
			
				if(bc.rot == 0){
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
				
			}	// close for() books	
		}	//close for() shelves
		
		createShelf(bc.posx, oy + hmax + 0.15, bc.posz, bc.rot, bc.larg, bc.depth);
		createSupport(bc.posx, oy + hmax + 0.15 + 0.05, bc.posz, bc.rot, bc.larg, bc.depth);	// hmax+0.15 is the position of the last shelf, 0.05 is the thickness of shelf
		
		}else{
			var offsety = 0.0;
			for(var i = 0; i < 8; i++){
				createShelf(bc.posx, offsety, bc.posz, bc.rot, bc.larg, bc.depth);
				offsety += 0.3;
			}
			createSupport(bc.posx, offsety - 0.3 + 0.05, bc.posz, bc.rot, bc.larg, bc.depth);
		}//close else
	}	// close for() bookcases	
} //close drawBookcases()

function createShelf(posx : float, posy : float, posz : float, rot : int, larg : float, depth : float){

	var instance : Transform;
	var pos = Vector3(posx, posy, posz);
	
	transform.rotation = Quaternion.AngleAxis(rot, Vector3.up);	
	instance = Instantiate(shelf, pos, transform.rotation);
	instance.localScale = Vector3(depth, 1, larg);
}

function createSupport(posx : float, posy : float, posz : float, rot : int, larg : float, depth : float){

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