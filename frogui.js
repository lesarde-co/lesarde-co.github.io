/***************************************************************************************************
	frogui.js

	Copyright © 2018 Lesarde Inc. All rights reserved.
***************************************************************************************************/


/***************************************************************************************************

	 Global space -- ? Best to access with "window." ?

***************************************************************************************************/

/***********************************************************
	RelayEventArgs class
***********************************************************/

class RelayEventArgs {

	// Arg names match DOM event class (including timeStamp camel-case :) (https://www.w3schools.com/jsref/dom_obj_event.asp) but are be altered within
	constructor(timeStamp) {
		//this.Name = type;
		this.Timestamp = timeStamp;
	}
}

/***********************************************************
	PointerRelayEventArgs class
***********************************************************/

class PointerRelayEventArgs {

	// Arg names match DOM event class (including timeStamp camel-case :) (https://www.w3schools.com/jsref/dom_obj_event.asp) but are be altered within
	//constructor(type, altKey, ctrlKey, metaKey, shiftKey, button, timeStamp) {
	constructor(altKey, ctrlKey, metaKey, shiftKey, button, timeStamp) {
		//this.Name = type;
		this.AltKey = altKey;
		this.CtrlKey = ctrlKey;
		this.MetaKey = metaKey;
		this.ShiftKey = shiftKey;
		this.Button = button;
		this.Timestamp = timeStamp;
	}
}

/***********************************************************
	KeyboardRelayEventArgs class
***********************************************************/

class KeyboardRelayEventArgs {

	// Arg names match DOM event class (including timeStamp camel-case :) (https://www.w3schools.com/jsref/dom_obj_event.asp) but are be altered within
	//constructor(type, altKey, ctrlKey, metaKey, shiftKey, button, timeStamp) {
	constructor(key, which, origCode, altKey, ctrlKey, metaKey, shiftKey, timeStamp) {
		this.Key = key;
		this.Which = which;
		this.OrigCode = origCode,
		this.AltKey = altKey;
		this.CtrlKey = ctrlKey;
		this.MetaKey = metaKey;
		this.ShiftKey = shiftKey;
		this.Timestamp = timeStamp;
	}
}

/***********************************************************
	TextChangeRelayEventArgs class
***********************************************************/

class TextChangeRelayEventArgs {

	constructor(textBase64, timeStamp) {
		this.TextBase64 = textBase64;
		this.Timestamp = timeStamp;
	}
}

/*******************************************************************************
	processKeyDown()
*******************************************************************************/

///* public */ function processKeyDown(e_textarea, event) {

//	var key = event.keyCode;

//	if (KeyCode.shift === key || KeyCode.ctrl === key || KeyCode.alt === key)
//		return null;

//	event.preventDefault();
//	e_textarea.readOnly = true;
//	e_textarea.blur();

//	var args = new ConsoleReadKeyWormholeArgs(event.key, event.code, event.altKey, event.ctrlKey, event.metaKey, event.shiftKey);

//	return args;
//}

/*******************************************************************************
	sleep()
*******************************************************************************/

/* public */ function sleep(ms) {

	var p = new Promise((resolve) => {
		setTimeout(resolve, ms);
	});

	return p;
}

/*******************************************************************************
	doDomContentLoaded()
*******************************************************************************/

/* public */ function doDomContentLoaded(mainAsmName, mainNamespace, mainClassName, mainMethodName, assemblies) {
	// nothing yet
}

/*******************************************************************************
	prepareDomForUse()
*******************************************************************************/

/* public */ function prepareDomForUse() {

	// Find the e_loading element and hide it
	var e_loading = document.getElementById("e_loading");
	e_loading.hidden = true;
}

/*******************************************************************************
	b64toBlob()

	Convert a base-64 encoded string to a blob.

	https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
*******************************************************************************/

/* public */ function b64toBlob(b64Data, contentType, sliceSize) {
	contentType = contentType || '';
	sliceSize = sliceSize || 512;

	var byteCharacters = atob(b64Data);
	var byteArrays = [];

	for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	var blob = new Blob(byteArrays, { type: contentType });
	return blob;
}

/*******************************************************************************
	removeAllChildren()

	https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript

*******************************************************************************/

function removeAllChildren(parent) {

	// Remove all the children from the body
	while (parent.hasChildNodes()) {
		parent.removeChild(parent.lastChild);
	}

}

/*******************************************************************************
	uploadBlobFileAsync()

	Uploads the blob file specified by uri and async returns a base64 string result.
	https://www.w3schools.com/xml/xml_http.asp
	https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
*******************************************************************************/

function uploadBlobFileAsync(requestUri, predicate) {

	//console.log("uploadBlobFile");

	//	if (requestUri.charAt(0) != '/')
	//	requestUri = '/' + requestUri;

	var oReq = new XMLHttpRequest();
	oReq.open("GET", requestUri, true);
	oReq.responseType = "blob";

	oReq.onload = function (oEvent) {

		var blob = oReq.response;

		predicate(blob);
	};

	oReq.send();
}

/*******************************************************************************
	uploadBase64Async()

	Uploads the file or blob specified by the uri and async returns the base64
	string via the callback.

	https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
*******************************************************************************/

function uploadBase64Async(requestUri, predicate) {

	uploadBlobFileAsync(requestUri, function (blob) {

		var reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = function () {
			var base64 = reader.result;
			predicate(base64);
		};

	});
}

/*******************************************************************************
	connectListeners()
*******************************************************************************/

	function processKeyEvent(id, event) {

		//var key = event.keyCode;
		var key = event.key;
		var which = event.which;
		var origCode = event.originalEvent.code;

		if (KeyCode.shift === which || KeyCode.ctrl === which || KeyCode.alt === which)
			return true;

		//event.preventDefault();
		//e_textarea.readOnly = true;
		//e_textarea.blur();

		//var args = new KeyboardRelayEventArgs(event.key, event.code, event.altKey, event.ctrlKey, event.metaKey, event.shiftKey);
		//var args = new KeyboardRelayEventArgs(keyCode, keyName, event.altKey, event.ctrlKey, event.metaKey, event.shiftKey, event.timeStamp);
		//var args = new KeyboardRelayEventArgs(keyCode, event.altKey, event.ctrlKey, event.metaKey, event.shiftKey, event.timeStamp);
		var args = new KeyboardRelayEventArgs(key, which, origCode, event.altKey, event.ctrlKey, event.metaKey, event.shiftKey, event.timeStamp);

		Wormhole.relayEvent(id, event.type, JSON.stringify(args));

		return true;
	}

