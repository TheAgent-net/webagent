---
url: https://app.corgi.insure/quote/products
title: Quote app product flow | Corgi
description: Logged-in quote app on app.corgi.insure. Stage package, then products, then company. Walked once after sign-in. Not a Firecrawl page.
status: 200
---

# Quote app product flow

The public marketing site links to sign-up. After an account, the quote app is on app.corgi.insure.

The products page is behind that account wall. Sign in or sign up at https://app.corgi.insure/sign-up.

## Package selection

URL: https://app.corgi.insure/quote/package-selection

Question: What stage is your company at?

- Pre-Seed & Seed: CGL, D&O, Tech E&O, Cyber
- Series A: those lines plus Media Liability and EPLI
- Growth: those lines plus Fiduciary

## Products

URL: https://app.corgi.insure/quote/{id}/products

Question: Which insurance suits your business?

Tabs: Pre-Seed & Seed | Series A | Growth Stage | Custom

Instant coverage. Bind online in minutes. Toggle products. Continue with N coverages.

Core lines with an instant quote:

- Commercial General Liability (CGL)
- Directors & Officers (D&O)
- Tech E&O
- Cyber Liability
- Fiduciary
- Hired & Non-Owned Auto
- Media Liability
- Employment Practices Liability (EPLI)

Specialized lines:

- Liquor (instant)
- Commercial Auto (1–14 days)
- Workers Comp (1–14 days)
- Excess (1–14 days)
- Medical Malpractice (1–14 days)
- Kidnap & Ransom (1–14 days)

## Company

Next page after products: https://app.corgi.insure/quote/{id}/company/business-address

Fields: street, apt, city, state, zip.

Then organization, financial details, and structure.

## Full nav

Welcome → Package Selection → Choose Product(s) → Company (Business Address, Organization, Financial Details, Structure) → Coverage Forms → Claims History → Notices & Signatures → Extra Coverages → Endorsements → Summary.

Do not invent a quote id. Point the founder at package selection, then products.
