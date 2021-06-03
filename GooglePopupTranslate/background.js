"use strict";

(function() {

	let m_defaultPopupURL;

	initialization();

	////////////////////////////////////////////////////////////////////////////////////
	function initialization() {
		browser.browserAction.getPopup({}).then((url) => m_defaultPopupURL = url );
		browser.runtime.onMessage.addListener(onRuntimeMessage);
	}

	////////////////////////////////////////////////////////////////////////////////////
	function onRuntimeMessage(message, sender) {

		if(message.id === "MSG_ID_GPT_TAB_SELECTION_CHANGE") {
			browser.browserAction.setPopup({
				tabId: sender.tab.id,
				popup: m_defaultPopupURL + message.selection,
			});
		}
	}
})();
