# Red Dawn Rising — Complete Story Choice & Path Map

Source of truth: `artifacts/red-dawn-rising/src/data/gameData.ts` (scene graph), plus `artifacts/red-dawn-rising/src/hooks/useGame.tsx` (runtime progression/unlock checks).

## Global structure
- **Acts 1–4**: shared trunk with branch spikes that generally reconverge.
- **Act 5**: four major ending arcs (`e1`–`e4`).
- **Secret ending (`e5`)**: unlocked after all four major endings are recorded.

---

## Full storyline map (choice → full path)

### Act 1
1. `scene-1` After the Crackdown
   - Contact Elena → `scene-2`
   - Disappear 30 days (+`careful_approach`) → `scene-2`
   - Go public (die)
     - 1–3 → `scene-1-arrest` → Restart → `scene-1`
     - 4–6 (+`public_profile`) → `scene-2`

2. `scene-2` Building the Cell
   - Red Collective (+`focus_worker`) → `scene-3`
   - Liberation Front (+`focus_action`) → `scene-3`
   - People's Network (+`focus_info`) → `scene-3`

3. `scene-3` First Contact
   - Accept Gregor (+`accepted_gregor`) → `scene-4`
   - Decline Gregor (+`declined_gregor`) → `scene-4`
   - Demand proof (die)
     - 1–3 → `scene-3-gregor-walks` (+`declined_gregor`) → `scene-4`
     - 4–6 → `scene-3-gregor-reveals` (+`accepted_gregor`) → `scene-4`

4. `scene-4` Recruitment Drive
   - Recruit Mike (die)
     - 1–3 → `scene-4-fail` → `scene-5-fractured-route` (+`recruitment_stumble`) → `scene-5`
     - 4–6 → `scene-4-mike-success` (+`has_mike`, +`logistics_pipeline`) → `scene-5-mike-route` → `scene-5`
   - Recruit Fatima (die)
     - 1–3 → `scene-4-fail` → `scene-5-fractured-route` (+`recruitment_stumble`) → `scene-5`
     - 4–6 → `scene-4-fatima-success` (+`has_fatima`, +`media_cover`) → `scene-5-fatima-route` → `scene-5`
   - Recruit Ghost → `scene-5-ghost-route` (+`has_ghost`, +`ghost_protocols`) → `scene-5`

### Act 2
5. `scene-5` Safehouse
   - Warehouse (needs 200 Means) → `scene-6`
   - Farmhouse (die)
     - fail → `scene-5-farm-blown` → `scene-6`
     - success → `scene-5-farm-success` → `scene-6`
   - Forged lease (needs `forged_docs`) → `scene-6`

6. `scene-6` Pamphlet Drop (die)
   - 1–2 → `scene-6-fail` → `scene-7`
   - 3–4 → `scene-6-partial` → `scene-7`
   - 5–6 → `scene-6-success` (+`op1_success`) → `scene-7`

7. `scene-7` Funding Push
   - Crowdfund → `scene-8`
   - Court donor (needs `has_fatima`) → `scene-8`
   - Payroll heist (needs `weapons_cache`, die)
     - fail → `scene-7-heist-fail` → `scene-8`
     - success → `scene-7-heist-success` → `scene-8`
   - Skip risk → `scene-8`

8. `scene-8` Planning Junction
   - All choices route to ideological split at `scene-9`.

9. `scene-9` Elena vs Darius
   - Back Elena → `scene-10`
   - Back Darius → `scene-10`
   - Mediate (die)
     - fail → `scene-9-mediate-fail` → `scene-10`
     - pass → `scene-10`

10. `scene-10` Datacenter Strike
   - Remote hack (needs `encrypted_comms`) → `scene-11`
   - Physical infiltration (skill check)
     - success → `scene-10-infil-success` → `scene-11`
     - failure → `scene-10-infil-fail` → `scene-11`

### Act 3
11. `scene-11` Consolidation
   - All choices converge forward → `scene-12`.

12. `scene-12` Inner-circle recruitment
   - Recruit Alex (+`has_alex`) → `scene-13`
   - Recruit Nadia (item/condition gated) → `scene-13`
   - Recruit Luis (item/condition gated) → `scene-13`
   - Secret manifesto dialogue (+`manifesto_secret_dialogue`) → `scene-13`
   - Reject Alex path → `scene-12-alex-rejected` → `scene-13`

