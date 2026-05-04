import { Item, Card } from '../types';

export const ALLY_NAMES = ['elena', 'darius', 'mike', 'fatima', 'ghost'] as const;

export const STORE_ITEMS: Item[] = [
  {
    id: "encrypted_comms",
    name: "Encrypted Comms Device",
    cost: 300,
    description: "Reduces surveillance risk and unlocks secure remote operations; better odds on coordinated strikes"
  },
  {
    id: "forged_docs",
    name: "Forged Documents",
    cost: 500,
    description: "Enables identity changes and exile routes; unlocks civilian cover and safe-house options"
  },
  {
    id: "safe_house_upgrade",
    name: "Safe House Upgrade",
    cost: 400,
    description: "Fortifies against raids for 3 protected scenes; grants skill-check bonuses"
  },
  {
    id: "medical_supplies",
    name: "Medical Supplies",
    cost: 200,
    description: "Saves a comrade in critical moments; unlocks Nadia's recruitment and field medic options"
  },
  {
    id: "weapons_cache",
    name: "Weapons Cache",
    cost: 600,
    description: "Unlocks armed confrontation paths and Luis's recruitment — higher risk, higher reward"
  },
  {
    id: "propaganda_press",
    name: "Propaganda Press",
    cost: 350,
    description: "Generates Means and public support; unifies fractured cells; improves leak outcomes"
  }
];

export const DECK: Card[] = [
  { id: "c1", name: "The Vanguard", effectDescription: "+1 to next die roll (stacks)" },
  { id: "c2", name: "The Informant", effectDescription: "Escalating intel about the traitor in your ranks" },
  { id: "c3", name: "The Proletariat", effectDescription: "Gain 80 Means; solidarity dividend" },
  { id: "c4", name: "The Manifesto", effectDescription: "Unlocks secret dialogue + growing support" },
  { id: "c5", name: "The Strike", effectDescription: "+100 Means; worker uprising pays off" },
  { id: "c6", name: "The Apparatus", effectDescription: "The state is watching; -1 to next die roll" },
  { id: "c7", name: "The Martyr", effectDescription: "A comrade is lost; lose one item from your inventory" },
  { id: "c8", name: "The Barricade", effectDescription: "Gain protection; safe from negative events for 2 scenes" },
  { id: "c9", name: "The Cipher", effectDescription: "Successive fragments of a larger warning" },
  { id: "c10", name: "Red Dawn", effectDescription: "All Means costs reduced by 50% for this scene" },
  { id: "c11", name: "The Cell", effectDescription: "Strengthen the network (+15 ally trust)" },
  { id: "c12", name: "Propaganda Drop", effectDescription: "+60 Means and minor surveillance drop (-10%)" },
  { id: "c13", name: "The Mole", effectDescription: "Risky high-reward intel — success or betrayal" },
  { id: "c14", name: "Sabotage", effectDescription: "Disrupt state operations (story impact)" },
  { id: "c15", name: "The Theorist", effectDescription: "Analytical edge gained; +1 to next die roll" },
];

export type SceneChoice = {
  text: string;
  nextSceneId?: string;
  condition?: {
    flag?: string;
    flags?: string[];
    item?: string;
    missingFlag?: string;
    missingItem?: string;
    minMeans?: number;
  };
  effects?: {
    means?: number;
    surveillance?: number;
    addFlags?: string[];
    removeFlags?: string[];
    addItems?: string[];
    removeItems?: string[];
    addJournalEntries?: string[];
    protectedScenesRemaining?: number;
    combatBonus?: number;
  };
  dieRoll?: {
    outcomes: Record<number, string>;
    modifier?: number;
  };
  skillCheck?: {
    target: number;
    itemBonuses?: Record<string, number>;
    successScene: string;
    failureScene: string;
    partialScene?: string;
    partialTarget?: number;
  };
};

export type Ending = {
  id: string;
  codename: string;
  title: string;
  description: string;
};

export const ENDINGS: Ending[] = [
  { id: 'e1', codename: 'I.', title: 'The Long March', description: 'A new dawn. The state falls; the workers win.' },
  { id: 'e2', codename: 'II.', title: 'The Cage', description: 'Captured. The man is silenced; the idea is not.' },
  { id: 'e3', codename: 'III.', title: 'The Exile', description: 'A flame carried across the ocean.' },
  { id: 'e4', codename: 'IV.', title: 'The Poison', description: 'Betrayed from within. Survival, not victory.' },
  { id: 'e5', codename: 'V.', title: 'The Means Was the Movement', description: '[CLASSIFIED]' },
];

export const SECRET_ENDING_ID = 'e5';
export const SECRET_START_SCENE = 'secret-1';

export type Scene = {
  id: string;
  act: number;
  title: string;
  text: string[];
  choices: SceneChoice[];
  unlocksEnding?: string;
  autoDrawCards?: number;
  falloutCards?: number;
  autoEffects?: {
    means?: number;
    surveillance?: number;
    addFlags?: string[];
    addJournalEntries?: string[];
  };
  conditionalText?: Array<{ flag: string; paragraph: string }>;
};

