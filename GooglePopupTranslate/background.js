"use strict";

//
// Opend a bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1758922
//

(function() {

	const LANGUAGES = Object.freeze([
		{ code: "auto",		name: "Detect language" },
		{ code: "af",		name: "Afrikaans" },
		{ code: "sq",		name: "Albanian" },
		{ code: "am",		name: "Amharic" },
		{ code: "ar",		name: "Arabic" },
		{ code: "hy",		name: "Armenian" },
		{ code: "az",		name: "Azerbaijani" },
		{ code: "eu",		name: "Basque" },
		{ code: "be",		name: "Belarusian" },
		{ code: "bn",		name: "Bengali" },
		{ code: "bs",		name: "Bosnian" },
		{ code: "bg",		name: "Bulgarian" },
		{ code: "ca",		name: "Catalan" },
		{ code: "ceb",		name: "Cebuano" },
		{ code: "ny",		name: "Chichewa" },
		{ code: "zh-CN",	name: "Chinese" },
		{ code: "co",		name: "Corsican" },
		{ code: "hr",		name: "Croatian" },
		{ code: "cs",		name: "Czech" },
		{ code: "da",		name: "Danish" },
		{ code: "nl",		name: "Dutch" },
		{ code: "en",		name: "English" },
		{ code: "eo",		name: "Esperanto" },
		{ code: "et",		name: "Estonian" },
		{ code: "tl",		name: "Filipino" },
		{ code: "fi",		name: "Finnish" },
		{ code: "fr",		name: "French" },
		{ code: "fy",		name: "Frisian" },
		{ code: "gl",		name: "Galician" },
		{ code: "ka",		name: "Georgian" },
		{ code: "de",		name: "German" },
		{ code: "el",		name: "Greek" },
		{ code: "gu",		name: "Gujarati" },
		{ code: "ht",		name: "Haitian Creole" },
		{ code: "ha",		name: "Hausa" },
		{ code: "haw",		name: "Hawaiian" },
		{ code: "iw",		name: "Hebrew" },
		{ code: "hi",		name: "Hindi" },
		{ code: "hmn",		name: "Hmong" },
		{ code: "hu",		name: "Hungarian" },
		{ code: "is",		name: "Icelandic" },
		{ code: "ig",		name: "Igbo" },
		{ code: "id",		name: "Indonesian" },
		{ code: "ga",		name: "Irish" },
		{ code: "it",		name: "Italian" },
		{ code: "ja",		name: "Japanese" },
		{ code: "jw",		name: "Javanese" },
		{ code: "kn",		name: "Kannada" },
		{ code: "kk",		name: "Kazakh" },
		{ code: "km",		name: "Khmer" },
		{ code: "rw",		name: "Kinyarwanda" },
		{ code: "ko",		name: "Korean" },
		{ code: "ku",		name: "Kurdish (Kurmanji)" },
		{ code: "ky",		name: "Kyrgyz" },
		{ code: "lo",		name: "Lao" },
		{ code: "la",		name: "Latin" },
		{ code: "lv",		name: "Latvian" },
		{ code: "lt",		name: "Lithuanian" },
		{ code: "lb",		name: "Luxembourgish" },
		{ code: "mk",		name: "Macedonian" },
		{ code: "mg",		name: "Malagasy" },
		{ code: "ms",		name: "Malay" },
		{ code: "ml",		name: "Malayalam" },
		{ code: "mt",		name: "Maltese" },
		{ code: "mi",		name: "Maori" },
		{ code: "mr",		name: "Marathi" },
		{ code: "mn",		name: "Mongolian" },
		{ code: "my",		name: "Myanmar (Burmese)" },
		{ code: "ne",		name: "Nepali" },
		{ code: "no",		name: "Norwegian" },
		{ code: "or",		name: "Odia (Oriya)" },
		{ code: "ps",		name: "Pashto" },
		{ code: "fa",		name: "Persian" },
		{ code: "pl",		name: "Polish" },
		{ code: "pt",		name: "Portuguese" },
		{ code: "pa",		name: "Punjabi" },
		{ code: "ro",		name: "Romanian" },
		{ code: "ru",		name: "Russian" },
		{ code: "sm",		name: "Samoan" },
		{ code: "gd",		name: "Scots Gaelic" },
		{ code: "sr",		name: "Serbian" },
		{ code: "st",		name: "Sesotho" },
		{ code: "sn",		name: "Shona" },
		{ code: "sd",		name: "Sindhi" },
		{ code: "si",		name: "Sinhala" },
		{ code: "sk",		name: "Slovak" },
		{ code: "sl",		name: "Slovenian" },
		{ code: "so",		name: "Somali" },
		{ code: "es",		name: "Spanish" },
		{ code: "su",		name: "Sundanese" },
		{ code: "sw",		name: "Swahili" },
		{ code: "sv",		name: "Swedish" },
		{ code: "tg",		name: "Tajik" },
		{ code: "ta",		name: "Tamil" },
		{ code: "tt",		name: "Tatar" },
		{ code: "te",		name: "Telugu" },
		{ code: "th",		name: "Thai" },
		{ code: "tr",		name: "Turkish" },
		{ code: "tk",		name: "Turkmen" },
		{ code: "uk",		name: "Ukrainian" },
		{ code: "ur",		name: "Urdu" },
		{ code: "ug",		name: "Uyghur" },
		{ code: "uz",		name: "Uzbek" },
		{ code: "vi",		name: "Vietnamese" },
		{ code: "cy",		name: "Welsh" },
		{ code: "xh",		name: "Xhosa" },
		{ code: "yi",		name: "Yiddish" },
		{ code: "yo",		name: "Yoruba" },
		{ code: "zu",		name: "Zulu" }
	]);

	const DEF_SOURCE_INDEX = 0;		// "Detect language"
	const DEF_TARGET_INDEX = 21;	// "English"
	const MENU_ID_PREFIX = "mnuGPT";
	const URL_PREFIX = "https://translate.google.com/?op=translate";

	let m_idxSourceLang = DEF_SOURCE_INDEX;
	let m_idxTargetLang = DEF_TARGET_INDEX;

	initialization();

	////////////////////////////////////////////////////////////////////////////////////
	async function initialization() {

		let defLanguages = await getPreferences()

		m_idxSourceLang = defLanguages.source;
		m_idxTargetLang = defLanguages.target;

		browser.browserAction.setPopup({ popup: getURL() });
		browser.runtime.onMessage.addListener(onRuntimeMessage);
		createBrowserActionContextMenu();
	}

	////////////////////////////////////////////////////////////////////////////////////
	function onRuntimeMessage(message, sender) {
		if(message.id === "MSG_ID_GPT_TAB_SELECTION_CHANGE") {
			browser.browserAction.setPopup({
				tabId: sender.tab.id,
				popup: getURL(encodeURIComponent(message.selection)),
			});
		}
	}

	////////////////////////////////////////////////////////////////////////////////////
	function onClickMenuItemLang(event) {

		let menuId = event.menuItemId;
		let found = menuId.match(/\d+$/);

		if(!!found) {

			if(menuId.includes("-sl-")) {
				m_idxSourceLang = parseInt(found[0]);
			} else if(menuId.includes("-tl-")) {
				m_idxTargetLang = parseInt(found[0]);
			}

			setPreferences();
			browser.browserAction.setPopup({ popup: getURL() });
		}
	}

	////////////////////////////////////////////////////////////////////////////////////
	function createBrowserActionContextMenu() {

		let subMenuIdSourceLang = browser.menus.create({
			id: MENU_ID_PREFIX + "sourceLang",
			title: "Default Source Language",
			contexts: ["browser_action"],
		});

		let subMenuIdTargetLang = browser.menus.create({
			id: MENU_ID_PREFIX + "targetLang",
			title: "Default Target Language",
			contexts: ["browser_action"],
		});

		for(let i=0, len=LANGUAGES.length; i<len; i++) {
			browser.menus.create({
				id: `${MENU_ID_PREFIX}-sl-${i}`,
				parentId: subMenuIdSourceLang,
				title: LANGUAGES[i].name,
				type: "radio",
				checked: (i === m_idxSourceLang),
				onclick: onClickMenuItemLang,
				contexts: ["browser_action"],
			});
			browser.menus.create({
				id: `${MENU_ID_PREFIX}-tl-${i}`,
				parentId: subMenuIdTargetLang,
				title: LANGUAGES[i].name,
				type: "radio",
				checked: (i === m_idxTargetLang),
				onclick: onClickMenuItemLang,
				contexts: ["browser_action"],
			});
		}
	}

	////////////////////////////////////////////////////////////////////////////////////
	function getURL(queryText = "") {
		return `${URL_PREFIX}&sl=${LANGUAGES[m_idxSourceLang].code}&tl=${LANGUAGES[m_idxTargetLang].code}&text=${queryText}`;
	}

	////////////////////////////////////////////////////////////////////////////////////
	function getPreferences() {
		return new Promise((resolve) => {
			browser.storage.local.get("pref_defLanguages").then((result) => {
				resolve(result.pref_defLanguages === undefined ? { source: DEF_SOURCE_INDEX, target: DEF_TARGET_INDEX } : result.pref_defLanguages);
			});
		});
	}

	////////////////////////////////////////////////////////////////////////////////////
	function setPreferences() {
		return browser.storage.local.set({ pref_defLanguages: { source: m_idxSourceLang, target: m_idxTargetLang } });
	}
})();
