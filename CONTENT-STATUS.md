# Content Verification Record

This file tracks what on the website has been **verified** against an official London Hotel Group source and what still **needs confirmation**. Update it whenever content is replaced.

_Last updated: 28 October 2026 (initial build)._

## Research summary

| Source | Status | Notes |
|---|---|---|
| **lhg.co.uk** (official LHG site) | ❌ **Not accessed** | The build environment's network policy blocked this domain, so **no LHG information has been verified**. Every LHG fact on the site is an editable placeholder. |
| **redcarnationhotels.com** (design reference) | ❌ **Not accessed** | Blocked by the same network policy. The navigation hierarchy was **not** verified against it — see "Navigation" below. Layout ideas follow the brief's description of the reference (full-screen photography, left slide-out menu, nested submenus) rather than an inspection of the live site. |
| Web search results (third-party) | ⚠️ Unverified leads only | Not used on the site. Recorded below so LHG can confirm or discard them. |

### Unverified leads from third-party search results (NOT on the website)

These came from news/trade sites, not from LHG. Do **not** publish them until LHG confirms:

- Hotel Owner (hotelowner.co.uk, "London Hotel Group" tag) describes a London-based operator that owns and operates a portfolio of around 15 hotels across Greater London, with projects in Tooting (aparthotel) and Wembley (modernisation).
- Greenwich local news (greenwich.co.uk) reports LHG acquiring the former Greenwich Magistrates' Court and submitting plans for a ~293-bedroom hotel.
- Several unrelated companies also use the initials "LHG" (e.g. Langham Hospitality Group). Take care not to mix them up.

## Status by area

Legend: ✅ verified · ⚠️ provisional (structure decided, details to confirm) · ⏳ placeholder (awaiting LHG content)

| Area | File | Status | What's needed |
|---|---|---|---|
| Company name "London Hotel Group" / "LHG" | `content/site.json` | ⚠️ | Supplied in the brief; confirm exact legal name for the footer/legal pages. |
| Logo | `content/site.json` → `logo` | ⏳ | **No logo file was attached to the brief** (the three images supplied were design references). A typographic placeholder is shown. Add official SVG/PNG files (dark + light versions). |
| Contact phone, email, address, hours | `content/site.json`, `content/contact.json` | ⏳ | All placeholders. |
| Social media links | `content/site.json` → `social` | ⏳ | Empty, so no icons show. Add verified profile URLs. |
| Hotel names, locations, descriptions, amenities | `content/properties.json` | ⏳ | Six placeholder entries ("Hotel One"…"Hotel Six"). Replace with the real portfolio; add/remove entries as needed. |
| Services / business areas | `content/services.json`, `content/homepage.json` → `services` | ⏳ | Four placeholder "Service Area" entries. Only list services LHG confirms. |
| Company overview, history, values, leadership | `content/about.json`, `content/pages.json` | ⏳ | Placeholders. No history, figures or awards have been stated. |
| Homepage copy | `content/homepage.json` | ⏳ | Headline is the brief's suggested line; paragraphs are placeholders. `about.highlights` is intentionally empty (add verified figures only). |
| Social Responsibility (all 6 pages) | `content/social-responsibility.json` | ⏳ | **Proposed** content sections from the brief — not statements about LHG's actual initiatives. |
| Offers, Dining, Meetings & Events, Experiences pages | `content/pages.json` | ⏳ | Created to mirror the reference site's navigation pattern. Remove any that don't apply to LHG. |
| News, Careers, Press | `content/pages.json` | ⏳ | Placeholders. |
| Privacy, Cookie, Terms, Accessibility | `content/legal.json` | ⏳ | Suggested headings only. **Must be replaced by text approved by LHG's legal advisers before launch.** |
| Photography | `public/images/placeholders/` | ⏳ | Illustrated placeholders generated for this build. Replace with LHG-owned photography. |

## Navigation

`content/navigation.json` is marked `"status": "provisional"`.

Because redcarnationhotels.com could not be inspected, the structure below is modelled on menu labels that appeared in web-search snippets of Red Carnation group and hotel pages ("Our hotels", "Offers", "Dining & Drinks", "Wellness", "Discover", "Contact"), adapted for a corporate group site, **with Gift Vouchers excluded** and **Social Responsibility added**, per the brief. It has not been checked against the live reference, and the submenu items in particular are suggestions.

```
Our Hotels ─┬─ All Hotels
            └─ Browse by Hotel ── (generated automatically from properties.json)
Offers ─────┬─ All Offers · Seasonal Offers · Stay Longer
Dining & Drinks ── Restaurants & Bars · Afternoon Tea · Private Dining
Meetings & Events ── Meetings & Conferences · Celebrations · Private Hire
Experiences ── Wellness · Neighbourhood Guides
Discover ───┬─ About LHG ── Overview · Our Story · Our Values · Leadership
            ├─ Services
            ├─ News
            └─ Careers
Social Responsibility ── Overview · Our Commitment · Sustainability ·
                         Community & Partnerships · People & Wellbeing ·
                         Responsible Operations
Contact ── Contact Us · Press & Media · Careers
```

**To finalise:** once the reference site can be reviewed, compare its menu with this tree and edit `content/navigation.json` (no code changes needed). Then set `"status": "verified"`.

## Before launch checklist

- [ ] Replace every item marked ⏳ above
- [ ] Add the official logo files
- [ ] Have legal pages approved
- [ ] Configure enquiry delivery (`CONTACT_WEBHOOK_URL` or Resend variables) and send a test enquiry
- [ ] Set `"showContentStatusNotices": false` in `content/site.json` to remove the draft banners
- [ ] Set `ALLOW_INDEXING=true` and `NEXT_PUBLIC_SITE_URL` on the production deployment only