export const SCENES: Record<string, Scene> = {
  "scene-1": {
    id: "scene-1",
    act: 1,
    title: "After the Crackdown",
    text: [
      "The scene opens with you staring at your reflection in a puddle. Water. Your blood. You think about the factory — the day they locked the gates with two weeks' notice. Six hundred jobs gone in an afternoon. Six hundred families left scrambling to pay rent, staring down the barrel of a Midwest winter without heat.",
      "You organized the rally tonight because someone had to. You expected tear gas, maybe batons. You didn't expect the coordinated, militarized sweep that cornered you in the plaza. They sent riot police from three different precincts. Forty-seven arrested. Three hospitalized. The state has shown you its face, stripped of the smiling PR masks.",
      "The time for petitions is over. The system is functioning exactly as it was designed to. You wipe the blood from your brow, feeling the sting of the cold wind off Lake Michigan. Your phone has been on airplane mode for six hours to avoid cell-tower tracking.",
      "It is 2 AM. The city is quiet, but it's a deceptive quiet. The kind of quiet that follows a gunshot. You have to make a decision."
    ],
    choices: [
      { text: "Contact Elena. Start the cell tonight.", nextSceneId: "scene-2" },
      { text: "Disappear for 30 days. Plan carefully.", nextSceneId: "scene-2", effects: { addFlags: ["careful_approach"] } },
      { text: "Go to the press. Go public.", dieRoll: { outcomes: { 1: "scene-1-arrest", 2: "scene-1-arrest", 3: "scene-1-arrest", 4: "scene-2", 5: "scene-2", 6: "scene-2" } }, effects: { addFlags: ["public_profile"] } }
    ]
  },
  "scene-1-arrest": {
    id: "scene-1-arrest",
    act: 1,
    title: "Arrested Early",
    text: [
      "You went to the press. You thought transparency would be your shield. But the police were waiting outside the Tribune building.",
      "They didn't even read you your rights. Just threw you in the back of an unmarked van. The movement ends before it begins."
    ],
    choices: [{ text: "Restart", nextSceneId: "scene-1", effects: { removeFlags: ["public_profile"] } }]
  },
  "scene-2": {
    id: "scene-2",
    act: 1,
    title: "Building the Cell",
    text: [
      "Setting: Elena's apartment. Three people around a kitchen table. You, Elena Vasquez—a trauma nurse and hardened union organizer—and Darius King, a software engineer who left big tech after whistleblowing on their surveillance contracts. The Movement begins here.",
      "The blinds are drawn. The radio is playing low static to muffle the conversation. Elena is patching up your forehead while Darius pulls the batteries out of everyone's phones.",
      "'We can't just be an angry mob anymore,' Elena says, tying off the bandage. 'If we're going to strike back, we need structure. We need a name. We need a target.'",
      "Darius nods. 'And we need to decide how we're going to hit them. Do we go after their infrastructure? Do we organize the workers? Or do we take the fight directly to their front doors?'"
    ],
    choices: [
      { text: "Name it 'The Red Collective' — focus on worker organization", nextSceneId: "scene-3", effects: { means: 50, addFlags: ["focus_worker"] } },
      { text: "Name it 'Liberation Front' — focus on direct action", nextSceneId: "scene-3", effects: { means: 30, addFlags: ["focus_action"] } },
      { text: "Name it 'The People's Network' — focus on info warfare", nextSceneId: "scene-3", effects: { means: 40, addFlags: ["focus_info"] } }
    ],
    autoDrawCards: 2,
    autoEffects: {
      addJournalEntries: [
        "Elena Vasquez — trauma nurse and union organizer, founding cell member.",
        "Darius King — whistleblower software engineer, founding cell member."
      ]
    }
  },
  "scene-3": {
    id: "scene-3",
    act: 1,
    title: "First Contact",
    text: [
      "It happens three days later. Darius comes to you, screen glowing with an encrypted terminal window. Someone breached his secure sandbox. Not to destroy it, but to drop a message.",
      "A mysterious figure—going by the alias 'Comrade Gregor'—reaches out. The message is brief. He knows who you are. He knows about the factory. And he has resources.",
      "'I can provide funding. Untraceable cryptocurrency. Safe houses. In return, I want nothing,' the message reads. 'Only that you succeed where others have failed.'",
      "Darius is skeptical. 'No one gives away power for free. This feels like a honeypot.' Elena is more pragmatic. 'We have fifty dollars between us, Marco. We can't fight a war on pocket change.'"
    ],
    choices: [
      { text: "Accept Gregor's help.", nextSceneId: "scene-4", effects: { means: 200, addFlags: ["accepted_gregor"] } },
      { text: "Decline. Stay isolated.", nextSceneId: "scene-4", effects: { addFlags: ["declined_gregor"] } },
      { text: "Who are you, really? (Demand proof)", dieRoll: { outcomes: { 1: "scene-3-gregor-walks", 2: "scene-3-gregor-walks", 3: "scene-3-gregor-walks", 4: "scene-3-gregor-reveals", 5: "scene-3-gregor-reveals", 6: "scene-3-gregor-reveals" } } }
    ],
    autoEffects: {
      means: 50,
      addJournalEntries: ["Comrade Gregor — anonymous benefactor, identity unknown. Provides untraceable funding."]
    }
  },
  "scene-4": {
    id: "scene-4",
    act: 2,
    title: "Recruitment Drive",
    text: [
      "Act 2: Build the Cell. Operations can't run out of Elena's kitchen forever. The more noise we make, the closer the hounds get.",
      "You need more people. Trusted people. Darius has vetted three candidates, but approaching them is dangerous. Every conversation is a potential leak.",
      "There's 'Big Mike' Kowalski, a 58-year-old union veteran with deep ties to the logistics network. Fatima Al-Rashid, a 26-year-old independent journalist with access to state media feeds. And 'Ghost', an anonymous hacker who approached Darius directly. Ghost's background is entirely scrubbed."
    ],
    choices: [
      { text: "Recruit 'Big Mike' Kowalski (Union Vet)", dieRoll: { outcomes: { 1: "scene-4-fail", 2: "scene-4-fail", 3: "scene-4-fail", 4: "scene-4-mike-success", 5: "scene-4-mike-success", 6: "scene-4-mike-success" } } },
      { text: "Recruit Fatima Al-Rashid (Journalist)", dieRoll: { outcomes: { 1: "scene-4-fail", 2: "scene-4-fail", 3: "scene-4-fail", 4: "scene-4-fatima-success", 5: "scene-4-fatima-success", 6: "scene-4-fatima-success" } } },
      { text: "Recruit 'Ghost' (Anonymous Hacker)", nextSceneId: "scene-5", effects: { addFlags: ["has_ghost"], addJournalEntries: ["'Ghost' — anonymous hacker, background professionally scrubbed. Origin unknown."] } }
    ]
  },
  "scene-4-fail": {
    id: "scene-4-fail",
    act: 2,
    title: "Recruitment Failed",
    text: [
      "You made the pitch in a noisy diner, sliding the conversation toward radical action. They froze.",
      "'I have kids, Marco,' they said, standing up. 'I can't go to federal prison for a pipe dream.'",
      "You lost time, and you exposed your hand slightly, but they promised not to talk. You hope they keep that promise."
    ],
    choices: [{ text: "Continue", nextSceneId: "scene-5" }]
  },
  "scene-5": {
    id: "scene-5",
    act: 2,
    title: "The Safehouse",
    text: [
      "The kitchen table is no longer viable. Police cruisers have been lingering on Elena's street. You need a physical location to store materials, host secure servers, and sleep without one eye open.",
      "Elena suggests her cousin's abandoned farmhouse downstate—remote, free, but easily surrounded if compromised. Darius found a massive, structurally sound warehouse in Gary, Indiana, but the landlord wants 200 Means upfront.",
      "Alternatively, with the right documents, you could forge a corporate lease in the commercial district. Hiding in plain sight."
    ],
    choices: [
      { text: "Rent a warehouse in Gary (200 Means)", condition: { minMeans: 200 }, nextSceneId: "scene-6", effects: { means: -200, addFlags: ["warehouse_safehouse"], surveillance: 10 } },
      { text: "Use Elena's cousin's farmhouse (Free)", dieRoll: { outcomes: { 1: "scene-5-farm-blown", 2: "scene-5-farm-blown", 3: "scene-5-farm-success", 4: "scene-5-farm-success", 5: "scene-5-farm-success", 6: "scene-5-farm-success" } } },
      { text: "Buy forged lease", condition: { item: "forged_docs" }, nextSceneId: "scene-6", effects: { addFlags: ["forged_safehouse"] } },
      {
        text: "Set up the farmhouse as a field clinic (Medical Supplies)",
        condition: { item: "medical_supplies" },
        nextSceneId: "scene-6",
        effects: {
          addFlags: ["medical_stockpiled", "farm_safehouse"],
          addJournalEntries: ["The farmhouse is now a functioning field clinic. Wounded comrades can recover without hospital exposure."]
        }
      }
    ]
  },
  "scene-6": {
    id: "scene-6",
    act: 2,
    title: "First Operation — The Pamphlet Drop",
    text: [
      "The theory is solid, but the practice is what counts. It's time for the first coordinated operation.",
      "The plan is simple but highly illegal under the new sedition acts. Distribute 50,000 manifestos across five major manufacturing centers in the Midwest simultaneously. A show of strength.",
      "You've mobilized dozens of sympathizers. If this works, the movement shifts from a grievance to a genuine threat. If it fails, the FBI rolls you up."
    ],
    choices: [
      {
        text: "Execute with Encrypted Comms (Coordinated Strike)",
        condition: { item: "encrypted_comms" },
        dieRoll: { outcomes: { 1: "scene-6-fail", 2: "scene-6-partial", 3: "scene-6-success", 4: "scene-6-success", 5: "scene-6-success", 6: "scene-6-success" } },
        effects: { addFlags: ["comms_boost"], addJournalEntries: ["Encrypted Comms kept all five teams synchronized. The state couldn't intercept the signal it couldn't find."] }
      },
      { text: "Execute Operation", dieRoll: { outcomes: { 1: "scene-6-fail", 2: "scene-6-fail", 3: "scene-6-partial", 4: "scene-6-partial", 5: "scene-6-success", 6: "scene-6-success" } } }
    ]
  },
  "scene-6-fail": {
    id: "scene-6-fail",
    act: 2,
    title: "Operation Intercepted",
    text: [
      "The state was waiting. Someone slipped up, or algorithms flagged the chatter.",
      "Police intercepted three of the delivery vans. Elena barely escaped a kettle maneuver. Surveillance is dramatically increased, and paranoia is setting in."
    ],
    choices: [{ text: "Regroup", nextSceneId: "scene-7", effects: { surveillance: 20 } }],
    falloutCards: 1
  },
  "scene-6-partial": {
    id: "scene-6-partial",
    act: 2,
    title: "Partial Success",
    text: [
      "Two factories were reached before corporate security locked down the premises.",
      "The message is out there, circulating in break rooms and union halls, but it lacks the shock-and-awe impact you wanted."
    ],
    choices: [{ text: "Continue", nextSceneId: "scene-7", effects: { means: 30 } }]
  },
  "scene-6-success": {
    id: "scene-6-success",
    act: 2,
    title: "Full Success",
    text: [
      "Flawless execution. Staged out of your safehouse, the teams moved in sync and all five factories were blanketed. The morning shift arrived to find revolutionary literature taped to every locker, machine press, and supervisor door.",
      "The workers are talking. The corporate owners are panicked. The cell gains massive credibility."
    ],
    conditionalText: [
      { flag: "warehouse_safehouse", paragraph: "The Gary warehouse proved its worth immediately: space for vehicles, pallets of pamphlets, and enough room to coordinate launch timing without attracting attention." },
      { flag: "farm_safehouse", paragraph: "The farmhouse's isolation bought you the setup window you needed; by dawn, every route map and drop packet had been staged and dispatched." },
      { flag: "forged_safehouse", paragraph: "The forged commercial lease let you hide in plain sight, turning a legitimate-looking office into a covert dispatch hub for the drop." }
    ],
    choices: [{ text: "Continue", nextSceneId: "scene-7", effects: { means: 100, addFlags: ["op1_success"] } }]
  },
  "scene-7": {
    id: "scene-7",
    act: 2,
    title: "The Money Problem",
    text: [
      "Revolution is expensive. The cell is burning through cash for burner phones, gas, encrypted servers, and food.",
      "You need sustainable funding to escalate. You can crowdfund anonymously through proxy networks—slow but safe. If you have Fatima, she knows a disillusioned tech billionaire who might donate, but it leaves a paper trail.",
      "Or, if you're armed, there's a corporate payroll truck moving untraceable cash across the state line tomorrow. High risk. High reward."
    ],
    choices: [
      { text: "Crowdfund anonymously", nextSceneId: "scene-8", effects: { means: 150 } },
      { text: "Approach sympathetic wealthy donor", condition: { flag: "has_fatima" }, nextSceneId: "scene-8", effects: { means: 400, surveillance: 15 } },
      { text: "Rob a corporate payroll truck", condition: { item: "weapons_cache" }, dieRoll: { outcomes: { 1: "scene-7-heist-fail", 2: "scene-7-heist-fail", 3: "scene-7-heist-fail", 4: "scene-7-heist-success", 5: "scene-7-heist-success", 6: "scene-7-heist-success" } } },
      { text: "Skip high-risk funding", nextSceneId: "scene-8" }
    ]
  },
  "scene-8": {
    id: "scene-8",
    act: 2,
    title: "Encrypted Communications",
    text: [
      "Ghost finishes wiring the secure comms network. For the first time, you tap into the underground frequencies.",
      "The chatter is deafening. There are more cells out there than you thought. They are angry, disorganized, and waiting for a spark.",
      "As you review the incoming traffic, the reality sets in: you are becoming a leader. This is no longer just your fight."
    ],
    choices: [{ text: "Review the intel", nextSceneId: "scene-9" }],
    autoDrawCards: 3,
    autoEffects: {
      addJournalEntries: ["Underground frequency network established. Multiple regional cells confirmed active."]
    }
  },
  "scene-9": {
    id: "scene-9",
    act: 2,
    title: "Growing Pains",
    text: [
      "Internal conflict threatens to tear the cell apart.",
      "Elena thinks you're moving too fast. 'We are risking the lives of working people. We need to build mutual aid networks first.'",
      "Darius violently disagrees. 'Mutual aid won't stop a police baton. We need kinetic action. We need to cripple their infrastructure.'",
      "They both look to you. The leader."
    ],
    choices: [
      { text: "Side with Elena (Slower, Safer)", nextSceneId: "scene-10", effects: { surveillance: -10, addFlags: ["elena_trust"] } },
      { text: "Side with Darius (Faster, Riskier)", nextSceneId: "scene-10", effects: { addFlags: ["darius_trust"] } },
      { text: "Mediate between them", dieRoll: { outcomes: { 1: "scene-9-mediate-fail", 2: "scene-9-mediate-fail", 3: "scene-9-mediate-fail", 4: "scene-10", 5: "scene-10", 6: "scene-10" } } },
      {
        text: "Use the Propaganda Press to reframe the argument as shared purpose",
        condition: { item: "propaganda_press" },
        nextSceneId: "scene-10",
        effects: {
          means: 30,
          addFlags: ["unified_cell", "elena_trust", "darius_trust"],
          addJournalEntries: ["The Propaganda Press helped bridge the divide — both Elena and Darius see their vision in the message. Temporary unity holds."]
        }
      }
    ]
  },
  "scene-10": {
    id: "scene-10",
    act: 2,
    title: "The First Real Mission",
    text: [
      "Target: A Blackrock-owned datacenter in Indianapolis holding automated eviction records for 8,000 families.",
      "If those servers go down, the evictions halt indefinitely. It's a massive escalation.",
      "Ghost says he can wipe it remotely, but only if you have military-grade encrypted comms. Otherwise, you'll have to physically break into the server room to plant a drive."
    ],
    choices: [
      { text: "Hack in remotely", condition: { item: "encrypted_comms" }, nextSceneId: "scene-11", effects: { means: 100, addFlags: ["datacenter_wiped"] } },
      { text: "Physical infiltration (Skill Check)", skillCheck: { target: 9, itemBonuses: { "safe_house_upgrade": 1, "encrypted_comms": 2 }, successScene: "scene-10-infil-success", partialScene: "scene-11", partialTarget: 7, failureScene: "scene-10-infil-fail" }, effects: { means: 50, surveillance: 20 } }
    ],
    autoEffects: { means: 150 }
  },
  "scene-10-fail": {
    id: "scene-10-fail",
    act: 2,
    title: "Infiltration Compromised",
    text: [
      "The security system triggered before you reached the server room. You barely escaped through a maintenance shaft.",
      "The operation is blown. Darius is furious. The datacenter remains online, and now they know someone tried."
    ],
    choices: [{ text: "Regroup", nextSceneId: "scene-11", effects: { surveillance: 25 } }]
  },
  "scene-11": {
    id: "scene-11",
    act: 3,
    title: "Media Attention",
    text: [
      "Act 3: The Movement Grows.",
      "The datacenter operation made national news. Anonymous sources are being quoted in The Intercept and foreign press. The talking heads on cable news are calling you terrorists.",
      "But on the streets? People are smiling. Evictions have stopped in three states. You are no longer a local nuisance; you are a federal priority."
    ],
    choices: [{ text: "Prepare for the next phase", nextSceneId: "scene-12" }]
  },
  "scene-12": {
    id: "scene-12",
    act: 3,
    title: "Vetted Member Suggestions",
    text: [
      "Darius slides a card across the table: three vetted member suggestions for one open inner-circle seat.",
      "Alex Mercer — former military, disciplined, and excellent at counter-surveillance. His paperwork is sparse, but every reference checks out.",
      "Nadia Kline — Cleveland transit union organizer trusted by two partner cells, with a talent for moving people and supplies quietly.",
      "Luis Ortega — Phoenix community medic with deep tenant-network ties, known for keeping teams steady under pressure.",
      "You can only elevate one candidate now. Whoever you choose will shape the core team going into the federal crackdown."
    ],
    choices: [
      { text: "Elevate Alex Mercer to the inner circle", nextSceneId: "scene-13", effects: { addFlags: ["has_alex", "alex_trusted"] } },
      { text: "Elevate Alex, but keep him compartmentalized", nextSceneId: "scene-13", effects: { addFlags: ["has_alex", "alex_suspected"] } },
      {
        text: "Elevate Nadia Kline — your medical network made the connection possible",
        condition: { item: "medical_supplies" },
        nextSceneId: "scene-13",
        effects: {
          addFlags: ["has_nadia", "nadia_recruited"],
          addJournalEntries: ["Nadia Khalil, former ER trauma nurse, has joined us. Her hands are steady even when everything else isn't."],
          surveillance: 5
        }
      },
      {
        text: "Elevate Luis Ortega (Ex-Special Forces) — your weapons network introduced you",
        condition: { item: "weapons_cache" },
        nextSceneId: "scene-13",
        effects: {
          addFlags: ["has_luis", "luis_recruited"],
          addJournalEntries: ["Luis Ortega has joined the cell. His eyes carry the weight of someone who's seen too much."],
          surveillance: 15
        }
      },
      {
        text: "Use the Manifesto backchannel: ask Ghost what Alex's scrubbed file is hiding (Secret Dialogue)",
        condition: { flag: "manifesto_secret_dialogue" },
        nextSceneId: "scene-13",
        effects: {
          addFlags: ["has_alex", "alex_suspected", "suspect_alex"],
          removeFlags: ["manifesto_secret_dialogue"],
          addJournalEntries: [
            "Secret Dialogue — Ghost confirms Alex's scrub pattern matches federal counterintelligence sanitization. No hard proof, but enough to treat him as an active risk."
          ]
        }
      },
      { text: "Reject Alex for now and keep all three on probation", nextSceneId: "scene-12-alex-rejected", effects: { addFlags: ["alex_suspected"] } }
    ],
    autoDrawCards: 3,
    autoEffects: {
      addJournalEntries: [
        "Recruitment card reviewed: Alex Mercer (counter-surveillance), Nadia Kline (union logistics), Luis Ortega (field medic).",
        "Inner-circle seat filled from vetted shortlist under heightened federal pressure."
      ]
    }
  },
  "scene-13": {
    id: "scene-13",
    act: 3,
    title: "The FBI Tail",
    text: [
      "You notice surveillance. It starts subtle—a dark sedan parked a block too far from the coffee shop. The same face reading a newspaper on the subway two days in a row.",
      "They are getting close. The federal net is tightening.",
      "You can go completely dark and halt operations, lay a trap to burn the surveillance, or, if you're armed, confront them directly to send a message."
    ],
    choices: [
      { text: "Go dark for 2 weeks", nextSceneId: "scene-14", effects: { surveillance: -30, means: -100, addFlags: ["went_dark"] } },
      { text: "Lay a trap with false intel", dieRoll: { outcomes: { 1: "scene-13-trap-backfire", 2: "scene-13-trap-backfire", 3: "scene-13-trap-backfire", 4: "scene-14", 5: "scene-14", 6: "scene-14" } } },
      {
        text: "Follow the Cipher clue: track 'the smiling one' instead of the car (Foreshadowing)",
        condition: { flag: "cipher_foreshadowing" },
        nextSceneId: "scene-14",
        effects: {
          surveillance: -10,
          addFlags: ["suspect_alex"],
          removeFlags: ["cipher_foreshadowing"],
          addJournalEntries: [
            "Foreshadowing Paid Off — The Cipher points to an insider profile, not external surveillance. You begin actively screening Alex for provocation patterns."
          ]
        }
      },
      {
        text: "Armed reconnaissance — flush the tail before they close in",
        condition: { item: "weapons_cache" },
        dieRoll: { outcomes: { 1: "scene-13-trap-backfire", 2: "scene-13-trap-backfire", 3: "scene-13-trap-backfire", 4: "scene-14", 5: "scene-14", 6: "scene-14" } },
        effects: { addFlags: ["armed_scout"], addJournalEntries: ["Armed recon team deployed. The tail was burned, but at the cost of further escalation."] }
      },
      { text: "Confront them directly", condition: { item: "weapons_cache" }, nextSceneId: "scene-14", effects: { surveillance: 40, addFlags: ["fbi_confronted"] } },
      {
        text: "Launch a targeted sabotage using gathered intel",
        condition: { flag: "cipher_foreshadowing" },
        nextSceneId: "scene-13-sabotage-success",
        effects: { surveillance: -20, addFlags: ["sabotage_boost"] }
      },
      {
        text: "Use The Theorist's strategic analysis to counter the tail",
        condition: { flag: "theorist_insight" },
        dieRoll: { outcomes: { 1: "scene-13-trap-backfire", 2: "scene-13-trap-backfire", 3: "scene-14", 4: "scene-14", 5: "scene-14", 6: "scene-14" } }
      }
    ],
    falloutCards: 1
  },
  "scene-14": {
    id: "scene-14",
    act: 3,
    title: "Coalition Building",
    text: [
      "Three other regional cells have reached out. They want to coordinate. They respect your success.",
      "Do you merge into one unified command structure? It offers exponential growth, but massive exposure if one link breaks.",
      "Or do you stay decentralized, coordinating only loosely?"
    ],
    choices: [
      { text: "Merge — one unified movement", nextSceneId: "scene-15", effects: { means: 300, surveillance: 30, addFlags: ["unified_movement"] } },
      { text: "Stay decentralized", nextSceneId: "scene-15", effects: { surveillance: -10, addFlags: ["decentralized"] } },
      { text: "Absorb them completely under your sole command", condition: { item: "propaganda_press" }, nextSceneId: "scene-15", effects: { means: 500, addFlags: ["unified_movement"] } }
    ]
  },
  "scene-15": {
    id: "scene-15",
    act: 3,
    title: "The Weapons Question",
    text: [
      "The movement is growing, and with growth comes radicalization. Several cells are demanding arms. They argue that the state will use lethal force, and pacifism is suicide.",
      "Elena threatens to walk away if you bring guns into the safehouses. Darius says it's the only way to survive the coming crackdown.",
      "The decision rests with you."
    ],
    choices: [
      {
        text: "Arm the movement",
        condition: { item: "weapons_cache" },
        nextSceneId: "scene-16-armed",
        effects: {
          means: -50,
          surveillance: 50,
          addFlags: ["armed_movement", "armed_path"],
          addJournalEntries: ["The movement has crossed the Rubicon. We are now armed."]
        }
      },
      { text: "Stay non-violent", nextSceneId: "scene-16", effects: { addFlags: ["peaceful_movement", "nonviolent_path"] } },
      { text: "Train defensively only", nextSceneId: "scene-16", effects: { addFlags: ["defensive_path"] } },
      {
        text: "Build a field medicine network under Nadia — protect without arming",
        condition: { flag: "nadia_recruited" },
        nextSceneId: "scene-16-medical",
        effects: { addFlags: ["nonviolent_path", "nadia_network_active"] }
      }
    ]
  },
  "scene-16": {
    id: "scene-16",
    act: 3,
    title: "The Government Leak",
    text: [
      "An anonymous source inside the Department of Homeland Security drops a massive encrypted cache into your servers.",
      "It details Operation BLACKVEIL—a multi-agency program designed to infiltrate leftist movements using deep-cover operatives who act as instigators.",
      "Your blood runs cold. The document profile matches the exact tactics used by someone in your own ranks."
    ],
    choices: [{ text: "Analyze the data in silence", nextSceneId: "scene-17" }],
    autoDrawCards: 4,
    autoEffects: {
      addJournalEntries: ["Operation BLACKVEIL — multi-agency infiltration program using deep-cover instigators. Active within leftist movements."]
    }
  },
  "scene-17": {
    id: "scene-17",
    act: 3,
    title: "The Propaganda Victory",
    text: [
      "Among the leaked files is undeniable proof of senators trading stocks based on classified strike-breaking legislation.",
      "If you publish this, the public outrage will be uncontrollable. But the state will hunt the publisher to the ends of the earth."
    ],
    choices: [
      {
        text: "Mass print and distribute via the Propaganda Press",
        condition: { item: "propaganda_press" },
        nextSceneId: "scene-18",
        effects: {
          means: 80,
          addFlags: ["strong_public_support", "major_leak"],
          addJournalEntries: ["The Propaganda Press ran hot all night. The senators' names are on every wall in the city. The message cannot be suppressed."]
        }
      },
      {
        text: "Secure release via Encrypted Comms",
        condition: { item: "encrypted_comms" },
        dieRoll: { outcomes: { 1: "scene-17-source-burned", 2: "scene-18", 3: "scene-18", 4: "scene-18", 5: "scene-18", 6: "scene-18" } },
        effects: { addFlags: ["secure_leak"] }
      },
      { text: "Publish widely", dieRoll: { outcomes: { 1: "scene-17-source-burned", 2: "scene-17-source-burned", 3: "scene-17-source-burned", 4: "scene-18", 5: "scene-18", 6: "scene-18" } } },
      { text: "Hold the intel as blackmail", nextSceneId: "scene-18" }
    ],
    autoEffects: {
      addJournalEntries: ["Leaked: Senators trading stocks on classified strike-breaking legislation."]
    }
  },
  "scene-18": {
    id: "scene-18",
    act: 3,
    title: "A Comrade Falls",
    text: [
      "It happens at 3 PM on a Tuesday. Darius is arrested leaving a hardware store.",
      "It wasn't a random stop. It was too precise. They knew his aliases. They knew his car. Someone talked.",
      "Paranoia grips the cell. The walls feel incredibly thin."
    ],
    choices: [
      {
        text: "Confront Alex directly — you have the evidence",
        condition: { flag: "suspect_alex" },
        nextSceneId: "scene-18-alex-confront",
        effects: { addJournalEntries: ["Confrontation initiated. Alex cornered with the evidence. There is no going back."] }
      },
      {
        text: "Stabilize the situation with Medical Supplies",
        condition: { item: "medical_supplies" },
        nextSceneId: "scene-19",
        effects: {
          addFlags: ["comrade_saved"],
          removeItems: ["medical_supplies"],
          addJournalEntries: ["Quick medical intervention kept a key comrade out of the hospital. Morale restored — we still have a chance."]
        }
      },
      { text: "Assume it was surveillance tech", nextSceneId: "scene-19", effects: { means: -100 } },
      { text: "Suspect Alex Mercer", condition: { flag: "has_alex" }, dieRoll: { outcomes: { 1: "scene-18-wrong-move", 2: "scene-18-wrong-move", 3: "scene-18-wrong-move", 4: "scene-18-alex-confirmed", 5: "scene-18-alex-confirmed", 6: "scene-18-alex-confirmed" } } },
      { text: "Suspect Ghost", nextSceneId: "scene-19" }
    ],
    falloutCards: 1
  },
  "scene-19": {
    id: "scene-19",
    act: 3,
    title: "The Crisis Meeting",
    text: [
      "The safehouse feels like a tomb. You gather the remaining inner circle.",
      "Your newest inner-circle recruit stands up and delivers a rousing, passionate speech about solidarity, about avenging Darius. It unifies everyone in the room.",
      "Except you. You notice how carefully every word lands. It is too perfect—like it was rehearsed in front of a mirror. Or a handler."
    ],
    conditionalText: [
      { flag: "has_alex", paragraph: "Alex never breaks eye contact while he speaks. Every sentence lands too perfectly, like it was drafted for two audiences." },
      { flag: "has_nadia", paragraph: "Nadia redirects grief into logistics within minutes—safe routes, fallback apartments, dead drops. It is competent enough to be reassuring and unsettling at once." },
      { flag: "has_luis", paragraph: "Luis organizes medical contingencies before anyone asks. The room calms, but you can't tell whether his composure is discipline or distance." }
    ],
    choices: [
      {
        text: "Fortify with the Safe House Upgrade — lock the cell down completely",
        condition: { item: "safe_house_upgrade" },
        nextSceneId: "scene-20",
        effects: {
          surveillance: -20,
          addFlags: ["fortified"],
          protectedScenesRemaining: 3,
          addJournalEntries: ["Safe House Upgrade deployed: reinforced entry points, counter-surveillance sweeps, clean comms. The cell is harder to find now."]
        }
      },
      {
        text: "Pursue vengeance against the suspected traitor",
        condition: { flag: "suspect_alex" },
        nextSceneId: "scene-19-vengeance",
        effects: { addFlags: ["vengeance_path"] }
      },
      { text: "Listen carefully. Say nothing.", nextSceneId: "scene-20" }
    ],
    autoDrawCards: 5,
    falloutCards: 1,
  },
  "scene-20": {
    id: "scene-20",
    act: 3,
    title: "The Point of No Return",
    text: [
      "The movement is at its apex. Millions of dollars in economic damage. Thousands of followers. A terrified ruling class.",
      "You are planning 'Operation Red Dawn'—a simultaneous, nationwide strike that will force the government to its knees.",
      "This is the last moment before the storm breaks. Take a breath."
    ],
    choices: [{ text: "Begin Operation Red Dawn", nextSceneId: "scene-21" }],
    autoEffects: { means: 200 }
  },
  "scene-21": {
    id: "scene-21",
    act: 4,
    title: "Operation Red Dawn",
    text: [
      "Act 4: The Storm.",
      "The plan: Simultaneous actions across 12 major cities. Logistics hubs blocked. Servers crashed. Mass civil disobedience.",
      "The climax is a march on the Capitol in DC. You must decide your role in history."
    ],
    choices: [
      { text: "Lead from the front in DC", nextSceneId: "scene-22", effects: { addFlags: ["lead_front"] } },
      { text: "Coordinate from the shadows", nextSceneId: "scene-22", effects: { addFlags: ["lead_shadows"] } },
      { text: "Sacrifice yourself as a decoy", nextSceneId: "scene-22", effects: { addFlags: ["decoy"] } }
    ]
  },
  "scene-22": {
    id: "scene-22",
    act: 4,
    title: "The Day Of",
    text: [
      "The sun rises on a fractured nation.",
      "The streets are full. The servers are going down. The military is mobilizing.",
      "Everything hinges on this moment. The culmination of months of planning, bleeding, and hiding."
    ],
    choices: [
      {
        text: "Execute with Encrypted Comms — every team synchronized, every channel secure",
        condition: { item: "encrypted_comms" },
        dieRoll: { outcomes: { 1: "scene-23-fail", 2: "scene-23-partial", 3: "scene-23-success", 4: "scene-23-success", 5: "scene-23-success", 6: "scene-23-success" } },
        effects: {
          addFlags: ["op_comms_bonus"],
          addJournalEntries: ["Encrypted Comms held throughout the operation. The state couldn't jam what it couldn't find."]
        }
      },
      {
        text: "Full Propaganda Blitz — the story breaks before the crackdown does",
        condition: { item: "propaganda_press" },
        nextSceneId: "scene-23-success",
        effects: {
          addFlags: ["public_support", "strong_public_support"],
          addJournalEntries: ["The Propaganda Press ran the story before the state could spin it. Two million read the truth before the crackdown began."]
        }
      },
      {
        text: "Armed vanguard assault — seize key infrastructure by force",
        condition: { item: "weapons_cache" },
        nextSceneId: "scene-23-success",
        effects: {
          means: -80,
          addFlags: ["armed_op"],
          addJournalEntries: ["Armed vanguard units seized three critical infrastructure nodes simultaneously. The state had no answer for coordinated force."]
        }
      },
      {
        text: "Luis leads the armed spearhead",
        condition: { flags: ["luis_recruited", "armed_path"] },
        dieRoll: {
          modifier: 2,
          outcomes: { 1: "scene-23-partial", 3: "scene-23-success", 5: "scene-23-armed-success" }
        },
        effects: { addFlags: ["luis_spearhead"] }
      },
      {
        text: "Luis coordinates diversionary strikes",
        condition: { flag: "luis_recruited" },
        nextSceneId: "scene-23-success",
        effects: {
          addFlags: ["luis_diversion"],
          surveillance: -20,
          addJournalEntries: ["Luis's diversionary strikes bought the main team crucial time. The state's response grid never recovered."]
        }
      },
      { text: "Execute the plan", dieRoll: { outcomes: { 1: "scene-23-fail", 2: "scene-23-fail", 3: "scene-23-partial", 4: "scene-23-partial", 5: "scene-23-success", 6: "scene-23-success" } } }
    ],
    autoDrawCards: 1
  },
  "scene-23-fail": {
    id: "scene-23-fail",
    act: 4,
    title: "Catastrophe",
    text: [
      "The communications grid went down—but they were our communications.",
      "The police kettled the main march before it even reached the mall. Mass arrests. Tear gas blinding the cameras.",
      "The plan fell apart. You are on the run."
    ],
    choices: [{ text: "Brace for impact", nextSceneId: "scene-24", effects: { addFlags: ["op_failed"] } }],
    autoDrawCards: 5,
    falloutCards: 1
  },
  "scene-23-partial": {
    id: "scene-23-partial",
    act: 4,
    title: "Chaos",
    text: [
      "The strikes hold, but the DC march turns violently chaotic. Agents provocateurs turn peaceful barricades into warzones.",
      "We lost the narrative on CNN, but we showed our terrifying strength. The country is paralyzed."
    ],
    choices: [{ text: "Brace for impact", nextSceneId: "scene-24", effects: { addFlags: ["op_partial"] } }],
    autoDrawCards: 5
  },
  "scene-23-success": {
    id: "scene-23-success",
    act: 4,
    title: "Triumph",
    text: [
      "Flawless execution. The economy halts entirely. The Capitol is surrounded by two million people, standing in total, terrifying silence.",
      "The police lower their shields. The state is paralyzed."
    ],
    choices: [{ text: "Brace for impact", nextSceneId: "scene-24", effects: { means: 500, addFlags: ["op_success"] } }],
    autoDrawCards: 5
  },
  "scene-24": {
    id: "scene-24",
    act: 4,
    title: "The Government Response",
    text: [
      "The President addresses the nation from a bunker.",
      "Martial law is declared in 7 major cities. Emergency powers are activated. The military is deployed domestically for the first time in a century.",
      "The climax is here."
    ],
    choices: [{ text: "Make the final call", nextSceneId: "scene-25" }]
  },
  "scene-25": {
    id: "scene-25",
    act: 4,
    title: "A Choice That Defines Everything",
    text: [
      "The walls are closing in. Your allies look to you. The sirens wail in the distance.",
      "Your next action determines how history remembers you, and what becomes of this revolution."
    ],
    choices: [
      { text: "Stand your ground at the Capitol (Path to Victory)", condition: { flag: "op_success" }, nextSceneId: "e1-1" },
      { text: "Surrender to save the others (Path to Martyrdom)", condition: { flag: "lead_front" }, nextSceneId: "e2-1" },
      { text: "Flee the country (Path to Exile)", condition: { item: "forged_docs" }, nextSceneId: "e3-1" },
      { text: "Purge the traitor inside (Path of Vengeance)", condition: { flag: "suspect_alex" }, nextSceneId: "e4-1" },
      { text: "Fight to the bitter end", nextSceneId: "e2-1" }
    ]
  },

  // ENDING 1
  "e1-1": {
    id: "e1-1",
    act: 5,
    title: "A New Dawn - The Occupation",
    text: [
      "Act 5: The Reckoning.",
      "The government fractures. The National Guard refuses orders to fire on the crowds. Eleven states declare solidarity with the striking workers.",
      "The Capitol is occupied peacefully. You walk through the rotunda. Marco Rivera, a laid-off steelworker, stands at the podium in the House chamber. It's surreal. Empty seats. The chandeliers still on."
    ],
    choices: [{ text: "Negotiate", nextSceneId: "e1-2" }]
  },
  "e1-2": {
    id: "e1-2",
    act: 5,
    title: "The Negotiation",
    text: [
      "The President agrees to a meeting. There is no bravado left in his eyes.",
      "An emergency power transfer is drafted. The transition begins. It is tense, but miraculously, it is bloodless. The apparatus of the state is dismantled piece by piece."
    ],
    choices: [{ text: "Draft the future", nextSceneId: "e1-3" }]
  },
  "e1-3": {
    id: "e1-3",
    act: 5,
    title: "The Constitution",
    text: [
      "An emergency constitutional convention is called in Philadelphia. You hold the pen that drafts the new framework.",
      "Property rights are redefined. Healthcare, housing, and food are codified as absolute human rights."
    ],
    choices: [{ text: "Address the resistance", nextSceneId: "e1-4" }]
  },
  "e1-4": {
    id: "e1-4",
    act: 5,
    title: "Resistance",
    text: [
      "Not everyone accepts it. A counter-revolution of corporate loyalists and fundamentalists begins in the deep South. The peace is fragile.",
      "You know that building a new world will be harder than tearing down the old one."
    ],
    choices: [{ text: "Declare victory", nextSceneId: "e1-5" }]
  },
  "e1-5": {
    id: "e1-5",
    act: 5,
    title: "The First Day",
    text: [
      "The United Socialist States of America is proclaimed. A new flag rises—simple, bold, unburdened by the blood of empires.",
      "Marco gives a speech that will be etched into stone monuments and taught in schools for generations. The air is clear. The fear is gone.",
      "It's bittersweet. You've lost friends. You've lost your innocence. The work of maintaining this fragile utopia is just beginning. But today, against impossible odds, the workers won.",
      "ACHIEVEMENT UNLOCKED: The Long March Complete."
    ],
    unlocksEnding: "e1",
    choices: [{ text: "Return to Title", nextSceneId: "scene-1" }],
    conditionalText: [
      { flag: "elena_trust", paragraph: "Elena stands beside you at the podium, refusing the microphone when it's offered — she's never been interested in the spotlight. You understand, now, why that matters." },
      { flag: "op1_success", paragraph: "The pamphlet workers who blanketed those five factories attend the ceremony. They're steel workers, teachers, cashiers — they look stunned, as if they can't quite believe what they started." },
      { flag: "peaceful_movement", paragraph: "The transition is strikingly bloodless. Later, historians will credit the movement's discipline. You think of Elena's early warnings and allow yourself a quiet, private moment of gratitude." },
      { flag: "luis_recruited", paragraph: "Luis stands beside you during the final hour, rifle lowered, watching the old guard walk out the doors. 'We did it,' he says quietly. 'Not for glory. For the people who come after us.'" }
    ]
  },

  // ENDING 2
  "e2-1": {
    id: "e2-1",
    act: 5,
    title: "The Cage - The Raid",
    text: [
      "Act 5: The Reckoning.",
      "4 AM. The sound of flashbangs shattering glass. Black SUVs surround the safehouse.",
      "They know everything. They knew the floorplan, the guard rotations, the encryption keys. They didn't just have surveillance—they had someone inside."
    ],
    choices: [{ text: "Face them", nextSceneId: "e2-2" }]
  },
  "e2-2": {
    id: "e2-2",
    act: 5,
    title: "The Interrogation",
    text: [
      "A polished FBI agent sits across from you in a sterile room. Friendly. Smiling. Paternal.",
      "'We can make this go away, Marco. We just want the financiers. Give us Gregor. Give us the others. You can walk.'",
      "You stare at him in total silence."
    ],
    choices: [{ text: "Refuse", nextSceneId: "e2-3" }]
  },
  "e2-3": {
    id: "e2-3",
    act: 5,
    title: "The Charges",
    text: [
      "71 federal counts. RICO. Sedition. Conspiracy to commit domestic terrorism. Your face is on every screen in America.",
      "They paint you as a monster. They erase your humanity, your cause, your grief."
    ],
    choices: [{ text: "Stand trial", nextSceneId: "e2-4" }]
  },
  "e2-4": {
    id: "e2-4",
    act: 5,
    title: "The Trial",
    text: [
      "It's a show trial. The verdict was written before jury selection even began. The judge sneers at your attorney. The media mocks your testimony.",
      "Guilty on all counts. Two consecutive life sentences."
    ],
    choices: [{ text: "Accept the sentence", nextSceneId: "e2-5" }]
  },
  "e2-5": {
    id: "e2-5",
    act: 5,
    title: "The Cell",
    text: [
      "Marco sits in a federal supermax facility in Colorado. Solitary confinement. 23 hours a day in an 8x10 concrete box.",
      "But the letters keep coming. Slipping past the censors. Smuggled in by sympathetic guards. The movement didn't die. It just went underground.",
      "They locked away the man, but they broadcast the martyr to the entire world. The State cannot silence an idea. As you close your eyes, you hear the distant, muffled sound of a prison strike beginning.",
      "ACHIEVEMENT UNLOCKED: The State Cannot Silence an Idea."
    ],
    unlocksEnding: "e2",
    choices: [{ text: "Return to Title", nextSceneId: "scene-1" }],
    conditionalText: [
      { flag: "elena_trust", paragraph: "Elena's face appears on the cover of Time magazine. She gives no interview. The caption reads: 'The Nurse Who Wouldn't Stop.'" },
      { flag: "has_fatima", paragraph: "Fatima's dispatches from outside the courtroom reach forty million readers. They couldn't silence the story, even if they silenced the storyteller." },
      { flag: "suspect_alex", paragraph: "You knew. You knew before it happened. The knowing didn't save anyone, but it means the next movement will be harder to infiltrate." },
      { flag: "luis_recruited", paragraph: "Luis is the last one standing when they come for the safehouse. He covers your retreat without a word. His final transmission: 'Keep moving. The fight doesn't die with us.'" },
      { flag: "nadia_recruited", paragraph: "Nadia keeps working through the arrests, treating the wounded in a church basement three blocks from the courthouse. They never find her clinic." }
    ]
  },

  // ENDING 3
  "e3-1": {
    id: "e3-1",
    act: 5,
    title: "The Long Exile - The Frame-Up",
    text: [
      "Act 5: The Reckoning.",
      "A series of devastating bombings rock financial districts on the East Coast. Civilian casualties are high.",
      "You didn't do it. But your name is everywhere. The evidence was planted perfectly. The state needed a reason to use lethal military force against the movement, and someone gave it to them."
    ],
    choices: [{ text: "Use the documents", nextSceneId: "e3-2" }]
  },
  "e3-2": {
    id: "e3-2",
    act: 5,
    title: "The Escape",
    text: [
      "You activate the forged documents. A new identity. A new life.",
      "You are smuggled into a cargo container out of a Seattle port. 14 days at sea in pitch darkness, surviving on rations and the burning desire for justice."
    ],
    choices: [{ text: "Arrive", nextSceneId: "e3-3" }]
  },
  "e3-3": {
    id: "e3-3",
    act: 5,
    title: "Beijing",
    text: [
      "A government handler meets you at the airport in Beijing. Polite. Cautious.",
      "You are granted political asylum. But you are a propaganda asset now. A pawn in a larger geopolitical chess game. You knew that going in."
    ],
    choices: [{ text: "Do the interview", nextSceneId: "e3-4" }]
  },
  "e3-4": {
    id: "e3-4",
    act: 5,
    title: "The Interview",
    text: [
      "State media cameras roll. You speak carefully, threading your actual revolutionary truth into the narrative your hosts want to hear.",
      "You are playing their game. Biding your time. Gathering resources."
    ],
    choices: [{ text: "Plan", nextSceneId: "e3-5" }]
  },
  "e3-5": {
    id: "e3-5",
    act: 5,
    title: "Planning the Return",
    text: [
      "From 7,000 miles away, you begin planning again. You have money now. Contacts. Distance.",
      "The movement back home needs a voice they cannot arrest, cannot silence, and cannot touch. The story ends with Marco at a heavy oak desk, writing by lamplight, beginning the first page of the next manifesto.",
      "The revolution is delayed. Not defeated.",
      "ACHIEVEMENT UNLOCKED: The Exile's Flame."
    ],
    unlocksEnding: "e3",
    choices: [{ text: "Return to Title", nextSceneId: "scene-1" }],
    conditionalText: [
      { flag: "elena_trust", paragraph: "Elena's last encrypted message reached you six weeks ago: 'The clinic is still open. We're fine. Come home when you can.'" },
      { flag: "has_ghost", paragraph: "Ghost routes your manifesto through seventeen proxies and posts it simultaneously to 400 servers. Even from exile, the words reach the right hands." },
      { flag: "darius_trust", paragraph: "Darius was released on bail, the charges quietly reduced. He is teaching computer science at a community college. His students don't know who he is. He prefers it that way." }
    ]
  },

  // ENDING 4
  "e4-1": {
    id: "e4-1",
    act: 5,
    title: "The Poison - The Symptoms",
    text: [
      "Act 5: The Reckoning.",
      "Three comrades are sick. Violently, suddenly. Not food poisoning. They are coughing blood. Skin turning pale.",
      "Something is deeply wrong at the safehouse. The panic is immediate."
    ],
    choices: [{ text: "Investigate", nextSceneId: "e4-2" }]
  },
  "e4-2": {
    id: "e4-2",
    act: 5,
    title: "The Revelation",
    text: [
      "You find the empty vials in the trash. You check the security logs. Only one person was alone with the water supply.",
      "Alex Mercer. Real name: Special Agent Daniel Holt. Three years deep undercover for a black-ops federal task force.",
      "He didn't just report on you. He was ordered to execute a silent purge."
    ],
    choices: [{ text: "Watch it fall apart", nextSceneId: "e4-3" }],
    autoEffects: {
      addJournalEntries: ["Alex Mercer — real name Special Agent Daniel Holt. 3-year deep-cover federal operative."]
    }
  },
  "e4-3": {
    id: "e4-3",
    act: 5,
    title: "The Collapse",
    text: [
      "Some survive. Some don't. Elena is barely breathing in a clandestine clinic.",
      "The cell is scattered. Comrades you loved, people who trusted you, are dead—killed by the man who ate at your table and called you brother."
    ],
    choices: [{ text: "Survive", nextSceneId: "e4-4" }]
  },
  "e4-4": {
    id: "e4-4",
    act: 5,
    title: "The Survivor",
    text: [
      "Marco survives, but he is fundamentally changed.",
      "Betrayal at this magnitude rewires your soul. The idealism burns away, leaving only cold, paranoid ash. You will never trust anyone again."
    ],
    choices: [{ text: "Write the manual", nextSceneId: "e4-5" }]
  },
  "e4-5": {
    id: "e4-5",
    act: 5,
    title: "The Reckoning",
    text: [
      "You turn the agent's tactics into a lesson.",
      "You spend your final days writing an encrypted, brutal guide for every future movement about how to detect infiltration. How to vet. How to purge.",
      "They can't kill what they can't find. It is a dark, haunting text, devoid of hope, filled only with survival mechanics. It is ambiguous if the movement will ever recover, but if it does, it will be ruthless.",
      "ACHIEVEMENT UNLOCKED: They Can't Kill What They Can't Find."
    ],
    unlocksEnding: "e4",
    choices: [{ text: "Return to Title", nextSceneId: "scene-1" }],
    conditionalText: [
      { flag: "elena_trust", paragraph: "Elena survived. Barely. She'll never fully forgive you for trusting him, and you understand. You don't forgive yourself either." },
      { flag: "alex_suspected", paragraph: "You suspected. You said nothing. The weight of that silence is heavier than everything else." },
      { flag: "has_ghost", paragraph: "Ghost vanished the night of the poisoning. No trace. You don't know if Ghost was also compromised, or if Ghost is the only one who escaped clean. You will never know." }
    ]
  },

  // ============================================================
  // SECRET PATH — unlocked only after all four endings are reached
  // ============================================================
  "secret-1": {
    id: "secret-1",
    act: 0,
    title: "The Recurring Dream",
    text: [
      "You wake in the same cramped Pittsburgh apartment. The radiator hisses. Snow against the window. The clock reads 4:47 AM. It is the morning of the layoff. Again.",
      "But this time, you remember. You remember the chandeliers in the empty Capitol. You remember the concrete cell in Colorado. You remember the cargo container, the lamplit desk in Beijing. You remember the empty vials in the trash and the friends who never woke up.",
      "Four lifetimes pressed into one skull. Four endings. Four lessons. The dream — or curse — of having walked every path.",
      "You sit up. Your hands are not shaking. For the first time in any life, you are not afraid. You know exactly what does not work."
    ],
    choices: [{ text: "Get out of bed", nextSceneId: "secret-2" }]
  },
  "secret-2": {
    id: "secret-2",
    act: 0,
    title: "The Synthesis",
    text: [
      "You meet Elena and Darius at the same diner where, in another life, the cell was first formed. You order coffee. You do not order anything else.",
      "'I'm not building a vanguard,' you tell them. 'I'm not storming a Capitol. I'm not picking up a gun. I'm not running from anyone, and I'm not waiting for permission.'",
      "Elena tilts her head. Darius sets down his fork. They have known you a long time. They have never heard you sound like this.",
      "'Then what are you doing, Marco?'",
      "'We are going to make the state irrelevant,' you say. 'Quietly. Patiently. Without ever asking it for anything.'"
    ],
    choices: [{ text: "Lay out the plan", nextSceneId: "secret-3" }]
  },
  "secret-3": {
    id: "secret-3",
    act: 0,
    title: "Dual Power",
    text: [
      "It does not look like a revolution. That is the entire point.",
      "A free clinic in the back of a barbershop. A childcare cooperative run out of a rec center. A grocery network that bypasses three layers of middlemen. A worker-owned print shop. A neighborhood mediation council that resolves disputes the police would only escalate. A mesh radio network that does not touch a corporate tower.",
      "You build none of it alone. You teach. You connect. You step back. There is no charismatic leader to arrest, because there is no leader. There is no headquarters to raid, because there are ten thousand kitchens.",
      "Surveillance becomes meaningless when the thing being watched is just people taking care of each other."
    ],
    choices: [{ text: "Years pass", nextSceneId: "secret-4" }]
  },
  "secret-4": {
    id: "secret-4",
    act: 0,
    title: "The Tipping Point",
    text: [
      "A decade later, the parallel society has eclipsed the official one. More Americans get their healthcare from cooperatives than from insurers. More children are educated in community schools than in the underfunded public ones. More disputes are resolved by neighborhood councils than by courts.",
      "When the next financial crash comes, no one panics. The systems that mattered were never on Wall Street to begin with.",
      "The federal government, hollowed out and increasingly absurd, tries one last crackdown. It deploys troops to a city where the troops' own families now depend on the cooperatives. The orders are quietly ignored. Officers begin defecting in groups, not as traitors, but as neighbors.",
      "There is no storming. There is no surrender. There is simply a morning when the apparatus of the old state wakes up and discovers no one is listening to it anymore."
    ],
    choices: [{ text: "The morning after", nextSceneId: "secret-5" }]
  },
  "secret-5": {
    id: "secret-5",
    act: 0,
    title: "The Means Was the Movement",
    text: [
      "Marco is old now. He sits on a porch in the same Pittsburgh neighborhood, drinking coffee that was grown by a cooperative in Honduras and roasted three blocks away.",
      "There is no monument to him. He refused every offer. The history books, written collectively, mention him in a single paragraph: 'one of many organizers in the early networks.' That is exactly what he wanted.",
      "Children he will never meet attend schools he will never visit. Workers vote on the conditions of their own labor in factories that no longer have owners. The flag did not change. The Constitution did not change. Almost nothing on paper changed. Everything underneath it did.",
      "He understands now what every other version of him missed. The state was never the prize. The Means — the relationships, the networks, the slow patient work of taking care of one another — was never a tool for the revolution.",
      "The Means was the revolution.",
      "ACHIEVEMENT UNLOCKED: The Means Was the Movement. // [ALL PATHS WALKED]"
    ],
    unlocksEnding: "e5",
    choices: [{ text: "Return to Title", nextSceneId: "scene-1" }],
    conditionalText: [
      { flag: "elena_trust", paragraph: "Elena runs the free clinic three blocks from Marco's porch. She never ran for office. She never needed to." },
      { flag: "peaceful_movement", paragraph: "The choice not to arm the movement turned out to be the right one — not for moral reasons, but practical ones. An armed vanguard can be isolated and crushed. Ten thousand kitchens cannot." },
      { flag: "has_fatima", paragraph: "Fatima's archives are now housed at seven universities. The full story of the early years has been told — accurately, with all the failures intact." }
    ]
  },

  // ============================================================
  // NEW SCENES — die-roll fail/success outcomes + party fixes
  // ============================================================

  "scene-3-gregor-walks": {
    id: "scene-3-gregor-walks",
    act: 1,
    title: "Contact Lost",
    text: [
      "You push back. You demand credentials—a dead drop, a verifiable asset, a name that can be checked against something real.",
      "The terminal sits idle for four minutes. Then a single line appears: 'You've mistaken caution for paranoia. I no longer trust this line.' The session drops.",
      "You will not hear from Comrade Gregor again. Whatever resources he was offering vanish with the encrypted connection. You're going in with what you have."
    ],
    choices: [{ text: "Move forward without him", nextSceneId: "scene-4", effects: { addFlags: ["declined_gregor"] } }]
  },

  "scene-3-gregor-reveals": {
    id: "scene-3-gregor-reveals",
    act: 1,
    title: "Proof of Good Faith",
    text: [
      "Four minutes pass. Then: a data burst—transaction records, shell company registrations, a scanned photograph of a government memo you recognize. It lines up.",
      "'I understand caution,' the terminal reads. 'The factories I helped shut down in Łódź and Gdańsk also had skeptics. I am not asking for gratitude. Only results.'",
      "Darius leans back, exhaling slowly. 'It checks out. As much as anything like this can check out.' Elena is already looking at your empty accounts. 'Then we take the money and we move.'"
    ],
    autoEffects: {
      means: 200,
      addFlags: ["accepted_gregor"],
      addJournalEntries: ["Comrade Gregor — identity partially verified. Provided documentation linking him to prior labor actions in Poland. Funding accepted."]
    },
    choices: [{ text: "Accept his resources and move forward", nextSceneId: "scene-4" }]
  },

  "scene-4-mike-success": {
    id: "scene-4-mike-success",
    act: 2,
    title: "Big Mike",
    text: [
      "Mike Kowalski listens to the full pitch over two cups of diner coffee. He doesn't say anything for a long time. He stares at the table.",
      "'I did thirty years at Bethlehem Steel,' he finally says. 'I watched them break every union they touched. I've been waiting for someone to ask me this.' He extends a calloused hand.",
      "He is with you. His logistics contacts and his institutional knowledge of the labor movement are worth more than anything in the supply network."
    ],
    autoEffects: { addFlags: ["has_mike"], addJournalEntries: ["Big Mike Kowalski — veteran union organizer, logistics network connections."] },
    choices: [{ text: "Welcome him in", nextSceneId: "scene-5" }]
  },

  "scene-4-fatima-success": {
    id: "scene-4-fatima-success",
    act: 2,
    title: "Off the Record",
    text: [
      "Fatima Al-Rashid reads the encrypted message twice, then slides her phone face-down on the table.",
      "'I have three stories my editor killed for national security reasons,' she says quietly. 'You just described every single one of them.'",
      "She's in. More than in—she's been looking for exactly this. Her access to state media feeds and her source network are now yours."
    ],
    autoEffects: { addFlags: ["has_fatima"], addJournalEntries: ["Fatima Al-Rashid — independent journalist, access to state media feeds."] },
    choices: [{ text: "Bring her into the fold", nextSceneId: "scene-5" }]
  },

  "scene-5-farm-success": {
    id: "scene-5-farm-success",
    act: 2,
    title: "The Farmhouse",
    text: [
      "The farmhouse is exactly as Elena described it. Isolated, unregistered, surrounded by empty fields on three sides. No neighbors. No sight lines.",
      "It takes two days to sweep it, wire it, and make it livable. By the third day it is your headquarters—a place you can breathe without one eye on the door.",
      "It's not glamorous. It is enough."
    ],
    autoEffects: { addFlags: ["farm_safehouse"] },
    choices: [{ text: "Set up operations", nextSceneId: "scene-6" }]
  },

  "scene-5-farm-blown": {
    id: "scene-5-farm-blown",
    act: 2,
    title: "Already Burned",
    text: [
      "The access road to the farmhouse is not empty. A vehicle you don't recognize has been parked at the far end of the property for at least three days, judging by the tire tracks.",
      "Someone got there first. Whether it was a tip, cell data triangulation, or a loose word spoken in the wrong place is impossible to say. The farmhouse is burned.",
      "You pull back to a church basement two towns over. You are behind, and the state is closer than you thought."
    ],
    choices: [{ text: "Find another way", nextSceneId: "scene-6", effects: { surveillance: 15 } }]
  },

  "scene-7-heist-fail": {
    id: "scene-7-heist-fail",
    act: 2,
    title: "Ambush",
    text: [
      "Someone knew. The truck route was bait, or you were followed, or a scanner picked up the radio traffic. The moment your vehicle blocks the road, there are already sirens.",
      "You scatter. One comrade takes a graze wound to the shoulder. You lose the vehicle and half your equipment. You don't get within fifty feet of the payroll.",
      "The cell is shaken. You have nothing to show for the risk except exposure and a narrowing window."
    ],
    autoEffects: { surveillance: 40 },
    choices: [{ text: "Regroup", nextSceneId: "scene-8", effects: { means: -50 } }]
  },

  "scene-7-heist-success": {
    id: "scene-7-heist-success",
    act: 2,
    title: "The Haul",
    text: [
      "Textbook. The truck is boxed in at the warehouse loading dock before the guards can radio for support. They're contractors, not soldiers. Nobody gets hurt.",
      "You are in and out in four minutes. Six hundred thousand in untraceable corporate payroll, seized and redistributed.",
      "You immediately send a third of it to workers' families in the neighborhood. The rest is operational. It's the most money the cell has ever held. You are deeply, irrevocably in this now."
    ],
    autoEffects: { means: 600 },
    choices: [{ text: "Count the money", nextSceneId: "scene-8" }]
  },

  "scene-9-mediate-fail": {
    id: "scene-9-mediate-fail",
    act: 2,
    title: "Fracture",
    text: [
      "Your measured attempt to find middle ground is read by both of them as weakness—or worse, as a failure to understand what is actually at stake.",
      "Elena walks out. Darius goes silent for three days. When he returns, he is colder and more calculating, reassessing what kind of leader you are.",
      "You have lost ground with both of them. You will need to work twice as hard to rebuild what just cracked."
    ],
    autoEffects: { surveillance: 5 },
    choices: [{ text: "Press on", nextSceneId: "scene-10" }]
  },

  "scene-10-infil-fail": {
    id: "scene-10-infil-fail",
    act: 3,
    title: "Burned at the Door",
    text: [
      "The security rotation was different from the reconnaissance reports. Updated—or expected.",
      "The team is spotted at the loading dock before the drive reaches the server room. You scatter in three directions. The servers survive intact. The eviction records stay on those drives.",
      "You are on camera now. Grainy footage, but real. The state has your profile and a documented reason to escalate."
    ],
    autoEffects: { surveillance: 35 },
    choices: [{ text: "Disappear", nextSceneId: "scene-11" }]
  },

  "scene-10-infil-success": {
    id: "scene-10-infil-success",
    act: 3,
    title: "Drive Planted",
    text: [
      "Three minutes inside. The server room hums with cold air and the sound of something ending.",
      "You slot the drive, execute the wipe command, and exit through the loading dock before the rotation completes. Eight thousand eviction orders vanish from the system.",
      "You are four blocks away when the first alarm triggers. No one saw a face."
    ],
    autoEffects: { means: 50 },
    choices: [{ text: "Move fast", nextSceneId: "scene-11" }]
  },

  "scene-12-alex-rejected": {
    id: "scene-12-alex-rejected",
    act: 3,
    title: "Turned Away",
    text: [
      "You tell him no. You do it quietly, in the parking lot, before he even steps inside.",
      "He takes it well. Too well. He shakes your hand and tells you he understands. He says he respects the caution. He drives away in a clean, late-model sedan.",
      "Ghost sends you a message that night: 'Good call.' That's all."
    ],
    choices: [{ text: "Move on", nextSceneId: "scene-13" }]
  },

  "scene-13-trap-backfire": {
    id: "scene-13-trap-backfire",
    act: 3,
    title: "They Figured It Out",
    text: [
      "The false intel circulates for less than eighteen hours before it disappears from all feeds without a trace. They identified it as disinformation before acting on it.",
      "Worse: the specificity of what you planted revealed that you know about the surveillance operation. They now know you know. The tail doubles.",
      "You tipped your hand, and they didn't blink."
    ],
    autoEffects: { surveillance: 20 },
    choices: [{ text: "Adjust", nextSceneId: "scene-14" }]
  },

  "scene-13-sabotage-success": {
    id: "scene-13-sabotage-success",
    act: 3,
    title: "Disruption Successful",
    text: [
      "Using the Cipher's intelligence, you identify the surveillance team's logistics hub — a nondescript communications relay three blocks from your safehouse.",
      "A targeted action destroys their equipment and scrambles their reporting chain. The dark sedan vanishes. The familiar face on the subway stops appearing.",
      "You bought time. The tail is burned, and the state doesn't yet know how."
    ],
    autoEffects: {
      addJournalEntries: ["Sabotage Boost Active — targeted disruption using Cipher intelligence cleared FBI surveillance. Momentum gained."]
    },
    choices: [{ text: "Move fast", nextSceneId: "scene-14" }]
  },

  "scene-17-source-burned": {
    id: "scene-17-source-burned",
    act: 3,
    title: "Source Burned",
    text: [
      "The documents hit the internet for eleven minutes before three platforms pull them simultaneously under emergency court orders.",
      "By midnight, the Department of Homeland Security announces a leak investigation. Your source inside the department is identified and arrested before morning.",
      "The story dies in the noise. The senators escape accountability. And a person who trusted you is now in federal custody."
    ],
    autoEffects: { surveillance: 25 },
    choices: [{ text: "Carry on", nextSceneId: "scene-18", effects: { means: -75 } }]
  },

  "scene-18-wrong-move": {
    id: "scene-18-wrong-move",
    act: 3,
    title: "Too Obvious",
    text: [
      "You move too fast, or with too little subtlety. The person you pressure notices the shift before you have anything concrete.",
      "They become careful. Deliberately, professionally careful. The mistakes stop. The counter-questions begin.",
      "If they are compromised, you just made them harder to catch. If they are loyal, you have wounded trust inside your own cell."
    ],
    autoEffects: { surveillance: 15 },
    choices: [{ text: "Pull back", nextSceneId: "scene-19" }]
  },

  "scene-18-alex-confirmed": {
    id: "scene-18-alex-confirmed",
    act: 3,
    title: "The Evidence",
    text: [
      "You say nothing and watch everything. Within a week, you have what you need. A timestamp discrepancy. A location ping that shouldn't exist. A phrase in his last report that appears—verbatim—in a leaked federal memo three days later.",
      "He's reporting. He has been from the beginning.",
      "The cell doesn't know yet. You know. You hold this information carefully, like a weapon you haven't decided whether to use."
    ],
    autoEffects: { addFlags: ["suspect_alex"] },
    choices: [{ text: "Sit on it", nextSceneId: "scene-19" }]
  },

  // ============================================================
  // NEW SCENES — Tickets 2, 3 expansions
  // ============================================================

  "scene-16-armed": {
    id: "scene-16-armed",
    act: 3,
    title: "Training with Luis",
    text: [
      "Luis stands in the dim basement, field-stripping a rifle with practiced efficiency.",
      "'Most people think violence is about rage,' he says quietly. 'It's not. It's about control. Precision. Knowing when to pull the trigger — and when not to.'",
      "Under his guidance, the cell begins its transformation."
    ],
    choices: [
      {
        text: "Intensive Combat Training",
        nextSceneId: "scene-17",
        effects: {
          addFlags: ["luis_armed_training"],
          combatBonus: 2,
          addJournalEntries: ["Luis's brutal but effective training has turned us into a real fighting unit. Combat effectiveness +2."],
          surveillance: 25
        }
      },
      {
        text: "Focus on hit-and-run tactics and sabotage",
        nextSceneId: "scene-17",
        effects: {
          addFlags: ["luis_sabotage_expert"],
          addJournalEntries: ["Luis taught us how to strike hard, fast, and disappear into the night."],
          surveillance: -10
        }
      },
      {
        text: "Send Luis on a solo reconnaissance mission",
        dieRoll: { outcomes: { 1: "scene-16-luis-ambush", 4: "scene-16-luis-partial", 6: "scene-16-luis-success" } }
      }
    ],
    autoDrawCards: 1
  },

  "scene-18-alex-confront": {
    id: "scene-18-alex-confront",
    act: 3,
    title: "The Confrontation",
    text: [
      "You lay it all out on the table. The timestamps. The location pings. The verbatim match between his field report and the federal memo.",
      "Alex doesn't deny it. He doesn't even reach for a cover story. He looks at you with something that might be relief.",
      "'You were never supposed to find that,' he says quietly. Then he stands up very slowly, hands visible, and walks to the door.",
      "'I had a job. You have yours. I hope you finish it.'",
      "He leaves. No explosion. No arrest call. Just gone — burning his operation on the way out. His federal handlers will know he's compromised within hours. You have a window. Narrow, but real."
    ],
    choices: [{
      text: "Use the window — move before they regroup",
      nextSceneId: "scene-19",
      effects: {
        surveillance: -20,
        removeFlags: ["suspect_alex"],
        addFlags: ["alex_burned", "comrade_saved"],
        addJournalEntries: ["Alex Mercer confirmed federal operative — allowed to walk. His handlers lost their inside man. A narrow window opened."]
      }
    }]
  },

  "scene-19-vengeance": {
    id: "scene-19-vengeance",
    act: 3,
    title: "The Hunt",
    text: [
      "You don't announce it. You don't call a vote. You just start moving.",
      "The next forty-eight hours are a quiet, methodical dismantling of everything the suspected traitor has access to. Comms rerouted. Safe house locations rotated. Dead drops abandoned and rebuilt.",
      "Then you find the proof — buried in a backup drive he thought was wiped. Federal handler contact numbers. Activity logs. The betrayal is documented and undeniable.",
      "The cell finally knows. The grief and the rage hit the room at the same time. Whatever you were before this moment, you are not that anymore."
    ],
    autoEffects: {
      surveillance: -15,
      addFlags: ["vengeance_resolved"],
      addJournalEntries: ["The traitor's network dismantled. Federal handler contacts recovered. The cell knows the full truth now — and it has changed them."]
    },
    choices: [{ text: "Rebuild", nextSceneId: "scene-20" }]
  },

  // ============================================================
  // LUIS & NADIA EXPANSION — recon outcomes + medical branch
  // ============================================================

  "scene-16-luis-ambush": {
    id: "scene-16-luis-ambush",
    act: 3,
    title: "Ambush",
    text: [
      "Luis's reconnaissance went wrong. He barely made it back, bleeding from a graze wound on his forearm.",
      "'They were waiting for us,' he growls, jaw tight. 'Someone talked, or they got lucky. Either way — we need to be smarter.'"
    ],
    choices: [
      {
        text: "Push through despite the setback",
        nextSceneId: "scene-17",
        effects: { surveillance: 30 }
      },
      {
        text: "Treat Luis with Medical Supplies",
        condition: { item: "medical_supplies" },
        nextSceneId: "scene-17",
        effects: {
          addFlags: ["luis_grateful"],
          addJournalEntries: ["Luis was saved by your medical supplies. He doesn't say thank you — but you can see it in his eyes."]
        }
      }
    ]
  },

  "scene-16-luis-partial": {
    id: "scene-16-luis-partial",
    act: 3,
    title: "Mixed Results",
    text: [
      "Luis returns at 0300, moving carefully. The mission was compromised midway — he had to abort before reaching the primary objective.",
      "'I had to pull back,' he says, spreading a hand-drawn map on the table. 'But I got enough. Three-shift rotation. Gap at 0200. That's our window.'"
    ],
    choices: [
      {
        text: "Work with what you have",
        nextSceneId: "scene-17",
        effects: {
          surveillance: 10,
          addJournalEntries: ["Partial recon data recovered. Luis identified a narrow operational window — we'll have to move fast and trust it."]
        }
      }
    ]
  },

  "scene-16-luis-success": {
    id: "scene-16-luis-success",
    act: 3,
    title: "Successful Recon",
    text: [
      "Luis returns at dawn with a hand-drawn map, a captured enemy radio still crackling on their frequency, and a rare cold smile.",
      "'We now know their patrol patterns, their fallback positions, and their comms encryption rotation,' he says. 'They don't know we know. That's worth more than any weapon.'"
    ],
    choices: [
      {
        text: "Press the advantage",
        nextSceneId: "scene-17",
        effects: {
          addFlags: ["luis_intel_bonus"],
          surveillance: -15,
          means: 60,
          addJournalEntries: ["Luis's recon yielded critical intel. Patrol patterns mapped, fallback positions identified. We now hold the initiative."]
        }
      }
    ],
    autoDrawCards: 1
  },

  "scene-16-medical": {
    id: "scene-16-medical",
    act: 3,
    title: "Field Medicine with Nadia",
    text: [
      "Nadia converts the back room into a functioning clinic in under two hours. Bandages sorted by type, antibiotics catalogued, two folding cots set up under a bare bulb.",
      "'We save lives first,' she says, not looking up from her inventory. 'Everything else comes after. A movement that can't keep its people alive long enough to fight isn't a movement — it's a memorial.'"
    ],
    choices: [
      {
        text: "Advanced First Aid Training for the whole cell",
        nextSceneId: "scene-17",
        effects: {
          addFlags: ["nadia_medical_training"],
          addJournalEntries: ["Nadia trained the cell in emergency field medicine. Survival odds on any operation just improved significantly."],
          surveillance: 10
        }
      },
      {
        text: "Deploy Nadia to build an underground medical network",
        nextSceneId: "scene-17",
        effects: {
          addFlags: ["nadia_network"],
          addJournalEntries: ["Nadia's contacts are now quietly treating wounded comrades across the city, off the books and off the grid."]
        }
      }
    ]
  },

  "scene-23-armed-success": {
    id: "scene-23-armed-success",
    act: 4,
    title: "Armed Triumph",
    text: [
      "Luis's spearhead cuts through every defensive line they throw at you. Military precision. No wasted motion. Three critical infrastructure nodes seized before the state even identifies the pattern.",
      "The coordination is flawless — the result of every training session, every field decision, every hard call that led to this moment.",
      "As the dust settles, Luis stands in the corridor of an occupied government building, rifle lowered, watching workers stream through the front doors for the first time as owners of the space.",
      "'This is what it's supposed to look like,' he says quietly. You don't disagree."
    ],
    choices: [{ text: "Brace for impact", nextSceneId: "scene-24", effects: { means: 500, addFlags: ["op_success", "armed_op_success"] } }],
    autoDrawCards: 5
  }
};
