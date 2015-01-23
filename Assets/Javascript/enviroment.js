#pragma strict

import System.IO;
import System.Collections.Generic;

var shelf : Transform;
var support : Transform;
var book : Transform;
var listBookcases = new List.<Bookcase>();

function Start () {

	var line : String;
	var sr = new StreamReader("posizioni_scaffali.txt");
	
	/*var url = "./posizioni_scaffali.txt";
	
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
		
		//lettura file con info posizione degli scaffali
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
	}	// chiusura del try/catch scaffali		

	
/*	url = "./libri.txt";
		
	www = new WWW(url);
	yield www;
	
	sr = new StringReader(www.text);
	*/
	sr = new StreamReader("libri.txt");		
	
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
		var hmax = 0.0;
		
		while(line != null){
			
			info = line.Split(";"[0]);
			
			nbookcase = int.Parse(info[0])-1;
			nshelf = int.Parse(info[1])-1;
			id = info[2];
			title = info[3];
			h = float.Parse(info[4]);
			//print("h: "+h);
			w = float.Parse(info[5]) * 0.002 + 0.06; // 0.0002: spessore di un foglio; 0.006: spessore della copertina
			or = info[6];
			
			if(nbookcase != bookcasenum){
				
				shelfnum = -1;	
				hmax = 0.0;
				bookcasenum = nbookcase;
				//print("Scaffale: "+bookcasenum);				
			}			
						
		 	if(nshelf != shelfnum){
		 	
		 		var sh : Shelf;

		 		if(nshelf - shelfnum > 1){
		 			var punt = nshelf;
			 		var off = nshelf - shelfnum - 1;			 		
		 			
		 			for(var q = 0; q < off; q++){
		 				nshelf = shelfnum + 1;
			 		 	hmax = 30;
			 			sh = new Shelf(nshelf, hmax);
				 		listBookcases[bookcasenum].listShelves.Add(sh);
				 		//print("nuovo scaffale*: " + nshelf);
				 		shelfnum = nshelf;
				 		//print("Piano*: "+nshelf);
		 			}
		 			
		 			sh = new Shelf(punt, hmax);
			 		listBookcases[bookcasenum].listShelves.Add(sh);
			 		//print("nuovo scaffale**: " + punt);
			 		if(h + 15 > hmax){
						hmax = h  + 15;
					} 
			 		shelfnum = punt;
			 		//print("Piano**: "+punt);	
		 		}else if(nshelf - shelfnum == 1){	
			 		
			 		sh = new Shelf(nshelf, hmax);
			 		listBookcases[bookcasenum].listShelves.Add(sh);
			 		//print("nuovo scaffale: " + nshelf);
			 		//print("offsety: "+ listBookcases[bookcasenum].listShelves[nshelf].offsety);
			 		if(h + 15 > hmax){
						hmax = h  + 15;
					} 
			 		shelfnum = nshelf;
			 		//print("Piano: "+shelfnum);		 		
		 		}
		 		
		 	}else{
		 	
			 	if(h + 15 > hmax){
					hmax = h  + 15;
				} 			 	
		 	}			 		
		 	
			var bk = new Book(id, title, h, w, or);
			listBookcases[bookcasenum].listShelves[shelfnum].listBooks.Add(bk);
			
			line = sr.ReadLine();
		} // fine while
		
		sr.Close();	//chiusura StreamReader
		
	}catch(e){
		//let the user know what went wrong
		print("The file could not be read: ");
		print(e.Message);
	}	// chiusura del try/catch libri
	
	// disegno libri e scaffali
	drawBookcases();
	
}//chiusura di Start



function Update () {

	if(Input.GetMouseButton(0)){	//se viene schiacciato il tasto sx del mouse vogli sapere se ho cliccato su un cubo e se si quale
		//Debug.Log("Pressed left click.");
		
		/*var mouseScreenPosition = Input.mousePosition;
		print(mouseScreenPosition);		
		var mouseWorldSpace : Vector3 = Camera.mainCamera.ScreenToWorldPoint(mouseScreenPosition);		
		print(mouseWorldSpace);
		*/		
		
		var hitInfo : RaycastHit = new RaycastHit();		
		var hit = Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), hitInfo);
		
		if (hit){
		
			Debug.Log("Hit " + hitInfo.transform.gameObject.name);
			
			Debug.Log("Hit " + hitInfo.transform.GetInstanceID);
			
			if (hitInfo.transform.gameObject.tag == "selectable"){
			
				var name : String = hitInfo.transform.gameObject.name;
				
				for(var bc in listBookcases){
					for(var sh in bc.listShelves){
						for(var b in sh.listBooks){
				
							if(name == b.id){
								//print("Id: "+ b.id);
							}
						}
					}
				}
			
				Debug.Log ("It's working!");
			} else {
			
				Debug.Log ("nopz");
			}
		} else {
		
			Debug.Log("No hit");
		}
	}

}

