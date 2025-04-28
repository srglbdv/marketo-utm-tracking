# UTM Tracking Script for Marketo Forms

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

The Traffic Data Capture Script (TDCS) is a comprehensive JavaScript solution designed to track and capture marketing attribution data for Marketo forms. It automatically collects UTM parameters, click IDs, referrer information, and other traffic sources to provide reliable marketing attribution for your lead generation efforts.

**Author:** Sergei Lebedev  
**Version:** v1.0.1 (2025-04-28)  
**License:** MIT

## Key Features

- 🔍 Captures UTM parameters from URL
- 🔗 Identifies click IDs from 25+ advertising platforms
- 🌐 Detects referrers from 35+ search engines
- 📱 Recognizes traffic from 18+ social networks
- 🔄 Supports cross-domain tracking between primary and secondary domains
- 🍪 Creates first-party cookies for persistent tracking
- 📊 Adds all captured data to Marketo forms as hidden fields
- 📋 Comprehensive debugging capabilities

## Quick Install

1. Download minified version of the script: `tdcs.min.js`

2. Customize the field mapping between UTM parameters and your Marketo form fields:

```javascript
const UTM_FIELDS = {
	'utm_source': 'mkt_utm_source',
	'utm_medium': 'mkt_utm_medium',
	'utm_campaign': 'mkt_utm_campaign',
	'utm_content': 'mkt_utm_content',
	'utm_term': 'mkt_utm_term',
	'utm_adgroup': 'mkt_utm_adgroup',
	'utm_keyword': 'mkt_utm_keyword'
};
```

3. Set your primary domain and secondary domains (if any) for multi-domain tracking:

```javascript
// Configuration variables
const PRIMARY_DOMAIN = 'yourdomain.com';
const SECONDARY_DOMAINS = ['domain2.com', 'domain3.com'];
```

4. Add this script to your website(s) before the closing `</body>` tag:

```html
<script src="path/to/tdcs.min.js"></script>
```

## How It Works

TDCS captures marketing attribution data in the following order of priority:

1. **UTM Parameters**: Captures standard UTM parameters from the URL
2. **Click IDs**: Identifies paid advertising sources through click IDs
3. **Referrer Analysis**: Detects traffic source from the referring URL
4. **Direct Traffic**: Marks as direct when no referrer is present

The script stores all collected data in:
- Session storage (`tdcs` key)
- First-party cookies for cross-session tracking
- Hidden fields in your Marketo forms

## Supported Platforms

### Click IDs
The script can identify paid traffic from various advertising platforms through their click IDs:

| Platform | Click ID Parameter |
|----------|-------------------|
| Google | gclid, cq_gclid, dclid, wbraid, gbraid |
| Microsoft Bing | msclkid |
| Facebook | fbclid |
| Yahoo | yclid |
| Twitter | twclid |
| LinkedIn | li_fat_id |
| TikTok | ttclid |
| Pinterest | pt_id |
| Instagram | igshid |
| Mailchimp | mc_eid |
| HubSpot | hsa_cam |
| And many more... | |

### Search Engines
The script can identify organic traffic from 35+ search engines, including:

- Google
- Bing
- Yahoo
- Yandex
- DuckDuckGo
- Baidu
- Ecosia
- Brave
- AOL
- And many more...

### Social Networks
The script can identify social traffic from 18+ social platforms, including:

- LinkedIn
- Facebook
- Twitter/X
- Instagram
- Pinterest
- Reddit
- YouTube
- TikTok
- Medium
- Quora
- And many more...

## Data Collected

TDCS collects and stores the following information:

- **landing_page**: URL where the visitor first arrived
- **utm_source**: Traffic source (e.g., google, facebook)
- **utm_medium**: Traffic medium (e.g., cpc, email, social)
- **utm_campaign**: Campaign name
- **utm_term**: Keywords associated with the ad
- **utm_content**: Ad content identifier
- **utm_adgroup**: Ad group identifier
- **utm_keyword**: Keyword used in search (for organic traffic)
- **clid**: Click ID from advertising platforms
- **query_params**: All URL parameters from the landing page
- **session_referrer**: Full referring URL
- **is_first_visit**: Boolean indicating if this is the visitor's first visit
- **event_id**: Unique identifier for the session
- **initial_visit_id**: Identifier for the visitor's first visit
- **ga_cookie**: Google Analytics cookie (if present)

## Advanced Features

### Cross-Domain Tracking

TDCS supports tracking visitors across your primary domain and secondary domains.

When a visitor navigates between these domains, TDCS will maintain the attribution data and properly identify internal navigation.

### Search Keyword Extraction

For organic traffic from search engines, TDCS attempts to extract the search keyword when available.

### Debugging

To enable debugging mode, add `#debug` to your URL. This will output detailed logging to the browser console.

## Marketo Integration

TDCS automatically integrates with Marketo forms on your page, adding all collected attribution data as hidden fields.

The script also enhances the `_mktoReferrer` parameter to include UTM information.

## Example Scenarios

### Example 1: Capturing Google Ads Traffic

When a visitor clicks on your Google Ads and lands on your website:

```
https://yourdomain.com/landing-page?gclid=ABC123&utm_campaign=spring_sale
```

TDCS will capture:
- `utm_source`: "google"
- `utm_medium`: "cpc"
- `utm_campaign`: "spring_sale"
- `clid`: "gclid:ABC123"

### Example 2: Tracking Organic Search Traffic

When a visitor finds your site through Google search:

```
Referrer: https://www.google.com/search?q=best+marketing+automation
```

TDCS will capture:
- `utm_source`: "google"
- `utm_medium`: "organic"
- `utm_campaign`: "(not set)"
- `utm_keyword`: "best marketing automation"

### Example 3: Cross-Domain Tracking

When a visitor navigates from your main site to a subdomain:

```
From: yourdomain.com/page
To: app.yourdomain.com/signup
```

TDCS will:
- Recognize this as internal navigation
- Preserve the original attribution data
- Maintain consistent tracking across domains

## Best Practices

1. **Place the script before the closing body tag** to ensure all DOM elements are loaded.
2. **Configure your domains correctly** to enable proper cross-domain tracking.
3. **Use consistent UTM parameters** in your marketing campaigns for accurate attribution.
4. **Check the generated data** using debug mode to verify tracking is working properly.
5. **Create Marketo fields** that match your configured mapping to store the data correctly.

## Troubleshooting

### Script Not Capturing Data

1. Verify the script is properly included on the page
2. Check for JavaScript errors in the console
3. Enable debug mode by adding `#debug` to the URL
4. Ensure Marketo forms are properly initialized

### UTM Parameters Not Being Added to Marketo Forms

1. Verify the field mapping in `UTM_FIELDS` matches your Marketo instance
2. Check that the Marketo form is being detected by the script
3. Look for debug output in the console to identify the issue

### Cross-Domain Tracking Issues

1. Verify your `PRIMARY_DOMAIN` and `SECONDARY_DOMAINS` are configured correctly
2. Check that cookies are not being blocked by browser settings
3. Ensure both domains are loading the TDCS script

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

If you have any questions or suggestions, please open an issue on this repository.

---

&copy; 2025 Sergei Lebedev
