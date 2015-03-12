#pragma strict

import UnityEngine.UI;
import UnityEngine;
import System.Collections;
import System.Collections.Generic;

class ScrollableListOriz extends MonoBehaviour {
	var itemPrefab : GameObject;
	var itemCount : int = 10;	
	var canvasFront : Canvas;
	
	function Start () {
	
		var columnCount : int = itemCount;
		var width : int = 250;
		var heigth : int = 350;
		
		var rowRectTransform : RectTransform = itemPrefab.GetComponent.<RectTransform>();
		var containerRectTransform = gameObject.GetComponent.<RectTransform>();
		
		var scrollWidth : float = width * itemCount;
		containerRectTransform.offsetMin = new Vector2(- scrollWidth / 2, containerRectTransform.offsetMin.y);
		containerRectTransform.offsetMax = new Vector2(scrollWidth / 2, containerRectTransform.offsetMax.y);
		
		var frontispiece : Image;
		
		for (var i = 0; i < itemCount; i++) {
			//this is used instead of a double for loop because itemCount may not fit perfectly into the rows/columns

            //create a new item, name it, and set the parent
            var newItem : GameObject = Instantiate(itemPrefab);
            newItem.name = gameObject.name + " item at (" + i + ")";
            
            var www = new WWW("http://biblio.polito.it/sala_antichi/frontespizi/050_326.jpg");
			yield www;
	
			var spriteT : Sprite = new Sprite();
			var tex : Texture2D = new Texture2D(2,2, TextureFormat.RGB24, false);
			spriteT = Sprite.Create(www.texture, new Rect(0, 0, 744, 1052),new Vector2(0, 0),100.0f);
			
			frontispiece = 	newItem.transform.FindChild("button_frontespice").GetComponent.<Image>();	
			frontispiece.sprite = spriteT;	
			
			newItem.transform.parent = gameObject.transform;

            //move and size the new item
            var rectTransform : RectTransform = newItem.GetComponent.<RectTransform>();

			var x : float = (- containerRectTransform.rect.width / 2 + width * (i % columnCount));
            var y : float = containerRectTransform.rect.height / 2 - heigth;
            rectTransform.offsetMin = new Vector2(x, y);

			x = rectTransform.offsetMin.x + width;
            y = rectTransform.offsetMin.y + heigth;
            rectTransform.offsetMax = new Vector2(x, y);
		}
	}	
}