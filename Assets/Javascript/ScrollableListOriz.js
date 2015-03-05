#pragma strict

import UnityEngine.UI;
import UnityEngine;
import System.Collections;
import System.Collections.Generic;

class ScrollableListOriz extends MonoBehaviour {
	var itemPrefab : GameObject;
	var itemCount : int = 10;
	var columnCount : int = 1;
	
	function Start () {
		var width : int = 292;
		var heigth : int = 395;
		
		var rowRectTransform : RectTransform = itemPrefab.GetComponent.<RectTransform>();
		var containerRectTransform = gameObject.GetComponent.<RectTransform>();
		
		var scrollWidth : float = width * itemCount;
		containerRectTransform.offsetMin = new Vector2(- scrollWidth / 2, containerRectTransform.offsetMin.y);
		containerRectTransform.offsetMax = new Vector2(scrollWidth / 2, containerRectTransform.offsetMax.y);
		
		var j = 0;
		
		for (var i = 0; i < itemCount; i++) {
			//this is used instead of a double for loop because itemCount may not fit perfectly into the rows/columns
            if (i % columnCount == 0)
                j++;

            //create a new item, name it, and set the parent
            var newItem : GameObject = Instantiate(itemPrefab);
            newItem.name = gameObject.name + " item at (" + i + "," + j + ")";
            newItem.transform.parent = gameObject.transform;

            //move and size the new item
            var rectTransform : RectTransform = newItem.GetComponent.<RectTransform>();

			var x : float = (- containerRectTransform.rect.width / 2 + width * (i % columnCount));
            var y : float = containerRectTransform.rect.height / 2 - heigth * j;
            rectTransform.offsetMin = new Vector2(x, y);

			x = rectTransform.offsetMin.x + width;
            y = rectTransform.offsetMin.y + heigth;
            rectTransform.offsetMax = new Vector2(x, y);
		}		
	}	
}