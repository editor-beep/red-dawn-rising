# Red Dawn Rising — Complete Story Choice & Path Map

Source of truth: `artifacts/red-dawn-rising/src/data/gameData.ts` (scene graph), plus `artifacts/red-dawn-rising/src/hooks/useGame.tsx` (runtime progression/unlock checks).

## Global structure
- **Acts 1–4**: shared trunk with branching outcomes.
- **Act 5**: 4 major endings (`e1`–`e4`).
- **Secret ending (`e5`)**: unlocked after all four major endings.

---

## Mainline trunk with branch points
1. `scene-1` After the Crackdown
   - Contact Elena → `scene-2`
   - Disappear 30 days → `scene-2` (+`careful_approach`)
   - Go to press (die roll):
     - 1–3 → `scene-1-arrest` (restart)
     - 4–6 → `scene-2` (+`public_profile`)

2. `scene-2` Building the Cell (name/focus choice)
   - Worker / Action / Info focus → all to `scene-3` with different flags + Means.

3. `scene-3` First Contact (Gregor)
   - Accept → `scene-4` (+Means, `accepted_gregor`)
   - Decline → `scene-4` (`declined_gregor`)
   - Demand proof (die roll)
     - 1–3 → `scene-3-gregor-walks` → `scene-4` (`declined_gregor`)
     - 4–6 → `scene-3-gregor-reveals` → `scene-4` (+Means, `accepted_gregor`)

4. `scene-4` Recruitment
   - Recruit Mike (die)
   - Recruit Fatima (die)
   - Recruit Ghost (direct)
   - Fail routes pass through `scene-4-fail` then converge to `scene-5`.
   - Success routes set recruit flags and also converge to `scene-5`.

5. `scene-5` Safehouse
   - Warehouse (requires 200 Means) → `scene-6`
   - Farmhouse (die): fail/success sub-scenes, both converge to `scene-6`
   - Forged lease (requires `forged_docs`) → `scene-6`

6. `scene-6` Pamphlet Drop (die)
   - Fail → `scene-6-fail` → `scene-7`
   - Partial → `scene-6-partial` → `scene-7`
   - Success → `scene-6-success` → `scene-7` (+`op1_success`)

7. `scene-7` Funding
   - Crowdfund → `scene-8`
   - Donor (requires Fatima) → `scene-8`
   - Payroll heist (requires `weapons_cache`, die) → fail/success scenes then `scene-8`
   - Skip risk → `scene-8`

8. `scene-8`/`scene-9`/`scene-10`
   - `scene-9`: Elena vs Darius vs Mediate(die).
   - `scene-10` datacenter:
     - Remote hack requires `encrypted_comms`.
     - Physical infiltration uses skill check (success/partial/fail scenes) then converges to `scene-11`.

9. `scene-11` to `scene-17`
   - Mostly linear progression with key branch points:
   - `scene-12`: inner-circle recruit (Alex/Nadia/Luis/secret Alex dialogue/reject Alex).
   - `scene-13`: go dark / trap(die) / Cipher clue / armed confrontation.
   - `scene-14`: unify vs decentralize vs absorb (propaganda press gate).
   - `scene-15`: arm movement vs nonviolent vs defensive.
   - `scene-17`: publish leak (die) vs hold as blackmail.

10. `scene-18` A Comrade Falls
   - Assume surveillance tech → `scene-19`
   - Suspect Alex (if `has_alex`, die)
     - wrong move subpath
     - confirmed subpath (sets stronger anti-Alex trajectory)
   - Suspect Ghost → `scene-19`

11. `scene-19` → `scene-24`
   - Mostly converges through crisis meeting, point of no return, Operation Red Dawn, and operation outcome die roll:
   - `scene-22` die:
     - fail → `scene-23-fail`
     - partial → `scene-23-partial`
     - success → `scene-23-success` (+`op_success`)
   - all converge to `scene-24` then `scene-25`.

---

## Final branch hub (`scene-25`) → Ending arcs
- **Victory path**: “Stand your ground at Capitol” (requires `op_success`) → `e1-1`→`e1-5` unlock **Ending e1: The Long March**.
- **Martyr/Capture path**: “Surrender…” (requires `lead_front`) OR “Fight to the bitter end” → `e2-1`→`e2-5` unlock **Ending e2: The Cage**.
- **Exile path**: “Flee country” (requires `forged_docs`) → `e3-1`→`e3-5` unlock **Ending e3: The Exile**.
- **Betrayal/Vengeance path**: “Purge traitor inside” (requires `suspect_alex`) → `e4-1`→`e4-5` unlock **Ending e4: The Poison**.

All ending chains are linear within their own arc.

---

## Secret route (post-completion)
- After unlocking **all four** major endings, secret start becomes available:
- `secret-1` → `secret-2` → `secret-3` → `secret-4` → `secret-5`
- Unlocks **Ending e5: The Means Was the Movement**.

---

## Choice gates / key requirements checklist
- **Items that gate major options**: `forged_docs`, `encrypted_comms`, `weapons_cache`, `propaganda_press`.
- **Flags that gate major options**: `has_fatima`, `has_alex`, `suspect_alex`, `op_success`, `lead_front`, `manifesto_secret_dialogue`, `cipher_foreshadowing`.
- **RNG-heavy nodes**: scenes 1, 3, 4, 5, 6, 7 (heist), 9 (mediate), 13 (trap), 17 (publish), 18 (suspect Alex), 22 (final op).
- **Convergence pattern**: many branches alter resources/flags/journal/surveillance, but converge back to a shared spine before `scene-25`.
