/***************************************************************************************************
	interop-wasm.js file
	
	Copyright © 2018 Lesarde Inc. All rights reserved.

	Interops with the wasm build. The interop-win.js is used to interact with .NET framework builds.
	
	This file is preprocessed (see %% macros).
***************************************************************************************************/

/*******************************************************************************
	global variables
*******************************************************************************/

// These time-relatved variables are used strictly for diagnostics
var startLoadTime = Date.now();		// The moment this code was loaded
var runtimeLoadTime = null;			// The moment Module.onRuntimeInitialized was called
var bclLoadTime = null;				// The moment BCL loading completed

/*******************************************************************************
	httpClient_getByteArray()

	https://www.w3schools.com/xml/xml_http.asp
	https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
*******************************************************************************/

function httpClient_getByteArray(requestUri) {

	uploadBase64Async(requestUri, function (base64) {
		Wormhole.httpClient_getByteArray(requestUri, base64);
	});

	//console.log("httpClient_getByteArray");

	//	if (requestUri.charAt(0) != '/')
	//	requestUri = '/' + requestUri;
/*
	var oReq = new XMLHttpRequest();
	oReq.open("GET", requestUri, true);
	oReq.responseType = "blob";

	oReq.onload = function (oEvent) {

		var blob = oReq.response;

		var reader = new FileReader();
		reader.readAsDataURL(blob);
		reader.onloadend = function () {
			var base64 = reader.result;
			//console.log(base64data);
			Wormhole.httpClient_getByteArray(requestUri, base64);
		}
	};

	oReq.send();
	*/
};

/*******************************************************************************
	Module Object

	This object is a dependency of mono.js.; mono.js expects a global named
	'Module' to exist that contains an onRuntimeInitialized() function.
*******************************************************************************/

