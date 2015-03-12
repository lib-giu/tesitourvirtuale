#pragma strict

import UnityEngine;
import UnityEngine.UI;
import UnityEngine.EventSystems;
import System.Collections;
import System.Collections.Generic;

//[System.SerializableAttribute];

public class Item {
	public var frontespice : Sprite;
	public var thinkToDo : Button.ButtonClickedEvent;
}

public class CreateScrollList extends MonoBehaviour {

	public var frontButton : GameObject;
	public var itemList = new List.<Item>();	
	public var contentPanel : Transform;
	
	function Start () {
		PopulateList();
	}
	
	function PopulateList () {
		for (var item in itemList) {
			var newButton : GameObject = Instantiate(frontButton) as GameObject;
			var button : SampleButton = newButton.GetComponent.<SampleButton>();
			
			var www = new WWW("http://biblio.polito.it/sala_antichi/frontespizi/004_602.jpg");
			yield www;
	
			var spriteT : Sprite = new Sprite();
			var tex : Texture2D = new Texture2D(2,2, TextureFormat.RGB24, false);
			spriteT = Sprite.Create(www.texture, new Rect(0, 0, 744, 1052),new Vector2(0, 0),100.0f);				
			
			button.icon.sprite = spriteT;
			button.button.onClick = item.thinkToDo;
			newButton.transform.SetParent (contentPanel);
		}
	}
	
	function SomethingToDo (item : GameObject) {
		Debug.Log (item.name);
	}
}