function connectListeners(id, object) {

	$(object).on("mousedown", function (event) {

		var args = new PointerRelayEventArgs(event.altKey, event.ctrlKey, event.metaKey, event.shiftKey, event.button, event.timeStamp);

		Wormhole.relayEvent(id, event.type, JSON.stringify(args));
		});

	$(object).on("keydown", function (event) {

		return processKeyEvent(id, event);
	});

	$(object).on("keyup", function (event) {

		return processKeyEvent(id, event);
	});

	//object.onmousedown = function (event) {
	//	var args = new PointerRelayEventArgs(event.altKey, event.ctrlKey, event.metaKey, event.shiftKey, event.button, event.timeStamp);

	//	Wormhole.relayEvent(id, event.type, JSON.stringify(args));

	//	return true; // TODO:2018.7.31 Was eating <input> mouse down. Ultimately, this needs to be dynamically handled with C# interop
	//};

	//object.onkeydown = function (event) {

	//	return processKeyEvent(id, event);
	//};

	//object.onkeyup = function (event) {

	//	return processKeyEvent(id, event);
	//};

}


/*******************************************************************************
	updateStyleRule()
*******************************************************************************/
/*
	function x(selector, style, rules, cur) {

		//if (cur < rules.length && rules[cur].selectorText == selector) {
		//	alert('hello' + ruleNo.ToString());
		//	return true;
		//}

		return false;
	}

	updateStyleRule", function (selector, style) {

		alert(css_jetson.rules);
		alert(css_jetson.cssRules);

		var rules = css_jetson.rules || css_jetson.cssRules;

		if (rules.length == 0)
			return;

		var tot = rules.length;

		if (x(selector, style, rules, 0)) { }
		else if (x(selector, style, rules, 1)) { }
		else
			alert("tot rules: " + tot);
	});
*/

/*******************************************************************************
	GetStyleIndex()
*******************************************************************************/

/*
function GetStyleIndex(CLASSname) {
	var styleSheets = document.styleSheets;
	var styleSheetsLength = styleSheets.length;
	for (var i = 0; i < styleSheetsLength; i++) {
		if (styleSheets[i].rules) {
			var classes = styleSheets[i].rules;
		}
		else {
			try {
				if (!styleSheets[i].cssRules) { continue; }
			}
			//Note that SecurityError exception is specific to Firefox.
			catch (e) {
				if (e.name == 'SecurityError') {
					console.log("SecurityError. Cant read: " + styleSheets[i].href);
					continue;
				}
			}
			var classes = styleSheets[i].cssRules;
		}
		for (var x = 0; x < classes.length; x++)
			if (classes[x].selectorText == CLASSname)
				return x;

		return -1;
	}
}
*/

/*******************************************************************************
	global method()
*******************************************************************************/

var
	element = document.createElement('style'),
	css_jetson;

element.title = "css_jetson";

// Append style element to head
document.head.appendChild(element);

// Reference to the stylesheet
css_jetson = element.sheet;

// Connect event listeners to the document
connectListeners("x_document", document);

/***************************************************************************************************

	 Element "class"

***************************************************************************************************/

/*******************************************************************************
	element_addClassItem()

	TODO: Not compat with IE9
	https://www.w3schools.com/howto/howto_js_add_class.asp
*******************************************************************************/

function element_addClassItem(element, className) {

	//console.log("element_addClassItem(" + element + ", " + className + ")");

	element.classList.add(className);
}

/*******************************************************************************
	element_removeClassItem()

	TODO: Not compat with IE9
	https://www.w3schools.com/howto/howto_js_remove_class.asp
*******************************************************************************/

function element_removeClassItem(element, className) {

	element.classList.remove(className);
}

/***************************************************************************************************

	 ImageSourceManager "class"

***************************************************************************************************/

/*******************************************************************************
	constants
*******************************************************************************/

const SvgNamespace = "http://www.w3.org/2000/svg";
const ShapeCssStyle = "overflow:visible; box-sizing:border-box;";

/*******************************************************************************
	Image Source variables
*******************************************************************************/

// Id's (e.g. f_0 -- remember, ImageSource is a freezable) used as keys for imageSourceUrls
var imageSource_ids = [];

// Image source urls contains image blobs
var imageSource_urls = [];

/*******************************************************************************
	findImageSourceIndex()
*******************************************************************************/

function findImageSourceIndex(id) {

	for (var i = 0; i < imageSource_ids.length; ++i)
		if (imageSource_ids[i] == id)
			return i;

	return -1;
}

