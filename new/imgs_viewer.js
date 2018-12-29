function viewImg(e) {
	var el=e.target;
	if (el.tagName == "IMG") {
	var popup = document.createElement("div");
	popup.className = "imgs_popup";
	popup.innerHTML = "<div></div><img src=\""+el.src.split("t_").join('')+"\"/>";
	document.body.appendChild(popup);
	popup.style.opacity = "1.0";
	popup.firstChild.onclick = function() {
			popup.addEventListener("transitionend", function() {document.body.removeChild(popup);}, false);
			popup.style.opacity = '0';
		}
	}
}

function getList() {
	const num_files = 17;
	var container = document.getElementById("imgs_viewer"), item;
	for (let i=0; i<=num_files; i++) {
		item = document.createElement("img");
		item.src = "gallery/t_" + i + ".jpg";
		container.appendChild(item);
	}
}

window.onload = function () {
	getList();
	document.getElementById('imgs_viewer').onclick=viewImg;
}