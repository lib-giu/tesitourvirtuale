#pragma strict

import System.IO;
import System.Collections.Generic;

var listCubes = new List.<NewCube>();
var cub : Transform;

function Start () {

	var line : String;
	var sr = new StreamReader("new_cube_info.txt");
	
	try{
	
		var info : String[];
	
		var id : String;
		var name : String;
		var side : int;
		var x :float;
		var z : float;
		
		//lettura file
		line = sr.ReadLine();
		
		while(line != null){
			info = line.Split(";"[0]);
			
			id = info[0];
			name = info[1];
			side = int.Parse(info[2]);
			x = float.Parse(info[3]);
			z = float.Parse(info[4]);
			
			var c = new NewCube(id, name, side, x, z);
			listCubes.Add(c);

			line = sr.ReadLine();
		}	
	
	}catch(e){
	
		//let the user know what went wrong
		print("The file could not be read: ");
		print(e.Message);
	}	// chiusura del try/catch
	
	drawCube();

}

function Update () {

if(Input.GetMouseButton(0)){	//se viene schiacciato il tasto sx del mouse vogli sapere se ho cliccato su un cubo e se si quale
		//Debug.Log("Pressed left click.");
		
		var mouseScreenPosition = Input.mousePosition;
		print(mouseScreenPosition);
		
		var mouseWorldSpace : Vector3 = Camera.mainCamera.ScreenToWorldPoint(mouseScreenPosition);
		
		print(mouseWorldSpace);
		
		
		
		var hitInfo : RaycastHit = new RaycastHit();
		
		var hit = Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), hitInfo);
		
		if (hit){
		
			Debug.Log("Hit " + hitInfo.transform.gameObject.name);
			
			if (hitInfo.transform.gameObject.tag == "selectable")	{
			
				var name : String = hitInfo.transform.gameObject.name;
				
				for(var cx in listCubes){
				
					if(name == cx.name){
						print("Id: "+cx.id);
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

function drawCube(){
	
	for(var cb in listCubes){	
		var cube : GameObject = GameObject.CreatePrimitive(PrimitiveType.Cube);
	
		cube.name = cb.name;
		cube.tag = "selectable";
	
		cube.transform.localScale = Vector3(cb.side, cb.side, cb.side);
		cube.transform.position = Vector3(cb.x, cb.side/2, cb.z);		
	}
}