function drawBookcases(){	

	for(var bc in listBookcases){	// scaffali
	
	if(bc.listShelves.Count > 0){	//se ci sono piani in questo scaffali allora vengono disegnati
	
		var oy : float = 0.00;
		var hmax : float = 0.00;
		
		for(var sh in bc.listShelves){		// ripiani nello scaffale		
		
			var oz : float = 0.00;
			oy += sh.offsety;
			
			createShelf(bc.posx, oy, bc.posz, bc.rot, bc.larg, bc.depth);
			
			for(var b in sh.listBooks){			// libri nel ripiano		*/
			
				/*if(b.id.Equals("ea_544-895.dds")){
					print("h = "+ b.hight);
				}*/
				if(bc.rot == 0){
					createBook(bc.posx+(15-(b.depth/2)), oy + 2.5, bc.posz - (bc.larg/2) + 3 + oz, bc.rot, b.hight, b.width, b.depth, b.id);
					oz += b.width + 0.5;
					
				} else if(bc.rot == 180){
					createBook(bc.posx-(15-(b.depth/2)), oy + 2.5, bc.posz + (bc.larg/2) - 3 + oz, bc.rot, b.hight, b.width, b.depth, b.id);
					oz -= b.width + 0.5;
					
				} else if(bc.rot == 90){
					createBook(bc.posx - (bc.larg/2) + 3 + oz, oy + 2.5, bc.posz - (15-(b.depth/2)), bc.rot, b.hight, b.width, b.depth, b.id);
					oz += b.width + 0.5;
					
				} else if(bc.rot == -90){
					createBook(bc.posx + (bc.larg/2) - 3 + oz, oy + 2.5, bc.posz + (15-(b.depth/2)), bc.rot, b.hight, b.width, b.depth, b.id);
					oz -= b.width + 0.5;
				}
				hmax = b.hight;						
			}	// chiusura for libri	
					
		}	//chiusura for ripiani
		
		createShelf(bc.posx, oy + hmax + 15, bc.posz, bc.rot, bc.larg, bc.depth);
		createSupport(bc.posx, oy + hmax + 15 + 5, bc.posz, bc.rot, bc.larg, bc.depth);	// hmax + 15 è la posizione dell'ultimo scaffale, 5 è lo spessore dello scaffale
		
		}else{					//se non ci sono piani nello scaffale ne vengono creati 8 a distanza standard
			var offsety = 0.0;
			for(var i = 0; i < 9; i++){
				createShelf(bc.posx, offsety, bc.posz, bc.rot, bc.larg, bc.depth);
				offsety += 30;
			}
			createSupport(bc.posx, offsety - 25, bc.posz, bc.rot, bc.larg, bc.depth);
		}
		
	}	// chiusura for scaffali	
}

function createShelf(posx : float, posy : float, posz : float, rot : int, larg : int, depth : int){

	var instance : Transform;
	var pos = Vector3(posx, posy, posz);
	
	transform.rotation = Quaternion.AngleAxis(rot, Vector3.up);	
	instance = Instantiate(shelf, pos, transform.rotation);
	instance.localScale = Vector3(depth, 1, larg);
}

function createSupport(posx : float, posy : float, posz : float, rot : int, larg : float, depth : float){

	var instance : Transform;
	var pos : Vector3;
	
	if(rot == 0 || rot == 180){
	
		pos = Vector3(posx , -5, posz   - (larg/2));		
		instance = Instantiate(support, pos, transform.rotation);
		instance.localScale = Vector3(depth, posy+5, depth);
		
		pos = Vector3(posx , -5, posz   + (larg/2));
		instance = Instantiate(support, pos, transform.rotation);
		instance.localScale = Vector3(depth, posy+5, depth);
		
	} else if(rot == 90 || rot == -90){
	
		pos = Vector3(posx - (larg/2), -5, posz);
		instance = Instantiate(support, pos, transform.rotation);
		instance.localScale = Vector3(depth, posy+5, depth);
		
		pos = Vector3(posx + (larg/2) , -5, posz);
		instance = Instantiate(support, pos, transform.rotation);
		instance.localScale = Vector3(depth, posy+5, depth);
	}
}

function createBook(posx : float, posy : float, posz : float, rot : int, h : float, w : float, d : float, id : String){
	
	var instance : Transform;
	var pos = Vector3(posx, posy, posz);	
	
	transform.rotation = Quaternion.AngleAxis(rot, Vector3.up);
	
	instance = Instantiate(book, pos, transform.rotation);
	//instance.transform.localScale = Vector3(d, h, w);
	instance.localScale = Vector3(d, h, w);	
	instance.name = id;
	instance.tag = "selectable";
}
/*
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
}*/