"use strict";

(function() {

	let m_selectionChangeDebouncer = null;

	document.addEventListener("selectionchange", () => {

		clearTimeout(m_selectionChangeDebouncer);
		m_selectionChangeDebouncer = setTimeout(async () => {

			await browser.runtime.sendMessage({
				id: "MSG_ID_GPT_CONTENT_SELECTION_CHANGE",
				selection: document.getSelection().toString(),
			});

			m_selectionChangeDebouncer = null;
		}, 420);
	});

})();
