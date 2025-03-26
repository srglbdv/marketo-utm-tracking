/*
 * TDCS (Traffic Data Capture Script) for Marketo Forms
 * @author Sergei Lebedev
 * @version v1.0.0 2024-09-26
 * @copyright © 2024 Sergei Lebedev
 * @license MIT: This license must appear with all reproductions of this software.
 *
 */

// Configuration variables - Marketo API field names mapping
const UTM_FIELDS = {
	'utm_source': 'mkt_utm_source',
	'utm_medium': 'mkt_utm_medium',
	'utm_campaign': 'mkt_utm_campaign',
	'utm_content': 'mkt_utm_content',
	'utm_term': 'mkt_utm_term',
	'utm_adgroup': 'mkt_utm_adgroup',
	'utm_keyword': 'mkt_utm_keyword'
};

// Add configuration for primary domain and secondary domains
const PRIMARY_DOMAIN = 'yourdomain.com';
const SECONDARY_DOMAINS = ['domain2.com', 'domain3.com'];

/**************** DO NOT EDIT BELOW THIS LINE ****************/

// Search Engine list
const SE_LIST = new Map([
	["www.google", "google"],
	[".google.co", "google"],
	["www.bing", "bing"],
	[".bing.com", "bing"],
	["www.yahoo", "yahoo"],
	["search.yahoo", "yahoo"],
	["yahoo.cn", "yahoo"],
	["www.yandex", "yandex"],
	["yandex.ru", "yandex"],
	["ya.ru", "yandex"],
	["yandex.com", "yandex"],
	["www.ecosia.org", "ecosia"],
	["duckduckgo.com", "duckduckgo"],
	["android.googlequicksearchbox", "google"],
	["baidu.com", "baidu"],
	["search.aol.com", "aol"],
	["www.ask.com", "ask"],
	["search.brave.com", "brave"],
	["www.startpage.com", "startpage"],
	["www.qwant.com", "qwant"],
	["searx.me", "searx"],
	["www.dogpile.com", "dogpile"],
	["www.wolframalpha.com", "wolframalpha"],
	["www.archive.org", "internetarchive"],
	["go.mail.ru", "mailru"],
	["www.naver.com", "naver"],
	["www.daum.net", "daum"],
	["www.seznam.cz", "seznam"],
	["www.rediff.com", "rediff"],
	["search.sify.com", "sify"],
	["www.indiatimes.com", "indiatimes"],
	["www.khoj.com", "khoj"],
	["www.bhanvad.com", "bhanvad"],
	["www.guruji.com", "guruji"],
	["www.123musiq.com", "123musiq"]
]);

// Social network domains
const SOCIAL_LIST = new Map([
	["linkedin.com", "linkedin"],
	["com.linkedin.android", "linkedin"],
	["facebook.com", "facebook"],
	["twitter.com", "twitter"],
	["x.com", "x"],
	["instagram.com", "instagram"],
	["pinterest.com", "pinterest"],
	["reddit.com", "reddit"],
	["t.co", "twitter"],
	["lnkd.in", "linkedin"],
	["fb.me", "facebook"],
	["bit.ly", "bitly"],
	["youtu.be", "youtube"],
	["youtube.com", "youtube"],
	["tumblr.com", "tumblr"],
	["tiktok.com", "tiktok"],
	["medium.com", "medium"],
	["quora.com", "quora"]
]);

// Click ID list
const CLIDS_LIST = new Map([
	["msclkid", "bing"],
	["fbclid", "facebook"],
	["yclid", "yahoo"],
	["gclid", "google"],
	["cq_gclid", "google"],
	["dclid", "google"],
	["twclid", "twitter"],
	["li_fat_id", "linkedin"],
	["ttclid", "tiktok"],
	["pt_id", "pinterest"],
	["wbraid", "google"],
	["gbraid", "google"],
	["igshid", "instagram"],
	["mc_eid", "mailchimp"],
	["hsa_cam", "hubspot"],
	["ad_id", "snapchat"],
	["rtd_id", "reddit"],
	["vero_id", "vero"],
	["otm_campaign", "outbrain"],
	["cid", "adobe"],
	["s_cid", "adobe"],
	["sclid", "sharechat"],
	["zclid", "zomato"],
	["fclid", "flipkart"],
	["pclid", "paytm"],
	["mclid", "makemytrip"],
	["oclid", "ola"],
	["uclid", "uber"],
	["jclid", "jio"],
	["hclid", "hotstar"],
	["gpclid", "googleplay"],
	["aclid", "amazonin"]
]);

