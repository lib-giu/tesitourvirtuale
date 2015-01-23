#pragma strict

function Start () {

}

function Update () {

}

function onClickExit(){
	
	Application.Quit();
}

function onClickPlay(){

	Application.LoadLevel("enviroment");
}

function onClickHistory(){

	Application.LoadLevel("history");
}

function onClickHelp(){

	Application.LoadLevel("help");
}

function onClickBack(){

	Application.LoadLevel("main_menu");
}

function openWebsite(){

	Application.OpenURL("https://www.google.it");
}