var Module = {

	/***********************************************************
		onRuntimeInitialized() public
	***********************************************************/

	onRuntimeInitialized: function () {
	
		// Collection of all the assembly names
		var assemblies = ["Demo.dll", "System.Runtime.dll", "mscorlib.dll", "System.Core.dll", "System.dll", "System.Xml.dll", "Microsoft.AspNetCore.Mvc.Core.dll", "netstandard.dll", "System.Data.dll", "System.Numerics.dll", "System.Transactions.dll", "System.Drawing.dll", "System.IO.Compression.dll", "System.IO.Compression.FileSystem.dll", "System.Net.Http.dll", "System.Runtime.Serialization.dll", "System.Xml.Linq.dll", "Microsoft.AspNetCore.Http.Abstractions.dll", "Microsoft.AspNetCore.Http.Features.dll", "Microsoft.Extensions.Primitives.dll", "System.Memory.dll", "System.Runtime.CompilerServices.Unsafe.dll", "System.Text.Encodings.Web.dll", "Microsoft.AspNetCore.Routing.dll", "Microsoft.Extensions.Logging.Abstractions.dll", "Microsoft.AspNetCore.Routing.Abstractions.dll", "Microsoft.Extensions.Options.dll", "Microsoft.Extensions.DependencyInjection.Abstractions.dll", "Microsoft.Extensions.ObjectPool.dll", "Microsoft.AspNetCore.Mvc.Abstractions.dll", "Microsoft.AspNetCore.Authentication.Abstractions.dll", "Microsoft.Net.Http.Headers.dll", "System.Buffers.dll", "Microsoft.AspNetCore.Http.dll", "Microsoft.AspNetCore.WebUtilities.dll", "Microsoft.Extensions.FileProviders.Abstractions.dll", "System.Threading.Tasks.Extensions.dll", "Microsoft.AspNetCore.Authorization.dll", "System.Diagnostics.DiagnosticSource.dll", "Microsoft.AspNetCore.Http.Extensions.dll", "Microsoft.AspNetCore.Hosting.Abstractions.dll", "Microsoft.Extensions.Configuration.Abstractions.dll", "Microsoft.AspNetCore.Hosting.Server.Abstractions.dll", "Microsoft.AspNetCore.Authorization.Policy.dll", "Microsoft.Extensions.DependencyModel.dll", "System.Collections.dll", "Microsoft.DotNet.PlatformAbstractions.dll", "System.Runtime.InteropServices.RuntimeInformation.dll", "System.AppContext.dll", "System.Runtime.Extensions.dll", "System.IO.FileSystem.dll", "System.Runtime.InteropServices.dll", "System.Reflection.dll", "System.IO.dll", "Newtonsoft.Json.dll", "System.Linq.dll", "System.IO.FileSystem.Primitives.dll", "Microsoft.Extensions.DependencyInjection.dll", "System.Resources.ResourceManager.dll", "System.ComponentModel.dll", "System.Linq.Expressions.dll", "System.Collections.Concurrent.dll", "System.Diagnostics.Debug.dll", "System.Reflection.Emit.ILGeneration.dll", "System.Reflection.Emit.Lightweight.dll", "System.Threading.dll", "System.Reflection.Primitives.dll", "Microsoft.AspNetCore.ResponseCaching.Abstractions.dll", "Microsoft.AspNetCore.Authentication.Core.dll", "Microsoft.AspNetCore.Razor.Runtime.dll", "Microsoft.AspNetCore.Razor.dll", "Microsoft.AspNetCore.Html.Abstractions.dll", "Lesarde.Frogui.dll", "Lesarde.Base.dll", "Microsoft.Extensions.Logging.dll"]; 

		runtimeLoadTime = Date.now();
		console.log("Done with WASM module instantiation. Took " + (runtimeLoadTime - startLoadTime) + " ms");

		Module.FS_createPath("/", "managed", true, true);

		var pending = 0;
		assemblies.forEach(function (asm_name) {
			console.log("loading " + asm_name);
			++pending;
			fetch("managed/" + asm_name, { credentials: 'same-origin' }).then(function (response) {
				if (!response.ok)
					throw "failed to load Assembly '" + asm_name + "'";
				return response['arrayBuffer']();
			}).then(function (blob) {
				var asm = new Uint8Array(blob);
				Module.FS_createDataFile("managed/" + asm_name, null, asm, true, true, true);
				console.log("LOADED: " + asm_name);
				--pending;
				if (pending == 0) {

					bclLoadTime = Date.now();
					console.log("Done loading the BCL. Took " + (bclLoadTime - runtimeLoadTime) + " ms");

					// Initialize the MonoRuntime object
					MonoRuntime.init();
				}
			});
		});
	},

};

/*******************************************************************************
	MonoRuntime Object

	This contains dynamically created functions (e.g. load_runtime()) that
	allow interaction with the mono runtime, including invoking calls
	to C# methods.
*******************************************************************************/

var MonoRuntime = {

	/***********************************************************
		init() public
	***********************************************************/

	init: function () {

		// Get the mono functions
		this.load_runtime = Module.cwrap('mono_wasm_load_runtime', null, ['string', 'number']);
		this.assembly_load = Module.cwrap('mono_wasm_assembly_load', 'number', ['string']);
		this.find_class = Module.cwrap('mono_wasm_assembly_find_class', 'number', ['number', 'string', 'string']);
		this.find_method = Module.cwrap('mono_wasm_assembly_find_method', 'number', ['number', 'string', 'number']);
		this.invoke_method = Module.cwrap('mono_wasm_invoke_method', 'number', ['number', 'number', 'number']);
		this.mono_string_get_utf8 = Module.cwrap('mono_wasm_string_get_utf8', 'number', ['number']);
		this.mono_string = Module.cwrap('mono_wasm_string_from_js', 'number', ['string'])

		this.load_runtime("managed", 1);

		runtimeLoadTime = Date.now();

		console.log("Done initializing the runtime. Took " + (runtimeLoadTime - bclLoadTime) + " ms");

		//this.prepareDomForUse();

		// Initialize the Wormhole object
		Wormhole.init();
	},

	/***********************************************************
		conv_string() private
	***********************************************************/

	conv_string: function (mono_obj) {
		if (mono_obj == 0)
			return null;
		var raw = this.mono_string_get_utf8(mono_obj);
		var res = Module.UTF8ToString(raw);
		Module._free(raw);

		return res;
	},

	/***********************************************************
		call_method() public
	***********************************************************/

	call_method: function (method, this_arg, args) {

		var args_mem = Module._malloc(args.length * 4);
		var eh_throw = Module._malloc(4);
		for (var i = 0; i < args.length; ++i)
			Module.setValue(args_mem + i * 4, args[i], "i32");
		Module.setValue(eh_throw, 0, "i32");

		var res = this.invoke_method(method, this_arg, args_mem, eh_throw);

		var eh_res = Module.getValue(eh_throw, "i32");

		Module._free(args_mem);
		Module._free(eh_throw);

		if (eh_res != 0) {
			var msg = this.conv_string(res);
			throw new Error(msg);
		}

		return res;
	}
};