/*******************************************************************************
	imageSourceManager_addImageAsync()

	Adds a frogui ImageSource to image manager for use by elements.

	Upon completion, several external things happen:

	- A new item is added to the imageSource collection.
	- The specified predicate is called with details about the image.
	- The global SVG node has a pattern added that references the image:

		<svg id="e_svg" ... >
			<defs id="e_svgDefs" ... >

				<pattern id="is_0_pattern" ... >     |
					<image> ... >                    |----  new section
					</image>                         |
				</pattern>                           |

			</defs>
		</svg>

	See Also: imageSourceManager_removeImage
*******************************************************************************/

	/* public */ function imageSourceManager_addImage(id, blob, predicate) {

		// Create a url using the blob as source
		var url = URL.createObjectURL(blob);

		// Create a string of the blob file url
		var blobFileUrl = url.toString();

		// Add the image source to the collection
		imageSource_ids.push(id);
		imageSource_urls.push(url);

		// Pass back useful details about the imge to the specified predicate. Unfortunately,
		// in order to figure out the dimensions of the image it has to be temporarily loaded
		// into an Image object.
		var tempImg = new Image();
		tempImg.onload = function () {

			predicate(blobFileUrl, tempImg.width, tempImg.height);

		};
		tempImg.src = url;

		// Find all (img) elements that depend on this image source and set <img>.src attribute to the url.
		// KEY:ImgSrcAndCss
		//var elements = document.getElementsByClassName(Id);
		//[].forEach.call(elements, function (e) {
		//	e.src = url;
		//});

		// Add for use by SVG elements. Results in:
		// <svg ~~~>
		//    <defs ~~~>
		//
		//       <pattern ~~~>    |
		//          <image> ~~~>  |----  new section
		//          </image>      |
		//       </pattern>       |
		//
		//

		// Create an svg <pattern> element
		var e_pattern = document.createElementNS(SvgNamespace, "pattern");
		e_pattern.id = id + "_pattern";
		e_pattern.setAttribute("width", "100%");
		e_pattern.setAttribute("height", "100%");
		e_pattern.setAttribute("patternContentUnits", "objectBoundingBox");

		// Create an svg <image> element and associate it's href with the url created above
		var e_image = document.createElementNS(SvgNamespace, "image");
		e_image.setAttribute("width", "1");
		e_image.setAttribute("height", "1");
		e_image.setAttribute("preserveAspectRatio", "none");
		e_image.setAttribute("href", blobFileUrl);

		// Append <image> child to <pattern>
		e_pattern.appendChild(e_image);

		// Append the <pattern> child to the the <defs> element
		var e_svgDefs = document.getElementById("e_svgDefs");
		e_svgDefs.appendChild(e_pattern);
	}

/* public */ function imageSourceManager_addImageAsync(Id, requestUri, predicate) {

	// Async upload the blob file from the specified uri
	uploadBlobFileAsync(requestUri, function (blob) {

		// Add the blob image
		imageSourceManager_addImage(Id, blob, predicate);

	});
}

/*******************************************************************************
	imageSourceManager_removeImage()

	Removes a frogui ImageSource from image manager.

	Upon completion, several external things happen:

	- The specified item is removed from the imageSource collection.
	- The global SVG node removes the associated pattern.

	See Also: imageSourceManager_addImage
*******************************************************************************/

function imageSourceManager_removeImage(id) {

	// Remove the image source from the collection.
	var i = findImageSourceIndex(id);
	delete imageSource_ids[i];
	delete imageSource_urls[i];

	// Remove the <pattern> child from the <defs> element
	var e_svgDefs = document.getElementById("e_svgDefs");
	var e_pattern = document.getElementById(id + "_pattern");
	e_svgDefs.removeChild(e_pattern);
}


/***************************************************************************************************

	 StyleSheet "class"

***************************************************************************************************/

/*******************************************************************************
	styleSheet_getRuleIndex()

	Globally searches stylesheets to find the rule identified by the specified selector.

	Returns the zero-based index or -1 if not found.

	https://stackoverflow.com/questions/324486/how-do-you-read-css-rule-values-with-javascript
*******************************************************************************/

/* public */ function styleSheet_getRuleIndex(selector) {

	var styleSheets = document.styleSheets;
	var styleSheetsLength = styleSheets.length;

	for (var i = 0; i < styleSheetsLength; i++) {

		if (styleSheets[i].rules)
			var classes = styleSheets[i].rules;
		else {

			try {
				if (!styleSheets[i].cssRules)
					continue;
			}
			// Note that SecurityError exception is specific to Firefox.
			catch (e) {
				if (e.name == 'SecurityError') {
					console.log("SecurityError. Cant read: " + styleSheets[i].href);
					continue;
				}
			}

			var classes = styleSheets[i].cssRules;
		}

		for (var x = 0; x < classes.length; x++)
			if (classes[x].selectorText == selector)
				return x;

		return -1;
	}
}

/***************************************************************************************************

	 Jetson "class"

***************************************************************************************************/

/*******************************************************************************
	jetson_getRuleIndex()

	Adds a rule to the jetson style sheet.

	Parameters:

		selector	A selector name with optional prefix ("#" id, "." class)
		properties	Property pairs string, e.g. "color:red;text-align:center;"
*******************************************************************************/

/* public */ function jetson_getRuleIndex(selector) {
	
	if (css_jetson.rules)
		var rules = css_jetson.rules;

	else {

		try {
			if (!css_jetson.cssRules)
				return -1;
		}
		// Note that SecurityError exception is specific to Firefox.
		catch (e) {
			if (e.name == 'SecurityError') {
				console.log("SecurityError. Cant read: " + css_jetson.href);
				return -1;
			}
		}

		var rules = css_jetson.cssRules;
	}

	for (var x = 0; x < rules.length; x++)
		if (rules[x].selectorText == selector)
			return x;

	return -1;
}

/*******************************************************************************
	jetson_addRule()

	Adds a rule to the jetson style sheet.

	Parameters:

		selector	A selector name with optional prefix ("#" id, "." class)
		properties	Property pairs string, e.g. "color:red;text-align:center;"
*******************************************************************************/

/* public */ function jetson_addRule(selector, properties) {

	var rule = selector + " {\n" + properties + "}";

	//console.log(rule);

	css_jetson.insertRule(rule, css_jetson.cssRules.length);
}

/*******************************************************************************
	jetson_removeRuleBySelector()

	Removes a rule from the jetson style sheet.

	Parameters:

		selector	A selector name with optional prefix ("#" id, "." class)
*******************************************************************************/

/* public */ function jetson_removeRuleBySelector(selector) {

	var index = jetson_getRuleIndex(selector);

	css_jetson.deleteRule(index);
}


/***************************************************************************************************

	 Console "class"

***************************************************************************************************/

/***********************************************************
	constants
***********************************************************/

// Common keyboard key codes
var KeyCode = Object.freeze({ "enter": 13, "shift": 16, "ctrl": 17, "alt": 18 });

/*******************************************************************************
	console_fireGenericEvent()
*******************************************************************************/

/* private */ function console_fireGenericEvent(id) {

	var args = new RelayEventArgs(Date.now);

	Wormhole.relayEvent(id, "genericConsole", JSON.stringify(args));
}

/*******************************************************************************
	console_createColoredElement()
*******************************************************************************/