// Debugging function
function debug(message, obj) {
	if (window.location.hash === '#debug') {
		if (obj === undefined) {
			console.log(`[TDCS Debug] ${message}`);
		} else {
			console.log(`[TDCS Debug] ${message}`, obj);
		}
	}
}

// Helper function to extract the root domain from a hostname
function getRootDomain(hostname) {
	const parts = hostname.split('.');
	return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
}

// Helper function to check if a domain matches exactly or is a subdomain of a social domain
function isDomainOrSubdomain(referrerDomain, socialDomain) {
	return referrerDomain === socialDomain || referrerDomain.endsWith('.' + socialDomain);
}

// Helper function to check if a domain is a secondary domain
function isSecondaryDomain(domain) {
	return SECONDARY_DOMAINS.includes(domain);
}

// Function to create a cookie with a specified expiration time
function createCookie(name, value, days, domain) {
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = "; expires=" + date.toUTCString();
	}
	const domainString = domain ? "; domain=" + domain : "";
	document.cookie = name + "=" + value + expires + domainString + "; path=/;";
	debug(`Cookie created: ${name} on domain: ${domain || 'current domain'}`);
}

// Function to read a cookie value by name
function readCookie(name) {
	const nameEQ = name + "=";
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) {
			debug(`Cookie read: ${name}`);
			return c.substring(nameEQ.length, c.length);
		}
	}
	debug(`Cookie not found: ${name}`);
	return null;
}

// Helper function to get case-insensitive URL parameter
function getParameterCaseInsensitive(url, key) {
	const searchParams = new URLSearchParams(url.search.toLowerCase());
	return searchParams.get(key.toLowerCase());
}

// Helper function to extract search query from URL
function extractSearchQuery(url) {
    try {
        const searchParams = new URLSearchParams(url.substring(url.indexOf('?')));
        debug('Search params:', Object.fromEntries(searchParams));
        
        const searchTerms = ['q', 'query', 'search', 'text', 'p', 'wd'];
        for (const term of searchTerms) {
            const value = searchParams.get(term);
            if (value) return decodeURIComponent(value);
        }
    } catch (e) {
        debug('Error in extractSearchQuery:', e);
    }
    return null;
}

// Main tracking logic
debug('Starting main tracking logic');
const referrer = document.referrer; // Get the referring URL
const paramsString = window.location.search; // Get the query string of the current URL
const searchParams = new URLSearchParams(paramsString); // Parse the query string

// Declare variables for UTM parameters and click ID
let utm_campaign = null,
	utm_source = null,
	utm_medium = null,
	utm_term = null,
	utm_content = null,
	utm_adgroup = null,
	utm_keyword = null,
	clid = null;

// Initialize other tracking variables
let visitorAttributes = {}; // Object to store all collected traffic data
let isInternalReferrer = false; // Flag to check if the referrer is from the same site
const eventId = Math.floor(Math.random() * Math.pow(10, 9)); // Generate a random event ID
const currentTimestamp = Math.floor(Date.now() / 1E3); // Current timestamp in seconds

// Check if the referrer is from the same site
const currentRootDomain = getRootDomain(window.location.hostname);
debug(`Current root domain: ${currentRootDomain}`);
let referrerRootDomain = '';
if (referrer) {
	const referrerHostname = new URL(referrer).hostname;
	referrerRootDomain = getRootDomain(referrerHostname);
	isInternalReferrer = currentRootDomain === referrerRootDomain || 
		(currentRootDomain === PRIMARY_DOMAIN && isSecondaryDomain(referrerRootDomain)) ||
		(isSecondaryDomain(currentRootDomain) && (referrerRootDomain === PRIMARY_DOMAIN || isSecondaryDomain(referrerRootDomain)));
	debug(`Referrer: ${referrer}, Referrer root domain: ${referrerRootDomain}, Is internal: ${isInternalReferrer}`);
}

