﻿#pragma strict

//
// The "main" scene of this project
//

import System.IO;
import System.Collections.Generic;
import UnityEngine.UI;

import UnityEngine;
import UnityEngine.EventSystems;
import System.Collections;

var shelf : Transform;
var support : Transform;
var book : Transform;
var button : Transform;
var listBookcases = new List.<Bookcase>();
var webSwitch : boolean = true;
var url : String;
var urlPdf : String;
var urlCatalog : String;
var url_biblio :String;
var desc : String;
var urlImg : String;


function Start () {

	var line : String;
	var sr = new StreamReader("posizioni_scaffali.txt");
	//var url = "./posizioni_scaffali.txt";
	//var www : WWW = new WWW(url);
	//yield www;
	//var sr = new StringReader(www.text);

	try {
		var info : String[];
		var posx : float;
		var posz : float;
		var rot : float;
		var larg : float;
		var depth : float;

		// read file with the position of all bookcases
		line = sr.ReadLine();

		while (line != null) {
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

	} catch(e) {
		print("The file could not be read: ");
		print(e.Message);
		return;
	}
	
	sr = new StreamReader("img_url.txt");
	//url = "./img_url.txt";
	//www = new WWW(url);
	//yield www;
	//sr = new StringReader(www.text);
	
	try {
		url_biblio = sr.ReadLine();

	} catch(e) {
		print("The file could not be read: ");
		print(e.Message);
		return;
	}	
	
	sr = new StreamReader("libri.txt");	
	//url = "./libri.txt";
	//www = new WWW(url);
	//yield www;
	//sr = new StringReader(www.text);

	try {
		line = sr.ReadLine();
		
		var nbookcase : int;
		var nshelf : int;
		var id : String;
		var title : String;
		var h : float;
		var w : float;
		var linkPdf : String;
		var linkCatalog : String;
		var imgUrl : String;
		
		var listShelves = new List.<Shelf>();
		var listBooks = new List.<Book>();
		
		var bookcasenum : int = -1;
		var shelfnum : int = -1;
		var hmax = 0;
		
		while (line != null) {
			info = line.Split("|"[0]);

			nbookcase = int.Parse(info[0])-1;
			nshelf = int.Parse(info[1])-1;
			id = info[2];
			title = info[3];
			h = float.Parse(info[4]);
			//
			// 0.002: thickness of the sheet of paper;
			// 0.06: thickness of the cover
			//
			//w = float.Parse(info[5]) * 0.002 + 0.06;
			//
			w = float.Parse(info[5]);
			linkPdf = info[6];
			linkCatalog = info[7];
			imgUrl = info[8];
			
			var sh : Shelf;
			var buttonInfo : ButtonInfo;

			if (nbookcase != bookcasenum) {
				if (shelfnum != -1) {
					sh = new Shelf(shelfnum, hmax);
					listBookcases[bookcasenum].listShelves.Add(sh);
				}				
				shelfnum = -1;	
				hmax = 0;
				bookcasenum = nbookcase;
			}
					
			if (nshelf != shelfnum) {
				
				
				if (nshelf - shelfnum > 1) {

					var punt = nshelf;
					var off = nshelf - shelfnum - 1;
					
					
					for (var q = 0; q < off; q++) {
						nshelf = shelfnum + 1;
						if (nshelf == 0) {
							hmax = 0;
						}else {
							hmax = 30;
						}						
						sh = new Shelf(nshelf, hmax);
						listBookcases[bookcasenum].listShelves.Add(sh);
						shelfnum = nshelf;
					}
					buttonInfo = new ButtonInfo(nbookcase, punt);
					sh = new Shelf(punt, hmax, buttonInfo);
					listBookcases[bookcasenum].listShelves.Add(sh);
					
					//print("button: " + buttonInfo.id);
					
					if (h + 5 > hmax) {
						hmax = h + 5;
					}
					shelfnum = punt;
					
				} else if (nshelf - shelfnum == 1) {	
					buttonInfo = new ButtonInfo(nbookcase, nshelf);		
					sh = new Shelf(nshelf, hmax, buttonInfo);
					listBookcases[bookcasenum].listShelves.Add(sh);					
					//print("button: " + buttonInfo.id);
					hmax = h + 5;
					shelfnum = nshelf;
				}
			} else {				
				if (h + 5 > hmax) {
					hmax = h + 5;
				}
			}
			var bk = new Book(id, title, h, w, linkPdf, linkCatalog, imgUrl);
			listBookcases[bookcasenum].listShelves[shelfnum].listBooks.Add(bk);
			
			line = sr.ReadLine();
		}
		sh = new Shelf(shelfnum, hmax);
		listBookcases[bookcasenum].listShelves.Add(sh);
		sr.Close();

	} catch(e) {
		print("The file could not be read: ");
		print(e.Message);
		return;
	}
	drawBookcases();
}

function drawBookcases() {
	for (var bc in listBookcases) {
		if (bc.listShelves.Count > 0) {

			var oy : float = 0.00;

			for (var sh in bc.listShelves) {
				var oz : float = 0.00;
				oy += sh.offsety;

				createShelf(bc.posx, oy, bc.posz, bc.rot, bc.larg, bc.depth);
				
				if (sh.listBooks.Count > 0) {
					if(bc.rot == 0){					
						createButtonInfo(bc.posx + (bc.depth/2), oy + 1.25, bc.posz - (bc.larg/2) + 5, bc.rot, bc.larg, bc.depth, sh.butt.id);	
								
					} else if(bc.rot == 180){
						createButtonInfo(bc.posx - (bc.depth/2), oy + 1.25, bc.posz + (bc.larg/2) - 5, bc.rot, bc.larg, bc.depth, sh.butt.id);			
					
					} else if(bc.rot == 90){
						createButtonInfo(bc.posx - (bc.larg/2) + 5, oy + 1.25, bc.posz - (bc.depth/2), bc.rot, bc.larg, bc.depth, sh.butt.id);			
					
					} else if(bc.rot == -90){
						createButtonInfo(bc.posx + (bc.larg/2) - 5, oy + 1.25, bc.posz + (bc.depth/2), bc.rot, bc.larg, bc.depth, sh.butt.id);			
					}	
				}

				for (var b in sh.listBooks) {
				
					if(bc.rot == 0){					
						createBook(bc.posx + (15 - (b.depth/2)), oy + 2.5, bc.posz - (bc.larg/2) + 1 + oz, bc.rot, b.hight, b.width, b.depth, b.id, b.limited);					
						oz += b.width + 0.1;
					
					} else if(bc.rot == 180){
						createBook(bc.posx - (15 - (b.depth/2)), oy + 2.5, bc.posz + (bc.larg/2) - 1 + oz, bc.rot, b.hight, b.width, b.depth, b.id, b.limited);					
						oz -= b.width + 0.1;
					
					} else if(bc.rot == 90){
						createBook(bc.posx - (bc.larg/2) + 1 + oz, oy + 2.5, bc.posz - (15 - (b.depth/2)), bc.rot, b.hight, b.width, b.depth, b.id, b.limited);					
						oz += b.width + 0.1;
					
					} else if(bc.rot == -90){
						createBook(bc.posx + (bc.larg/2) - 1 + oz, oy + 2.5, bc.posz + (15 - (b.depth/2)), bc.rot, b.hight, b.width, b.depth, b.id, b.limited);					
						oz -= b.width + 0.1;
					}					
				}	
			}			
			// hmax + 5 is the position of the last shelf, 5 is the thickness of the shelf
			createSupport(bc.posx, oy + 5 , bc.posz, bc.rot, bc.larg, bc.depth);
		
		} else {
			var offsety = 0.0;
			for (var i = 0; i < 9; i++) {
				createShelf(bc.posx, offsety, bc.posz, bc.rot, bc.larg, bc.depth);
				offsety += 30;
			}
			createSupport(bc.posx, offsety - 30 + 5, bc.posz, bc.rot, bc.larg, bc.depth);
		}
	}	
}

function createShelf (posx : float, posy : float, posz : float, rot : int, larg : float, depth : float) {

	var instance : Transform;
	var pos = Vector3(posx, posy, posz);
	
	transform.rotation = Quaternion.AngleAxis(rot, Vector3.up);	
	instance = Instantiate(shelf, pos, transform.rotation);
	instance.localScale = Vector3(depth, 1, larg);
	
	/*if(rot == 0){	
		pos = Vector3(posx + (depth/2), posy + 1.25, posz  - (larg/2) + 5);				
		instance = Instantiate(button, pos, transform.rotation);
				
	} else if(rot == 180){		
		pos = Vector3(posx - (depth/2), posy + 1.25, posz  + (larg/2) - 5);				
		instance = Instantiate(button, pos, transform.rotation);
		
	} else if(rot == 90){		
		pos = Vector3(posx - (larg/2) + 5, posy + 1.25, posz - (depth/2));				
		instance = Instantiate(button, pos, transform.rotation);
		
	} else if(rot == -90){		
		pos = Vector3(posx + (larg/2) - 5, posy + 1.25, posz + (depth/2));				
		instance = Instantiate(button, pos, transform.rotation);
	}	*/	
}

function createButtonInfo (posx : float, posy : float, posz : float, rot : int, larg : float, depth : float, id : String) {

	var instance : Transform;
	var pos = Vector3(posx, posy, posz);
	transform.rotation = Quaternion.AngleAxis(rot, Vector3.up);	
	instance = Instantiate(button, pos, transform.rotation);
	
	for (var child : Transform in instance) {	
		child.name = id;
		child.tag = "button";
	}
}

function createSupport (posx : float, posy : float, posz : float, rot : int, larg : float, depth : float) {

	var instance : Transform;
	var pos : Vector3;
	
	if (rot == 0 || rot == 180){
	
		pos = Vector3(posx, -5, posz - (larg/2));
		instance = Instantiate(support, pos, transform.rotation);
		instance.localScale = Vector3(depth, posy + 5, depth);
		
		pos = Vector3(posx, -5, posz + (larg/2));
		instance = Instantiate(support, pos, transform.rotation);
		instance.localScale = Vector3(depth, posy + 5, depth);
		
	}else if(rot == 90 || rot == -90){
	
		pos = Vector3(posx - (larg/2), -5, posz);
		instance = Instantiate(support, pos, transform.rotation);
		instance.localScale = Vector3(depth, posy + 5, depth);
		
		pos = Vector3(posx + (larg/2), -5, posz);
		instance = Instantiate(support, pos, transform.rotation);
		instance.localScale = Vector3(depth, posy + 5, depth);
	}
}

function createBook(posx : float, posy : float, posz : float, rot : int, h : float, w : float, d : float, id : String, limit : boolean){
	
	var instance : Transform;
	var pos = Vector3(posx, posy, posz);	
	
	transform.rotation = Quaternion.AngleAxis(rot, Vector3.up);
	
	instance = Instantiate(book, pos, transform.rotation);
	instance.localScale = Vector3(d, h, w);
	
	for (var child : Transform in instance) {
	
		child.name = id;
		child.tag = "book";
		if (limit) {
			child.renderer.material.mainTexture = Resources.Load("Texture/texture_book_limit", Texture2D);
		}
	}
}

// Here because they're only used for the update
var canvasHelp : Canvas;
var canvasInfoBook : Canvas;
var canvasFrontespices : Canvas;
var title : Text;
var frontispiece : Image;
var pdf_button : Button;
var scroll : Scrollbar;
var imgButton : Button;
var scrollFront : Scrollbar;
var bookShelf : int;
var bookBookcase : int;

function Update () {

	if (canvasHelp.enabled) {
		return;  /* nothing to do if we're seeing the help screen */
	}
	
	if (Input.GetMouseButton(0)) {
		var hitInfo : RaycastHit = new RaycastHit();
		var hit = Physics.Raycast(Camera.mainCamera.ScreenPointToRay(Input.mousePosition), hitInfo);
			
		if (hit) {
			//Debug.Log("Hit " + hitInfo.transform.gameObject.name);			
			//Debug.Log("Hit " + hitInfo.transform.GetInstanceID);
			var name : String = hitInfo.transform.gameObject.name;
			if (hitInfo.collider.tag == "book" && !canvasInfoBook.enabled && !canvasFrontespices.enabled) {	
			var bcCount = 0;					
				for (var bc in listBookcases) {
					for (var sh in bc.listShelves) {
						for (var b in sh.listBooks) {
							if (b.id == name) {
								//print("Titolo del libro:" + b.title);
								//print("Id del libro:" + b.id + " ; Name: " + name);
								urlPdf = b.linkPdf;							
								urlCatalog = b.linkCatalog;
								desc = b.title;
								urlImg = b.imgUrl;
								bookShelf = sh.nshelf;
								bookBookcase = bcCount;
								pauseInfo();
							}							
						}
					}
					bcCount ++;
				}
				//Debug.Log("It's working");
			}
			if (hitInfo.collider.tag == "button" && !canvasInfoBook.enabled && !canvasFrontespices.enabled) {
				print("button info book selected: " + name);
				frontespicesOverlay(name);
			} 
			
		} else {
			//Debug.Log("No hit");
		}
	}	
}

function pauseInfo () {
	Time.timeScale = 0;
	GameObject.Find("Main Camera").GetComponent(MouseLook).enabled = false;
	GameObject.Find("First Person Controller").GetComponent(MouseLook).enabled = false;
	canvasInfoBook.enabled = true;
	
	scroll = canvasInfoBook.transform.FindChild("scroll_description").GetComponent.<Scrollbar>();
	scroll.value = 1.0;
	
	title = canvasInfoBook.transform.FindChild("panel_infoBook/text_infoBook").GetComponent.<Text>();	
	var titleReplace = desc.Replace("#","\n");
	title.text = "\n" + titleReplace;
	
	if (urlPdf.Equals("")) {
		canvasInfoBook.transform.FindChild("pdf").GetComponent.<Button>().interactable = false;
	}
	
	var www = new WWW(url_biblio + "" + urlImg);
	yield www;
	
	var spriteT : Sprite = new Sprite();
	var tex : Texture2D = new Texture2D(2,2, TextureFormat.RGB24, false);
	spriteT = Sprite.Create(www.texture, new Rect(0, 0, 744, 1052),new Vector2(0, 0),100.0f);
	frontispiece = 	canvasInfoBook.transform.FindChild("frontispiece").GetComponent.<Image>();	
	frontispiece.sprite = spriteT;		
}

public var frontButton : GameObject;	
//public var itemList = new List.<ItemButton>();	
public var contentPanel : Transform;

function frontespicesOverlay(name : String) {
	Time.timeScale = 0;
	GameObject.Find("Main Camera").GetComponent(MouseLook).enabled = false;
	GameObject.Find("First Person Controller").GetComponent(MouseLook).enabled = false;
	var childs : int = contentPanel.transform.childCount; 
					for (var i = childs - 1; i >= 0; i--) {
						Destroy(contentPanel.transform.GetChild(i).gameObject);
					}	
	
	canvasFrontespices.enabled = true;

	var nBoookc : int;
	var nSh : int;
	var info : String[];
	info = name.Split("|"[0]);
	nBoookc = int.Parse(info[0]);
	nSh = int.Parse(info[1]);	
	
	for (var book in listBookcases[nBoookc].listShelves[nSh].listBooks) {
		//var itemB = new ItemButton();
		var newButton : GameObject = Instantiate(frontButton) as GameObject;
		var button_sample : SampleButton = newButton.GetComponent.<SampleButton>();
		button_sample.name = book.id;
		//itemB.nameButton = button_sample.name;

		var www = new WWW("http://biblio.polito.it/sala_antichi/" + book.imgUrl);
		yield www;

		var spriteT : Sprite = new Sprite();
		var tex : Texture2D = new Texture2D(2,2, TextureFormat.RGB24, false);
		spriteT = Sprite.Create(www.texture, new Rect(0, 0, 744, 1052),new Vector2(0, 0),100.0f);				

		button_sample.icon.sprite = spriteT;			
		AddListener(button_sample, button_sample.name);	
		
		newButton.transform.SetParent (contentPanel);
		//itemList.Add(itemB);
	}
}

function AddListener (b : SampleButton, s : String) {
	b.button.onClick.AddListener(function() {infoBook(s);});
}


function resumeGame() {
	resumeShelf();
	resumeGameFront();
}

function resumeShelf() {
	Time.timeScale = 1;
	GameObject.Find("Main Camera").GetComponent(MouseLook).enabled = true;
	GameObject.Find("First Person Controller").GetComponent(MouseLook).enabled = true;
	canvasInfoBook.enabled = false;	
	frontispiece = 	canvasInfoBook.transform.FindChild("frontispiece").GetComponent.<Image>();	
	frontispiece.sprite = null;
	canvasFrontespices.enabled = true;
	
	frontespicesOverlay(bookBookcase + "|" + bookShelf);
		
}

function openPdf() {
		Application.ExternalEval("window.open('" + urlPdf + "','_blank')");		
}

function openCatalog() {
	Application.ExternalEval("window.open('" + urlCatalog + "','_blank')");	
}

function infoBook (s : String) {
	print(s);
	for (var bc in listBookcases) {
		for (var sh in bc.listShelves) {
			for (var b in sh.listBooks) {
				if (b.id == s) {
					//print("Titolo del libro:" + b.title);
					//print("Id del libro:" + b.id + " ; Name: " + name);
					urlPdf = b.linkPdf;							
					urlCatalog = b.linkCatalog;
					desc = b.title;
					urlImg = b.imgUrl;
					canvasFrontespices.enabled = false;	
					
					pauseInfo();
				}							
			}
		}
	}	
}

function resumeGameFront() {
	Time.timeScale = 1;
	GameObject.Find("Main Camera").GetComponent(MouseLook).enabled = true;
	GameObject.Find("First Person Controller").GetComponent(MouseLook).enabled = true;
	canvasFrontespices.enabled = false;		
	
	var childs : int = contentPanel.transform.childCount; 
	for (var i = childs - 1; i >= 0; i--) {
		Destroy(contentPanel.transform.GetChild(i).gameObject);
	}	
}