/* private */ function console_createColoredElement(typeName, fgColor, bgColor) {

	// Create a new element
	var e = document.createElement(typeName);

	// Set the element colors
	e.style.color = fgColor;
	e.style.backgroundColor = bgColor;

	return e;
}

/*******************************************************************************
	console_clear()
*******************************************************************************/

/* public */ function console_clear(id, isMainConsole, bgColor, fontSize) {

	var e_console = document.getElementById(id);

	// If this is the main console then set the *entire* body's background color as specified
	if (isMainConsole) {

		document.body.style.backgroundColor = bgColor;
	}

	// Set the entire body's background color as specified
	e_console.style.backgroundColor = bgColor;

	// Set the entire body's font size as specified
	e_console.style.fontSize = fontSize;

	// Remove all the children
	removeAllChildren(e_console);

	console_fireGenericEvent(id);
};

/*******************************************************************************
	console_readKey()

	event.charCode is deprecated: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
*******************************************************************************/

/***********************************************************
	ConsoleReadKeyWormholeArgs class
***********************************************************/

class ConsoleReadKeyWormholeArgs {
	constructor(key, code, isAltKey, isCtrlKey, isMetaKey, isShiftKey) {
		this.key = key;
		this.code = code;
		this.isAltKey = isAltKey;
		this.isCtrlKey = isCtrlKey;
		this.isMetaKey = isMetaKey;
		this.isShiftKey = isShiftKey;
	}
}

/* public */ function console_readKey(id, intercept, fgColor, bgColor) {

	var e_console = document.getElementById(id);

	var e_textarea = console_createColoredElement("textarea", fgColor, bgColor);

	if (intercept)
		e_textarea.className += "console_readKey_intercept";
	else
		e_textarea.className += "console_readKey";

	e_textarea.rows = 1;

	e_textarea.onkeydown = function (event) {

		//var args = processKeyDown(e_textarea, event);
		var key = event.keyCode;

		if (KeyCode.shift === key || KeyCode.ctrl === key || KeyCode.alt === key)
			return;

		event.preventDefault();
		e_textarea.readOnly = true;
		e_textarea.blur();

		var args = new ConsoleReadKeyWormholeArgs(event.key, event.code, event.altKey, event.ctrlKey, event.metaKey, event.shiftKey);

		Wormhole.readKey_Return(id, args);
		//if (null !== args)
		//	Wormhole.readKey_Return(id, args);

		//return false;
		return true;
	};

	// Append the textarea to this console and give it focus
	e_console.appendChild(e_textarea);
	e_textarea.focus();

};

/*******************************************************************************
	console_readLine()
*******************************************************************************/

/* public */ function console_readLine(id, fgColor, bgColor) {

	var e_console = document.getElementById(id);

	var e_textarea = console_createColoredElement("textarea", fgColor, bgColor);

	e_textarea.className += "console_readLine";
	e_textarea.rows = 1;

	e_textarea.oninput = function () {
		e_textarea.style.height = "";
		e_textarea.style.height = e_textarea.scrollHeight + "px";
	};

	e_textarea.onkeypress = function (event) {
		var key = event.keyCode;

		// If the user has pressed enter
		if (KeyCode.enter == key) {
			event.preventDefault();
			e_textarea.readOnly = true;
			e_textarea.blur();

			Wormhole.readLine_Return(id, e_textarea.value);

			return false;
		}
	}

	// Append the textarea to this console and give it focus
	e_console.appendChild(e_textarea);
	e_textarea.focus();
}

/*******************************************************************************
	console_write()
*******************************************************************************/

/* public */ function console_write(id, valueBase64, fgColor, bgColor) {

	// Decode base64 value
	var value = atob(valueBase64);

	var e_console = document.getElementById(id);

	var e_child = console_createColoredElement("span", fgColor, bgColor);

	e_child.className += "console_write";

	// Set the element text
	e_child.innerText = value;

	// Append the element to this console element
	e_console.appendChild(e_child);

	console_fireGenericEvent(id);
}

/*******************************************************************************
	console_writeLine_empty()
*******************************************************************************/

/* public */ function console_writeLine_empty(id) {

	var e_console = document.getElementById(id);

	// Create a new <br> element
	var e_child = document.createElement("br");

	// Append the element to this console element
	e_console.appendChild(e_child);

	console_fireGenericEvent(id);
}

/*******************************************************************************
	console_writeLine()
*******************************************************************************/

/* public */ function console_writeLine(id, valueBase64, fgColor, bgColor) {

	var value = atob(valueBase64);

	var e_console = document.getElementById(id);

	var e_child = console_createColoredElement("div", fgColor, bgColor);

	// Set the element text
	e_child.innerText = value;

	// Append the element to this console element
	e_console.appendChild(e_child);

	console_fireGenericEvent(id);
}



/***************************************************************************************************

	 Application "class"

***************************************************************************************************/

/*******************************************************************************
	application_alert()
*******************************************************************************/

/* public */ function application_alert(message) {
	alert(message);
}


/*******************************************************************************
	application_applyElementActionset()
*******************************************************************************/

/***********************************************************
	EAID enum

	ElementAction IDs
***********************************************************/

var EAID = {
	InsertElement: 0,
	//AddElement : 1,
	ShiftElement: 1,
	MoveElement: 2,
	ChangeElement: 3,
	DeleteElement: 4,
};

/***********************************************************
	ESAID enum

	ElementSpecialAction IDs
***********************************************************/

var ESAID = {

	// Window
	AddWindowTitle: 0,
	DeleteWindowTitle: 1,

	// TextBlock
	AddTextBlockText: 100,
	DeleteTextBlockText: 101,

	// TextBox
	AddTextBoxText: 200,
	DeleteTextBoxText: 201
};

/***********************************************************
	AAID enum

	AssetAction IDs
***********************************************************/

var AAID = {

	// Rules
	AddRule: 0,
	ChangeRule: 1,
	DeleteRule: 2,

	// BitmapImage
	AddBitmapImage: 100,
	DeleteBitmapImage: 101,

	// LinearGradientBrush
	AddLinearGradientBrush: 200,
	DeleteLinearGradientBrush: 201,

	// RadialGradientBrush
	AddRadialGradientBrush: 300,
	DeleteRadialGradientBrush: 301

};