13. `scene-13` Counter-intel
   - Go dark → `scene-14`
   - Set trap (die)
     - fail/backfire → `scene-13-trap-backfire` → `scene-14`
     - success → `scene-13-sabotage-success` → `scene-14`
   - Follow Cipher clue (+`cipher_foreshadowing`) → `scene-14`
   - Armed confrontation route → `scene-14`

14. `scene-14` Movement structure
   - Unify cells → `scene-15`
   - Decentralize cells → `scene-15`
   - Absorb rival group (gate can involve `propaganda_press`) → `scene-15`

15. `scene-15` Doctrine vote
   - Arm movement → `scene-16`
   - Nonviolent escalation → `scene-16`
   - Defensive posture → `scene-16`

16. `scene-16` Field operation split
   - Medical-centered route → `scene-16-medical` → `scene-17`
   - Luis tactical route (skill outcomes)
     - fail → `scene-16-luis-ambush` → `scene-17`
     - partial → `scene-16-luis-partial` → `scene-17`
     - success → `scene-16-luis-success` → `scene-17`
   - Armed route → `scene-16-armed` → `scene-17`

17. `scene-17` Leak decision (diverse outcomes)
   - Mass print via Propaganda Press → `scene-17-press-fallout` → `scene-18`
   - Secure release via Encrypted Comms (die)
     - fail/sacrifice → `scene-17-source-burned` → `scene-18`
     - otherwise → `scene-17-secure-drop` → `scene-18`
   - Publish widely (die)
     - low roll → `scene-17-source-burned` → `scene-18`
     - high roll → `scene-17-public-backlash` → `scene-18`
   - Keep leak as blackmail → `scene-17-blackmail` → `scene-18`

### Act 4
18. `scene-18` A Comrade Falls
   - Assume surveillance-tech culprit → `scene-19`
   - Suspect Alex (if `has_alex`, die)
     - wrong move → `scene-18-wrong-move` → `scene-19`
     - confirmed → `scene-18-alex-confirmed` / confrontation branch `scene-18-alex-confront` → `scene-19`
   - Suspect Ghost → `scene-19`

19. `scene-19` Retaliation fork
   - Core strategy options converge toward `scene-20`.
   - Vengeance side route can pass through `scene-19-vengeance`, then rejoin mainline.

20. `scene-20` Crisis meeting → `scene-21`

21. `scene-21` Point of no return → `scene-22`

22. `scene-22` Operation Red Dawn (die)
   - fail → `scene-23-fail` → `scene-24`
   - partial → `scene-23-partial` → `scene-24`
   - success (+`op_success`) → `scene-23-success` → `scene-24`
   - armed success variant → `scene-23-armed-success` (+`op_success`) → `scene-24`

23. `scene-24` Final staging → `scene-25`

### Act 5: Ending hub
24. `scene-25` Final choice gate
   - Stand your ground (needs `op_success`) → `e1-1 → e1-2 → e1-3 → e1-4 → e1-5` ⇒ **Ending e1: The Long March**
   - Surrender (needs `lead_front`) OR Fight to the bitter end → `e2-1 → e2-2 → e2-3 → e2-4 → e2-5` ⇒ **Ending e2: The Cage**
   - Flee the country (needs `forged_docs`) → `e3-1 → e3-2 → e3-3 → e3-4 → e3-5` ⇒ **Ending e3: The Exile**
   - Purge traitor inside (needs `suspect_alex`) → `e4-1 → e4-2 → e4-3 → e4-4 → e4-5` ⇒ **Ending e4: The Poison**

### Secret post-completion route
25. Unlocked after all four major endings are completed:
   - `secret-1 → secret-2 → secret-3 → secret-4 → secret-5` ⇒ **Ending e5: The Means Was the Movement**

---

## Gate and requirement checklist
- **Item gates**: `forged_docs`, `encrypted_comms`, `weapons_cache`, `propaganda_press`, plus route-specific item checks in skill scenes.
- **Flag gates**: `has_fatima`, `has_alex`, `suspect_alex`, `op_success`, `lead_front`, `manifesto_secret_dialogue`, `cipher_foreshadowing`.
- **RNG-heavy scenes**: 1, 3, 4, 5, 6, 7, 9, 13, 17, 18, 22.
- **Convergence pattern**: Many side paths alter resources/flags and then merge into the shared spine before `scene-25`.
