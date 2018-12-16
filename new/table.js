var table = {
	jsonData : null,
	
	getJSON : function(url) {
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'json';
	xhr.open('GET', url, false);
	xhr.send();
	if (xhr.status === 200) 
		jsonData = JSON.parse(request.responseText);
	else Alert("Не удается загрузить данные\nОшибка:"+xhr.status+"\n.\n");
	}
	
	addButtonForJSONParent : function(parentElem, callback(jsonParentName)) {
		if (!jsonData) return;
		var button = document.createElement("button");
		button.onclick = callback(jsonParentName);
		button.innerHTML = jsonParentName;
		parentElem.appendChild(button);
	}
};