/***********************************************************
	application_deleteElement()
***********************************************************/

function application_deleteElement(elementId) {

	var element = document.getElementById(elementId);
	element.parentNode.removeChild(element);
}

/***********************************************************
	updateElement()
***********************************************************/

function updateElement(child, cssStyle, cssClass) {

	// Style
	if (cssStyle)
		child.style.cssText = cssStyle;
	else
		child.style.cssText = "";

	//cssClass = cssClass.trim();

	// Class
	if (cssClass) {

		var items = cssClass.split(' ');

		var i;
		for (i = 0; i < items.length; ++i)
			child.classList.add(items[i]);
	}
	else
		child.classList = "";

	// Inner html
	//if (innerHtml)
	//	child.innerHTML = innerHtml;
	//else
	//	child.innerHtml = "";
}

/***********************************************************
	insertElement_a()

	Inserts a dom child element into a dom parent element at the specified index.
***********************************************************/

function insertElement_a(parent, index, child) {

	// If the index is at the end then append the child
	if (index >= parent.childNodes.length)
		parent.appendChild(child);

	// Insert child at the specified index
	else {

		// Find the sibling at the specified index and insert before it
		var sibling = parent.childNodes[index];
		parent.insertBefore(child, sibling);
	}
}

/***********************************************************
	insertElement_b()
***********************************************************/

function insertElement_b(parent, index, newChildId, child, cssStyle, cssClass) {

	child.id = newChildId;

	updateElement(child, cssStyle, cssClass);

	insertElement_a(parent, index, child);
}

/***********************************************************
	insertElement_c()

	Inserts into the parent identified by the specified parent id.

	Notes
	-----
	Event Handlers - 
		- Return Value: return false to prevent browser's default behavior: https://stackoverflow.com/questions/128923/whats-the-effect-of-adding-return-false-to-a-click-event-listener
		- Capturing ("tunneling")
			- Is not in older IE so for now, going with old technique and not using capture.
			- Ideally use addEventListener(useCapture) but IE issues: https://www.w3schools.com/jsref/met_element_addeventlistener.asp
			- This may be a decent workaround for IE: https://stackoverflow.com/questions/17249125/event-capturing-jquery
***********************************************************/

function insertElement_c(parentId, index, newChildId, child, cssStyle, cssClass) {

	connectListeners(newChildId, child);
/*
	// console.log("insertElement(" + parentId + "," + index + "," + newChildId + "," + child + "," + cssStyle + "," + cssClass + ")");

	// Attach event listeners to the child
	//child.onmousedown = function (event) { Wormhole.relayEvent(newChildId, JSON.stringify(event)); return false; }
	child.onmousedown = function (event) {
		//var args = new PointerRelayEventArgs(event.type, event.altKey, event.ctrlKey, event.metaKey, event.shiftKey, event.button, event.timeStamp);
		var args = new PointerRelayEventArgs(event.altKey, event.ctrlKey, event.metaKey, event.shiftKey, event.button, event.timeStamp);

		Wormhole.relayEvent(newChildId, event.type, JSON.stringify(args));

		//return false;
		return true; // TODO:2018.7.31 Was eating <input> mouse down. Ultimately, this needs to be dynamically handled with C# interop
	};

	child.onkeydown = function (event) {

		return processKeyEvent(event);
	};

	child.onkeyup = function (event) {

		return processKeyEvent(event);
	};
	*/

	// Get the specified parent
	var parent = document.getElementById(parentId);

	insertElement_b(parent, index, newChildId, child, cssStyle, cssClass);
}

/***********************************************************
	insertElement_Decorator()
***********************************************************/

function insertElement_Decorator(parentId, index, newChildId) {

	// Create the element
	var element = document.createElement("div");

	insertElement_c(parentId, index, newChildId, element, "", "decorator");

	return element;
}

/***********************************************************
	insertElement_Border()
***********************************************************/

function insertElement_Border(parentId, index, newChildId) {

	// Create the element
	var e_border = document.createElement("div");

	// 2018.7.31 insertElement_c(parentId, index, newChildId, e_border, "border", "border");
	insertElement_c(parentId, index, newChildId, e_border, "", "border");

	/*
	var inner = document.createElement("div");

	insertElement_b(e_border, 0, newChildId + "_inner", inner, "", "border-inner");
	*/

	return e_border;
}

/***********************************************************
	insertElement_ButtonBase()
***********************************************************/

//function insertElement_ButtonBase(parentId, index, newChildId) {

//	// Create the element
//	var e = document.createElement("div");

//	//motifHost.onclick = function (event) {

//	//	// Wormhole.button_Clicked(newChildId);
//	//	Wormhole.relayEvent(id, ButtonBase_Click, null);
//	//	return false;
//	//}

//	insertElement_c(parentId, index, newChildId, e, "", "");

//	return e;
//}

/***********************************************************
	insertElement_ButtonMotif()
***********************************************************/

//function insertElement_ButtonMotif(parentId, index, newChildId) {

//	// Create the element
//	var button = document.createElement("div");

//	//button.onclick = function (event) {

//	//	Wormhole.button_Clicked(newChildId);
//	//	return false;
//	//	}

//	insertElement_c(parentId, index, newChildId, button, "", "");

//	return button;
//}

/***********************************************************
	insertElement_ComboBox()
***********************************************************/

function insertElement_ComboBox(parentId, index, newChildId) {

	parent = document.getElementById(parentId);

	fetch('comboBox.html')
		.then(response => response.text())
		.then(h => parent.innerHTML += h);

	return parent.childNodes[0];
}

/***********************************************************
	insertElement_Console()
***********************************************************/

function insertElement_Console(parentId, index, newChildId) {

	var e = document.createElement("div");
	insertElement_c(parentId, index, newChildId, e, "", "console");

	return e;
}

/***********************************************************
	insertElement_Control()
***********************************************************/

function insertElement_Control(parentId, index, newChildId) {

	// Create the element
	var e = document.createElement("div");

	insertElement_c(parentId, index, newChildId, e, "", "control");

	return e;
}

