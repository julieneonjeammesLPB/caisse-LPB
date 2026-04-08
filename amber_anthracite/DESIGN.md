# Design System Strategy: The Artisan Terminal

## 1. Overview & Creative North Star
**The Creative North Star: "The Digital Sommelier"**
This system is designed to bridge the gap between the rugged, tactile reality of outdoor events and the precision of high-end hospitality. We are moving away from the "industrial utility" of standard POS systems toward a "Digital Sommelier" aesthetic—an interface that feels as curated and high-quality as a craft amber ale.

To break the "template" look, we utilize **Asymmetric Weighting**. By placing the heavy `inverse_surface` (Anthracite) cart panel against the airy `surface` (Light Grey) product grid, we create a functional tension that guides the eye immediately to the checkout action. We prioritize "breathable" layouts, using generous white space to ensure that even in a high-pressure outdoor environment, the interface remains calm and impossible to mis-tap.

---

## 2. Colors: Tonal Depth & Warmth
Our palette is rooted in the contrast between sun-drenched ambers and cool, architectural greys.

*   **Primary (`#825100` / Ambre):** Used exclusively for "The Golden Path"—the primary actions like 'Pay' or 'Confirm'. It mimics the glow of a glass of beer against the light.
*   **Surface Hierarchy (The "No-Line" Rule):** 
    *   **Prohibition:** 1px solid borders are strictly forbidden for sectioning. 
    *   **The Rule:** Boundaries must be defined through background shifts. A `surface_container_lowest` card (Pure White) must sit atop a `surface_container_high` (`#e8e8e4`) background to create definition.
*   **Surface & Nesting:** Use the `surface_container` tiers to create a physical sense of "nesting." The main background uses `surface`. The product grid areas use `surface_container_low`. Individual product cards use `surface_container_lowest` to "pop" forward toward the user.
*   **The "Glass & Gradient" Rule:** For floating modals or "Top Sellers" overlays, use semi-transparent `surface_bright` with a `backdrop-filter: blur(12px)`. Main CTAs should utilize a subtle linear gradient from `primary` to `primary_container` (top-to-bottom) to give the button a slight convex, tactile feel.

---

## 3. Typography: Editorial Precision
The system pairs the geometric friendliness of **Outfit** with the technical rigor of **DM Mono**.

*   **Outfit (Brand & Interaction):** Used for all UI labels, navigation, and product names. It feels modern and approachable.
    *   *Display-Lg/Md:* For high-impact branding or "Total Amount" moments.
    *   *Title-Md:* For product names on cards.
*   **DM Mono (The Ledger):** Reserved strictly for "Quantities" and "Prices." 
    *   By using a monospaced font for numbers, we align decimals perfectly in lists, conveying a sense of mathematical "ticket" precision and trustworthiness. 
    *   Use `label-md` in `DM Mono` for all price tags.

---

## 4. Elevation & Depth
We eschew traditional drop shadows in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface_container_lowest` card on a `surface_container_high` background provides enough contrast to imply elevation without a single pixel of shadow.
*   **Ambient Shadows:** Where a floating effect is required (e.g., a "Modify Item" drawer), use a shadow with a 32px blur, 0% spread, and 6% opacity, using the `on_surface` color as the base. It should feel like a soft glow, not a dark smudge.
*   **The "Ghost Border" Fallback:** In high-glare outdoor environments where contrast is failing, use a "Ghost Border": the `outline_variant` token at **15% opacity**. This provides a hint of structure while maintaining the "No-Line" philosophy.

---

## 5. Components

### Buttons: Tactile Anchors
*   **Primary:** `primary` background, `on_primary` text. Height: 56px minimum for thumb-optimized tapping. 14px rounded corners (`xl` scale).
*   **Secondary:** `secondary_container` background. No border.
*   **Tertiary:** Transparent background with `primary` text. Use for "Cancel" or "Back" actions.

### Product Cards
*   **Structure:** No dividers. Use `surface_container_lowest` background. 
*   **Interaction:** On press, the card should scale down slightly (98%) and shift to `surface_container_highest` to provide haptic-like visual feedback.

### The Cart (Structure & Panneau)
*   **Visuals:** Use `inverse_surface` (Anthracite) to create a distinct functional zone. 
*   **Nesting:** Items inside the cart should use `surface_variant` at 5% opacity to separate individual line items without using lines.

### Inputs & Search
*   **Style:** Minimalist. A simple `surface_container_highest` pill-shaped container.
*   **Focus State:** Instead of a thick border, increase the background brightness to `surface_bright` and add a subtle `primary` outer glow (4px blur).

---

## 6. Do's and Don'ts

### Do:
*   **Use Generous Spacing:** Use the `xl` (24px) spacing for gutters between cards. Outdoor usage requires a "fat-finger" margin of error.
*   **Respect the Mono:** Always use `DM Mono` for prices. It is our "Functional Signature."
*   **Layer with Color:** Use background shifts to define "Active" vs "Inactive" states.

### Don't:
*   **No Hairlines:** Never use a #000 1px border. It breaks the premium "editorial" feel of the system.
*   **No Clutter:** If a screen feels full, increase the container size rather than shrinking the text.
*   **No Grey Shadows:** Never use pure `#000000` or `#888888` for shadows. Always tint your shadows with the `on_surface` color for a natural, atmospheric look.