// I need this function to survive...
if (!String.prototype.format) {
	String.prototype.format = function() {
		var args = arguments;
		return this.replace(/{(\d+)}/g, function(match, number) { 
			return typeof args[number] != 'undefined'
				? args[number] : match;
		});
	};
}

function Interp(from, to, value) {
	let type = from.constructor.name;
	if (type != to.constructor.name)
		throw "Can't interpolate between 2 different types";

	let output = new window[type]();

	let keys = Object.entries(from).map(e => typeof(e[1]) == "number" && e);
	keys.forEach((entry) => {
		if (!entry)
			return;
		let key = entry[0];
		let distance = Math.abs(from[key] - to[key]);
		output[key] = Math.min(from[key], to[key]) + (value * distance);
	});

	return output;
}

// And some objects I oftne use...
function vec3(x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

	// Can't make my own operators in javascript ;-;
	this.add = function(_vec3) {
		this.x += _vec3.x;
		this.y += _vec3.y;
		this.z += _vec3.z;
		return this;
	}

	this.subtract = function(_vec3) {
		this.x -= _vec3.x;
		this.y -= _vec3.y;
		this.z -= _vec3.z;
		return this;
	}

	this.multiply = function(_vec3) {
		this.x *= _vec3.x;
		this.y *= _vec3.y;
		this.z *= _vec3.z;
		return this;
	}

	this.divide = function(_vec3) {
		this.x /= _vec3.x;
		this.y /= _vec3.y;
		this.z /= _vec3.z;
		return this;
	}

	this.floor = function(){
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
		return this;
	}
}

// Alternative object creation
function strVec3(string) { // arg example: "255,140,24"
	let args = string.split(",");
	if (args.length < 3)
		throw "Not enough numbers!";
	
	let x = parseFloat(args[0]);
	let y = parseFloat(args[1]);
	let z = parseFloat(args[2]);

	return new vec3(x, y, z);
}

$(document).ready(onLoad);

function onLoad(){
	runSnpy();
}

function runSnpy(){
	var doms = document.querySelectorAll("[data-snpy]");

	doms.forEach((dom) => {
		handleSnpy(dom);
	});

	console.log("Snpy runner has finished!");
}

function handleSnpy(dom){
	let func = dom.dataset.snpy;

	window["snpy_" + func](dom); //haha... nice meme...
}


// -------------------------------------------------------------------------------
// Snpy handlers

function snpy_trianglegen(dom) {
	let args = dom.dataset.snpyargs.split("|");
	let countRange = args[0].split("-");
	let colorRange = args[1].split("-");
	
	let min = parseInt(countRange[0]);
	let max = parseInt(countRange[1]) || min;

	let minColor = strVec3(colorRange[0]);
	let maxColor = strVec3(colorRange[1]);

	let count = Math.floor(Math.random() * (max - min)) + min;
	
	for (let i = 0; i < count; i++){
		let element = document.createElement("div");
		element.className = "snpy-triangle snpy-float";

		element.style.top = Math.random() * 100 + "%";
		element.style.left = (Math.random() * 1.2 - 0.1) * 100 + "%";

		let size = Math.random() * window.innerHeight * 0.3 + 4;
		element.style.borderWidth = "0 {0} {1} {2}".format(size / 2, size, size / 2);

		let color = Interp(minColor, maxColor, Math.random()).floor();
		element.style.borderBottomColor = "rgb({0},{1},{2})".format(color.x, color.y, color.z);

		let animationDelay = Math.random() * 6;
		element.style.animationDelay = -animationDelay + "s";

		dom.appendChild(element); // Add element to current dom
	}
}