/***********************************************************
	insertElement_Ellipse()
***********************************************************/

function insertElement_Ellipse(parentId, index, newChildId) {

	//
	// Create the svg element and add it to the specified parent

	var e_svg = document.createElementNS(SvgNamespace, "svg");

	insertElement_c(parentId, index, newChildId, e_svg, ShapeCssStyle, "");

	//
	// Create the (child) ellipse and add it to the svg element

	var ellipse = document.createElementNS(SvgNamespace, 'ellipse');

	// The center and radius values are exactly 50% of overall parent
	ellipse.setAttribute("cx", "50%");
	ellipse.setAttribute("cy", "50%");
	ellipse.setAttribute("rx", "50%");
	ellipse.setAttribute("ry", "50%");

	insertElement_b(e_svg, 0, newChildId + "_shape", ellipse, "", "");

	return e_svg;
}

/***********************************************************
	insertElement_Flex()
***********************************************************/

function insertElement_Flex(parentId, index, newChildId) {

	// Create the element
	var flex = document.createElement('div');
	insertElement_c(parentId, index, newChildId, flex, "", "flex");

	return flex;
}

/***********************************************************
	insertElement_Grid()
***********************************************************/

function insertElement_Grid(parentId, index, newChildId) {

	var grid = document.createElement('div');
	insertElement_c(parentId, index, newChildId, grid, "", "grid");

	return grid;
}

/***********************************************************
	insertElement_HostMotif()
***********************************************************/

//function insertElement_HostMotif(parentId, index, newChildId) {

//	// Create the element
//	var button = document.createElement("div");

//	insertElement_c(parentId, index, newChildId, button, "", "hostMotif");

//	return button;
//}

/***********************************************************
	insertElement_Image()
***********************************************************/

function insertElement_Image(parentId, index, newChildId) {

	// Create the element
	var e = document.createElement("img");

	// Insert the element
	insertElement_c(parentId, index, newChildId, e, "", "");

	return e;
}

/***********************************************************
	insertElement_ListBox()
***********************************************************/

function insertElement_ListBox(parentId, index, newChildId) {

	// Create the element
	var e = document.createElement("div");

	insertElement_c(parentId, index, newChildId, e, "", "listBox");

	// Create the panel
	var panel = document.createElement("div");
	insertElement_b(e, 0, "q_panel", panel, "", "");

	return e;
}

/***********************************************************
	insertElement_Rectangle()
***********************************************************/

function insertElement_Rectangle(parentId, index, newChildId) {

	// Create the svg element
	var e_svg = document.createElementNS(SvgNamespace, "svg");

	insertElement_c(parentId, index, newChildId, e_svg, ShapeCssStyle, "");

	var rect = document.createElementNS(SvgNamespace, 'rect');

	rect.setAttribute("x", "0");
	rect.setAttribute("y", "0");
	rect.setAttribute("width", "100%");
	rect.setAttribute("height", "100%");

	insertElement_b(e_svg, 0, newChildId + "_shape", rect, "", "");

	return e_svg;
}

/***********************************************************
	insertElement_TextBlock()
***********************************************************/

function insertElement_TextBlock(parentId, index, newChildId) {

	// Create the element
	// Note:may need to be span if div has problems being horizontally adjacent (which is doubtful).
	var e = document.createElement("div");
	insertElement_c(parentId, index, newChildId, e, "", "textBlock");

	return e;
}

/***********************************************************
	insertElement_TextBox()
***********************************************************/

//function insertElement_TextBox(parentId, index, newChildId) {

//	// Create the element
//	var e = document.createElement("textarea");

//	insertElement_c(parentId, index, newChildId, e, "", "textBox");

//	return e;
//}

/***********************************************************
	insertElement_TextBoxMotif()
***********************************************************/

function insertElement_TextBoxMotif(parentId, index, newChildId) {

	// Create the element
	//var e = document.createElement("input");
	var e = document.createElement("textarea");

	$(e).on("change", function () {

		// Encode the textarea's text to base64 (in case it has quotes, etc.)
		var b64 = btoa(e.value);

		// Package up the args
		var args = new TextChangeRelayEventArgs(b64, event.timeStamp);

		// Relay the event
		Wormhole.relayEvent(newChildId, "textChange", JSON.stringify(args));

		return true;
	});

	// If keydown...
	$(e).on("keydown", function (event) {

		// If [Enter] / [Return] was pressed and TextBoxBase.AcceptsReturn == false then eat the key event
		if (event.keyCode === 13 && false === $(e).hasClass("textBoxBase__acceptsReturn--true")) {
			event.preventDefault();
			return false;
		}
	});

	insertElement_c(parentId, index, newChildId, e, "", "textBoxMotif");

	return e;
}

/***********************************************************
	insertElement_Window()
***********************************************************/

function insertElement_Window(parentId, index, newChildId) {

	// Create the element
	var e = document.createElement('div');
	insertElement_c(parentId, index, newChildId, e, "", "");

	return e;
}

/***********************************************************
	insertElement_WindowMotif()
***********************************************************/

//function insertElement_WindowMotif(parentId, index, newChildId) {

//	// Create the element
//	var e = document.createElement("div");
//	insertElement_c(parentId, index, newChildId, e, "", "");

//	return e;
//}

/***********************************************************
	applyDomElements()
***********************************************************/

function applyDomElements(domElements) {

	// Iterate through all the domElements items...
	domElements.Items.forEach(function (cur) {

		var element = document.getElementById(cur.Id);

		// Iterate through all the element's orig-attributes and remove them
		cur.OrigAttributes.forEach(function (origAttribute) {
			element.removeAttribute(origAttribute);
		});

		// Iterate through all the element's new-attributes and add them
		cur.NewAttributes.forEach(function (newAttribute) {
			element.setAttribute(newAttribute.Name, newAttribute.Value);
		});

		// Iterate through all the element's orig-classes and remove them
		cur.OrigClasses.forEach(function (origClass) {
			element_removeClassItem(element, origClass);
		});

		// Iterate through all the element's new-classes and add them
		cur.NewClasses.forEach(function (newClass) {
			element_addClassItem(element, newClass);
		});

		// Iterate through all the element's orig-properties and remove them
		cur.OrigProperties.forEach(function (origProperty) {
			element.style[origProperty] = null;
		});

		// Iterate through all the element's new-properties and add them
		cur.NewProperties.forEach(function (newProperty) {
			element.style[newProperty.Name] = newProperty.Value;
		});

	});
}