/*******************************************************************************
	Wormhole Object
*******************************************************************************/

var Wormhole = {

	//doConsoleClear: false,

	/***********************************************************
		init() public
	***********************************************************/

	init: function () {

		window.prepareDomForUse();

		this.findMethods();

		// Call the C# "main" method
		MonoRuntime.call_method(this.main_method, null, []);
	},

	/***********************************************************
		findMethods() private
	***********************************************************/

	findMethods: function () {

		// main_module
		this.main_module = this.findAssembly("Demo");
		this.main_class = this.findClass(this.main_module, "Demo", "Demo", "Program");
		this.main_method = this.findMethod(this.main_class, "Demo", "Program", "Main");

		//var LESARDE_BASE_ASSEMBLY = "Lesarde.Base";
		//var LESARDE_FROGUI_BASE_ASSEMBLY = "Lesarde.Frogui.Base";
		var LESARDE_FROGUI_ASSEMBLY = "Lesarde.Frogui";
		var LESARDE_NAMESPACE = "Lesarde";
		var LESARDE_INTEROP_NAMESPACE = LESARDE_NAMESPACE + ".Interop";
		//var LESARDE_FROGUI_CONTROLS_NAMESPACE = LESARDE_NAMESPACE + ".Frogui.Controls";
		//var CONSOLE_CLASS = "Console";
		var WORMHOLE_CLASS = "WasmWormhole";

		// base_module
		this.base_module = this.findAssembly(LESARDE_FROGUI_ASSEMBLY);

		this.wormhole_class = this.findClass(this.base_module, LESARDE_FROGUI_ASSEMBLY, LESARDE_INTEROP_NAMESPACE, WORMHOLE_CLASS);

		this.readKey_Return_method = this.findMethod(this.wormhole_class, LESARDE_INTEROP_NAMESPACE, WORMHOLE_CLASS, "ReadKey_Return");
		this.readLine_Return_method = this.findMethod(this.wormhole_class, LESARDE_INTEROP_NAMESPACE, WORMHOLE_CLASS, "ReadLine_Return");
		this.relayEvent_method = this.findMethod(this.wormhole_class, LESARDE_INTEROP_NAMESPACE, WORMHOLE_CLASS, "RelayEvent");
		this.addImageSource_Return_method = this.findMethod(this.wormhole_class, LESARDE_INTEROP_NAMESPACE, WORMHOLE_CLASS, "AddImageSource_Return");
		this.applyActionset_Return_method = this.findMethod(this.wormhole_class, LESARDE_INTEROP_NAMESPACE, WORMHOLE_CLASS, "ApplyActionset_Return");

		this.httpClient_getByteArray_method = this.findMethod(this.wormhole_class, LESARDE_INTEROP_NAMESPACE, WORMHOLE_CLASS, "HttpClient_GetByteArray");
	},

	/***********************************************************
		findAssembly() private
	***********************************************************/

	findAssembly: function (name) {

		var assembly = MonoRuntime.assembly_load(name);

		if (!assembly)
			throw "Could not find assembly " + name;

		return assembly;
	},

	/***********************************************************
		findClass() private
	***********************************************************/

	findClass: function (assembly, assemblyName, namespaceName, className) {

		var _class = MonoRuntime.find_class(assembly, namespaceName, className);

		if (!_class)
			throw "Could not find class '" + namespaceName + "." + className + "' in assembly '" + assemblyName + "'";

		return _class;
	},

	/***********************************************************
		findMethod() private
	***********************************************************/

	findMethod: function (_class, namespaceName, className, methodName) {

		var method = MonoRuntime.find_method(_class, methodName, -1);

		if (!method)
			throw "Could not find method '" + methodName + "' in class '" + namespaceName + "." + className + "'";

		return method;
	},

	/***********************************************************
		invokeCs() public
	***********************************************************/

	/*
	invokeCs: function (eid, whid, args) {

		var jsonArgs = JSON.stringify(args);
		MonoRuntime.call_method(this.invokeCs_method, null, [MonoRuntime.mono_string(String(eid)), MonoRuntime.mono_string(String(whid)), MonoRuntime.mono_string(jsonArgs)]);
	}
	*/

	/***********************************************************
		readLine_Return() public
	***********************************************************/

	readLine_Return: function (eid, args) {

		MonoRuntime.call_method(this.readLine_Return_method, null, [MonoRuntime.mono_string(eid), MonoRuntime.mono_string(args)]);
	},

	/***********************************************************
		applyActionset_Return() public
	***********************************************************/

	applyActionset_Return: function (actionQueueId, actionsetPosition) {

		MonoRuntime.call_method(this.applyActionset_Return_method, null, [MonoRuntime.mono_string(actionQueueId), MonoRuntime.mono_string(actionsetPosition)]);
	},

	/***********************************************************
		readKey_Return() public
	***********************************************************/

	readKey_Return: function (eid, args) {

		var jsonArgs = JSON.stringify(args);

		MonoRuntime.call_method(this.readKey_Return_method, null, [MonoRuntime.mono_string(eid), MonoRuntime.mono_string(jsonArgs)]);
	},

	/***********************************************************
		button_Clicked() public
	***********************************************************/

	//button_Clicked: function (eid) {

	//	MonoRuntime.call_method(this.button_Clicked_method, null, [MonoRuntime.mono_string(eid)]);
	//},

	/***********************************************************
		relayEvent() public
	***********************************************************/

	//relayEvent: function (eid, eventId, argsJson) {

	//	MonoRuntime.call_method(this.relayEvent_method, null, [MonoRuntime.mono_string(eid), MonoRuntime.mono_string(eventId.toString()), MonoRuntime.mono_string(argsJson)]);
	//},
	//relayEvent: function (eid, argsJson) {

	//	MonoRuntime.call_method(this.relayEvent_method, null, [MonoRuntime.mono_string(eid), MonoRuntime.mono_string(argsJson)]);
	//},
	relayEvent: function (eid, eventName, argsJson) {

		// 2018.8.12 Check necessary since apparently how we load scripts is not ideal
		if (MonoRuntime.mono_string)
			MonoRuntime.call_method(this.relayEvent_method, null, [MonoRuntime.mono_string(eid), MonoRuntime.mono_string(eventName), MonoRuntime.mono_string(argsJson)]);
	},

	/***********************************************************
		addImageSource_Return() public
	***********************************************************/

	addImageSource_Return: function (id, blobFileUrl, width, height) {

		MonoRuntime.call_method(this.addImageSource_Return_method, null, [MonoRuntime.mono_string(id), MonoRuntime.mono_string(blobFileUrl), MonoRuntime.mono_string(width.toString()), MonoRuntime.mono_string(height.toString())]);
	},

	/***********************************************************
		httpClient_getByteArray() public
	***********************************************************/

	httpClient_getByteArray: function (requestUri, base64) {

		console.log("httpClient_getByteArray");

		MonoRuntime.call_method(this.httpClient_getByteArray_method, null, [MonoRuntime.mono_string(requestUri), MonoRuntime.mono_string(base64)]);
	}

};