// Read existing tracking data
const initialVisitId = readCookie("initialVisitId"); // Read the first visit cookie
const isFirstVisit = !initialVisitId; // Determine if this is the first visit
debug(`Is first visit: ${isFirstVisit}`);
const tdcs = sessionStorage.getItem("tdcs"); // Read traffic data from session storage

if (tdcs) {
	// If traffic data exists in session storage, use it
	visitorAttributes = JSON.parse(atob(tdcs));
	debug('Using existing traffic data from session storage');
} else {
	debug('No existing traffic data, collecting new data');

	// Collect all UTM parameters (case-insensitive)
	for (const [key, value] of searchParams.entries()) {
		const lowerKey = key.toLowerCase();
		switch (lowerKey) {
			case 'utm_source':
				utm_source = value || null;
				break;
			case 'utm_medium':
				utm_medium = value || null;
				break;
			case 'utm_campaign':
			case 'ga_campaign':
			case 'cq_cmp':
				utm_campaign = value || null;
				break;
			case 'utm_term':
				utm_term = value || null;
				break;
			case 'utm_content':
				utm_content = value || null;
				break;
			case 'utm_adgroup':
			case 'utm_ad_group':
				utm_adgroup = value || null;
				break;
			case 'utm_keyword':
				utm_keyword = value || null;
				break;
		}
	}

	debug(`UTM parameters: utm_source=${utm_source}, utm_medium=${utm_medium}, utm_campaign=${utm_campaign}, utm_term=${utm_term}, utm_content=${utm_content}, utm_adgroup=${utm_adgroup}, utm_keyword=${utm_keyword}`);

	if (!utm_source && !utm_medium) {
		// If no UTM parameters, check for click IDs
		for (const [key, value] of CLIDS_LIST) {
			if (searchParams.has(key)) {
				utm_source = value;
				utm_medium = "cpc";
				clid = `${key}:${searchParams.get(key)}`;
				debug(`Click ID found: ${clid}, set utm_source: ${utm_source}, utm_medium: ${utm_medium}`);
				break;
			}
		}
	}

	// If still no UTM data, try to determine source from referrer
	if (!utm_source && !utm_medium) {
		if (referrer && !isInternalReferrer) {

			// Check if referrer is a known search engine
			for (const [key, value] of SE_LIST) {
				if (referrer.includes(key)) {
					utm_source = value;
					utm_medium = "organic";
					utm_campaign = isSecondaryDomain(currentRootDomain) ? currentRootDomain : utm_campaign || "(not set)";
        
	        try {
	            const searchQuery = extractSearchQuery(referrer);
	            if (searchQuery) {
	                utm_keyword = searchQuery;
	            }
	        } catch (e) {
	            debug('Error extracting search keyword:', e);
	        }
	        
	        debug(`Search engine referrer found: ${key}, set utm_source: ${utm_source}, utm_medium: ${utm_medium}, utm_campaign: ${utm_campaign}, utm_keyword: ${utm_keyword}`);
	        break;
				}
			}

			// If not a search engine, check if it's a known social network
			if (!utm_source) {
				const referrerUrl = new URL(referrer);
				const referrerDomain = referrerUrl.hostname.toLowerCase();

				for (const [socialDomain, socialNetwork] of SOCIAL_LIST) {
					if (isDomainOrSubdomain(referrerDomain, socialDomain)) {
						utm_source = socialNetwork;
						utm_medium = "social";
						utm_campaign = isSecondaryDomain(currentRootDomain) ? currentRootDomain : utm_campaign || "(not set)";
						debug(`Social network referrer found: ${socialDomain}, set utm_source: ${utm_source}, utm_medium: ${utm_medium}, utm_campaign: ${utm_campaign}`);
						break;
					}
				}
			}

			// If not a known search engine or social network, set as referral
			if (!utm_source) {
				utm_source = referrerRootDomain || referrer;
				utm_medium = "referral";
				utm_campaign = isSecondaryDomain(currentRootDomain) ? currentRootDomain : utm_campaign || "(not set)";
				debug(`Unknown referrer, set utm_source: ${utm_source}, utm_medium: ${utm_medium}, utm_campaign: ${utm_campaign}`);
			}

		} else if (!referrer || isInternalReferrer) {
			// If no referrer or internal referrer, set as direct
			utm_source = "direct";
			utm_medium = "none";
			utm_campaign = isSecondaryDomain(currentRootDomain) ? currentRootDomain : "(not set)";
			debug('No referrer or internal referrer, set as direct');
		}
	}

	if (utm_source && utm_medium && !utm_campaign) {
		// If no UTM campaign is present, use (not set)
		utm_campaign = isSecondaryDomain(currentRootDomain) ? currentRootDomain : "(not set)";
		debug('Set utm_campaign to "(not set)" as utm_source and utm_medium are present but utm_campaign is empty after all checks');
	}

	// Get GA cookie using the existing readCookie function
	const gaCookie = readCookie("_ga");

	// Compile all visitor attributes 
	visitorAttributes = {
		landing_page: document.location.href,
		utm_source: utm_source,
		utm_medium: utm_medium,
		utm_campaign: utm_campaign,
		utm_term: utm_term,
		utm_content: utm_content,
		utm_adgroup: utm_adgroup,
		utm_keyword: utm_keyword,
		clid: clid,
		query_params: paramsString,
		session_referrer: referrer,
		is_first_visit: isFirstVisit,
		event_id: eventId,
		initial_visit_id: initialVisitId || `${eventId}.${currentTimestamp}`,
		ga_cookie: gaCookie
	};

	debug('Visitor attributes compiled', visitorAttributes);

	// Store visitor attributes in session storage
	sessionStorage.setItem("tdcs", btoa(JSON.stringify(visitorAttributes)));
	debug('Visitor attributes stored in session storage');
}