/***********************************************************
	applyElementSpecialActions()
***********************************************************/

function applyElementSpecialActions(element, specialActions) {

	// Iterate through all the element ...
	specialActions.forEach(function (specialAction) {

		switch (specialAction.Id) {

			case ESAID.AddWindowTitle:
				document.title = specialAction.Title;
				break;
			case ESAID.DeleteWindowTitle:
				document.title = null;
				break;
			case ESAID.AddTextBlockText:
				element.textContent = specialAction.Text;
				break;
			case ESAID.DeleteTextBlockText:
				element.textContent = null;
				break;
			case ESAID.AddTextBoxText:
				element.value = specialAction.Text;
				break;
			case ESAID.DeleteTextBoxText:
				element.value = null;
				break;
			default:
				console.log("scopeSyncElementSpecialActions() unknown Id '" + specialAction.Id + "'.");
				break;
		}

	});
}

/* public */ function application_applyElementActionset(actionQueueId, actionsetPosition, actionsetJson) {

	// Used to keep track of elements temporarily that are to be shifted or moved
	var shiftMoveElements = [];

	// Deserialize the json into an actionset object
	var actionset = JSON.parse(actionsetJson);

	// Iterate through all the actions to detach elements that are to be deleted, moved or shifted...
	actionset.Items.forEach(function (action) {

		// If the current action is delete then delete it
		if (EAID.DeleteElement == action.Id) {
			application_deleteElement(action.ElementId);
		}
		// If the current action is move or shift then temporarily disconnect the element
		else if (EAID.MoveElement === action.Id || EAID.ShiftElement === action.Id) {

			// Find the current element
			var element = document.getElementById(action.ElementId);

			// Remove the element from its parent
			element.parentElement.removeChild(element);

			// Retain the element temporarily
			shiftMoveElements.push(element);
		}
	});

	// Iterate through all the actionset element actions...
	actionset.Items.forEach(function (action) {

		// If the current action is a delete then ignore since it was already deleted above
		if (EAID.DeleteElement == action.Id) {
		}
		// The current action is a keep-element action
		else {

			var element = null;

			// Change-Element: Simply obtain ref to element
			if (EAID.ChangeElement === action.Id) {

				element = document.getElementById(action.ElementId);
			}
			// If the current action is a shift or move then the child needs to be inserted into the parent (recall that it was detached above)...
			else if (EAID.ShiftElement === action.Id || EAID.MoveElement === action.Id) {

				element = shiftMoveElements.find(function (e) { return e.id === action.ElementId; });

				var parent = document.getElementById(action.VisibleParentElementId);

				insertElement_a(parent, action.Index, element);
			}

			// Otherwise, if the current action is an insert action...
			else if (EAID.InsertElement == action.Id) {

				var parent = action.VisualParentElementId;
				var index = action.Index;
				var elementId = action.ElementId;

				switch (action.TypeName) {

					case "Decorator": element = insertElement_Decorator(parent, index, elementId); break;
					case "Border": element = insertElement_Border(parent, index, elementId); break;
					//case "ButtonBase": element = insertElement_ButtonBase(parent, index, elementId); break;
					//case "ButtonMotif": element = insertElement_ButtonMotif(parent, index, elementId); break;
					case "ComboBox": element = insertElement_ComboBox(parent, index, elementId); break;
					case "Console": element = insertElement_Console(parent, index, elementId); break;
					case "Control": element = insertElement_Control(parent, index, elementId); break;
					case "Ellipse": element = insertElement_Ellipse(parent, index, elementId); break;
					case "Flex": element = insertElement_Flex(parent, index, elementId); break;
					case "Grid": element = insertElement_Grid(parent, index, elementId); break;
					//case "HostMotif": element = insertElement_HostMotif(parent, index, elementId); break;
					case "Image": element = insertElement_Image(parent, index, elementId); break;
					case "ListBox": element = insertElement_ListBox(parent, index, elementId); break;
					case "Rectangle": element = insertElement_Rectangle(parent, index, elementId); break;
					case "TextBlock": element = insertElement_TextBlock(parent, index, elementId); break;
					//case "TextBox": element = insertElement_TextBox(parent, index, elementId); break;
					case "TextBoxMotif": element = insertElement_TextBoxMotif(parent, index, elementId); break;
					case "Window": element = insertElement_Window(parent, index, elementId); break;
					//case "WindowMotif": element = insertElement_WindowMotif(parent, index, elementId); break;
					default:
						console.log("lesarde-error: unknown type '" + action.TypeName + "'.");
						break;
				}
			}

			// Apply the DomElements property
			applyDomElements(action.DomElements);

			// Scope sync the SpecialActions property
			applyElementSpecialActions(element, action.SpecialActions);
		}

	});

	Wormhole.applyActionset_Return(actionQueueId, actionsetPosition);

}

/*******************************************************************************
	application_applyAssetActionset()
*******************************************************************************/

/***********************************************************
	process_addRuleAction()

	Process the AddRuleAction.Properties property.
***********************************************************/

function process_addRuleAction(addRuleAction) {

	//console.log("### process_addRuleAction(" + addRuleAction.Selector + "):");
	//console.log(addRuleAction);

	var properties = "";

	// Iterate through all the properties to add...
	addRuleAction.Properties.forEach(function (actionProperty) {

		properties += actionProperty.Name + ": " + actionProperty.Value + ";\n";

	});

	//console.log(properties);
	jetson_addRule(addRuleAction.Selector, properties);
}

/***********************************************************
	process_changeRuleAction()

	Used to process ChangeRuleAction.Properties and DeletePropertyNames.

	https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration
	https://stackoverflow.com/questions/13528512/modify-a-css-rule-object-with-javascript
***********************************************************/

