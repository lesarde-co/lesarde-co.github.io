﻿/***************************************************************************************************
	frogui-base.js

	Copyright © 2018 Lesarde Inc. All rights reserved.
***************************************************************************************************/

/***************************************************************************************************

	 Global space -- ? Best to access with "window." ?

***************************************************************************************************/

/*******************************************************************************
	prepareDomForUse()
*******************************************************************************/

/* public */ function prepareDomForUse() {

	// Find the e_loading element and hide it
	var e_loading = document.getElementById("e_loading");
	e_loading.hidden = true;
}