// Handle initial visit cookie
if (!initialVisitId) {
	// If this is the first visit, set the initialVisitId cookie with a 730-day expiry
	createCookie("initialVisitId", `${eventId}.${currentTimestamp}`, 730, currentRootDomain);
	debug('Initial visit cookie created');
}

// Marketo form integration
if (typeof MktoForms2 !== 'undefined') {
	debug('MktoForms2 detected, setting up form integration');
	MktoForms2.whenReady(function(form) {
		debug(`Marketo form ready, ID: ${form.getId()}`);
		const params = {};

		// Helper function to check if a value is empty or undefined
		const isEmptyOrUndefined = (value) => value === '' || value === undefined || value === null;

		// Map UTM parameters to Marketo fields
		for (const [utmParam, marketoField] of Object.entries(UTM_FIELDS)) {
			const value = visitorAttributes[utmParam];
			params[marketoField] = isEmptyOrUndefined(value) ? "NULL" : value;
			debug(`Mapping ${utmParam} to ${marketoField}: ${params[marketoField]}`);
		}

		// Add TDCS data
		params.tdcs = btoa(JSON.stringify(visitorAttributes)) || '';

		form.addHiddenFields(params);
		debug('Hidden fields added to Marketo form');

		// Add UTMs to _mktoReferrer param
		const nativeGetValues = form.getValues;

		form.onSubmit(function(submittingForm) {
			submittingForm.getValues = function() {
				const values = nativeGetValues();

				// Define UTM parameters in the desired order
				const orderedUtmParams = [
					'utm_source',
					'utm_medium',
					'utm_campaign',
					'utm_content',
					'utm_term',
					'utm_adgroup',
					'utm_keyword'
				];

				// Create a URL object from the current page URL
				const url = new URL(document.location.href);

				// New URL to build with updated UTM parameters
				const newUrl = new URL(url.origin + url.pathname);

				// Copy non-UTM parameters to the new URL
				url.searchParams.forEach((value, key) => {
					if (!key.toLowerCase().startsWith('utm_')) {
						newUrl.searchParams.append(key, value);
					}
				});

				// Add UTM parameters in the specified order, prioritizing visitorAttributes
				orderedUtmParams.forEach(param => {
					const value = visitorAttributes[param] || getParameterCaseInsensitive(url, param);
					if (value) {
						newUrl.searchParams.append(param, value);
					}
				});

				// Preserve the hash
				newUrl.hash = url.hash;

				// Override the _mktoReferrer value with the modified URL
				Object.defineProperty(values, "_mktoReferrer", {
					value: newUrl.toString(),
					enumerable: true
				});

				debug('Modified _mktoReferrer value:', values._mktoReferrer);

				return values;
			};
		});
	});
} else {
	debug('MktoForms2 not detected');
}