function process_changeRuleAction(changeRuleAction) {

	// Get the index to the current rule -- will be -1 if it does not exist
	var ruleIndex = jetson_getRuleIndex(changeRuleAction.Selector);

	if (-1 == ruleIndex)
		console.log("error in changeRuleAction_properties() -- could not find style rule '" + property.Selector + "'.");

	var rule = css_jetson.rules[ruleIndex];
	var style = rule.style;

	// Iterate through all the properties to change...
	changeRuleAction.Properties.forEach(function (actionProperty) {

		// Update the CSS property
		style.setProperty(actionProperty.Name, actionProperty.Value);

	});

	// Iterate through all the property names to delete...
	changeRuleAction.DeletePropertyNames.forEach(function (actionPropertyName) {

		// Remove the CSS property
		style.removeProperty(actionPropertyName);

	});
}

/***********************************************************
	process_deleteRuleAction()
***********************************************************/

function process_deleteRuleAction(deleteRuleAction) {

	jetson_removeRuleBySelector(deleteRuleAction.Selector);

}

/***********************************************************
	process_addBitmapImageAction()
***********************************************************/

function process_addBitmapImageAction(addBitmapImageAction) {

	// Async add the image referenced by the specified uri
	imageSourceManager_addImageAsync(addBitmapImageAction.BitmapImageId, addBitmapImageAction.Uri, function (blobFileUrl, width, height) {

		// Wormhole back the details
		Wormhole.addImageSource_Return(addBitmapImageAction.BitmapImageId, blobFileUrl, width, height);

	});

}

/***********************************************************
	process_deleteBitmapImageAction()
***********************************************************/

function process_deleteBitmapImageAction(deleteBitmapImageAction) {

	imageSourceManager_removeImage(deleteBitmapImageAction.BitmapImageId);

}

/***********************************************************
	process_addGradientAction()
***********************************************************/

function process_addGradientAction(e_gradient, action) {

	e_gradient.id = action.BrushId;

	if (action.Stops) {

		action.Stops.forEach(function (stop) {

			var e_stop = document.createElementNS(SvgNamespace, "stop");

			e_stop.setAttribute("offset", stop.Offset);
			e_stop.setAttribute("style", "stop-color:" + stop.Color);

			e_gradient.appendChild(e_stop);
		});
	}

	// Append the gradient child to the the <defs> element
	var e_svgDefs = document.getElementById("e_svgDefs");
	e_svgDefs.appendChild(e_gradient);
}

/***********************************************************
	process_addLinearGradientBrushAction()

		<svg id="e_svg" ... >
			<defs id="e_svgDefs" ... >

				<linearGradient id="gb_0" x1="0" x2="0" y1="1" y2="1">  |
					<stop offset="0%" stop-color="black"/>              |----  new section
					<stop offset="100%" stop-color="white"/>            |
				</linearGradient>                                       |

			</defs>
		</svg>

***********************************************************/

function process_addLinearGradientBrushAction(action) {

	var e_linearGradient = document.createElementNS(SvgNamespace, "linearGradient");

	//e_linearGradient.id = action.BrushId;

	e_linearGradient.setAttribute("x1", action.X1);
	e_linearGradient.setAttribute("y1", action.Y1);
	e_linearGradient.setAttribute("x2", action.X2);
	e_linearGradient.setAttribute("y2", action.Y2);

	process_addGradientAction(e_linearGradient, action);
	//if (action.Stops) {

	//	action.Stops.forEach(function (stop) {

	//		var e_stop = document.createElementNS(SvgNamespace, "stop");

	//		e_stop.setAttribute("offset", stop.Offset);
	//		e_stop.setAttribute("style", "stop-color:" + stop.Color);

	//		e_linearGradient.appendChild(e_stop);
	//	});
	//}

	//// Append the <linearGradient> child to the the <defs> element
	//var e_svgDefs = document.getElementById("e_svgDefs");
	//e_svgDefs.appendChild(e_linearGradient);
}

/***********************************************************
	process_deleteGradientBrushAction()
***********************************************************/

function process_deleteGradientBrushAction(action) {

	var e_gradient = document.getElementById(action.BrushId);

	var e_svgDefs = document.getElementById("e_svgDefs");
	e_svgDefs.removeChild(e_gradient);
}

/***********************************************************
	process_addRadialGradientBrushAction()
***********************************************************/

function process_addRadialGradientBrushAction(action) {

	var e_radialGradient = document.createElementNS(SvgNamespace, "radialGradient");

	process_addGradientAction(e_radialGradient, action);

}

/* public */ function application_applyAssetActionset(actionQueueId, actionsetPosition, actionsetJson) {

	//console.log("application_applyAssetActionset(" + actionQueueId + ", " + actionsetPosition + ", " + actionsetJson + ")");
	console.log("application_applyAssetActionset(" + actionQueueId + ", " + actionsetPosition + ", actionsetJson)");

	try {
		// Deserialize the json into an actionset object
		var actionset = JSON.parse(actionsetJson);
	}
	catch (e) {
		console.log(e);
	}

	// Iterate through all the asset actions...
	actionset.Items.forEach(function (action) {

		console.log("action.Id = " + action.Id);

		switch (action.Id) {

			case AAID.AddRule:
				process_addRuleAction(action);
				break;

			case AAID.ChangeRule:
				process_changeRuleAction(action);
				break;

			case AAID.DeleteRule:
				process_deleteRuleAction(action);
				break;

			case AAID.AddBitmapImage:
				process_addBitmapImageAction(action);
				break;

			case AAID.DeleteBitmapImage:
				process_deleteBitmapImageAction(action);
				break;

			case AAID.AddLinearGradientBrush:
				process_addLinearGradientBrushAction(action);
				break;

			case AAID.DeleteLinearGradientBrush:
				process_deleteGradientBrushAction(action);
				break;

			case AAID.AddRadialGradientBrush:
				process_addRadialGradientBrushAction(action);
				break;

			case AAID.DeleteRadialGradientBrush:
				process_deleteGradientBrushAction(action);
				break;

			default:
				console.log("application_applyAssetActionset() unknown Id '" + action.Id + "'.");
				break;
		}
	});

	Wormhole.applyActionset_Return(actionQueueId, actionsetPosition);

}
