import { Item, Card } from '../types';

export const STORE_ITEMS: Item[] = [
  {
    id: "encrypted_comms",
    name: "Encrypted Comms Device",
    cost: 300,
    description: "Reduces surveillance risk; unlocks secure dialogue options"
  },
  {
    id: "forged_docs",
    name: "Forged Documents",
    cost: 500,
    description: "Opens exile options; enables identity switching"
  },
  {
    id: "safe_house_upgrade",
    name: "Safe House Upgrade",
    cost: 400,
    description: "Protects against raids for 3 scenes"
  },
  {
    id: "medical_supplies",
    name: "Medical Supplies",
    cost: 200,
    description: "Restores after a close call; required for some choices"
  },
  {
    id: "weapons_cache",
    name: "Weapons Cache",
    cost: 600,
    description: "Opens violent confrontation options"
  },
  {
    id: "propaganda_press",
    name: "Propaganda Press",
    cost: 350,
    description: "+30 Means per scene for 5 scenes; increases movement size"
  }
];

export const DECK: Card[] = [
  { id: "c1", name: "The Vanguard", effectDescription: "+1 to next die roll result (capped at 6)" },
  { id: "c2", name: "The Informant", effectDescription: "Reveals a hidden clue about the agent in your ranks" },
  { id: "c3", name: "The Proletariat", effectDescription: "Gain 80 Means; solidarity dividend" },
  { id: "c4", name: "The Manifesto", effectDescription: "Next choice unlocks a secret dialogue option" },
  { id: "c5", name: "The Strike", effectDescription: "+100 Means; worker action pays off" },
  { id: "c6", name: "The Apparatus", effectDescription: "The state is watching; -1 to next die roll" },
  { id: "c7", name: "The Martyr", effectDescription: "A comrade is lost; lose one item from your inventory" },
  { id: "c8", name: "The Barricade", effectDescription: "Gain protection; safe from negative events for 2 scenes" },
  { id: "c9", name: "The Cipher", effectDescription: "Encrypted message; reveals a plot twist foreshadowing" },
  { id: "c10", name: "Red Dawn", effectDescription: "All Means costs reduced by 50% for this scene" },
];

export type SceneChoice = {
  text: string;
  nextSceneId?: string;
  condition?: { flag?: string; item?: string; missingFlag?: string; missingItem?: string };
  effects?: {
    means?: number;
    surveillance?: number;
    addFlags?: string[];
    removeFlags?: string[];
    addItems?: string[];
    removeItems?: string[];
  };
  dieRoll?: {
    outcomes: Record<number, string>;
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
  autoEffects?: {
    means?: number;
    surveillance?: number;
    addFlags?: string[];
  };
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
    autoDrawCards: 2
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
      { text: "Who are you, really? (Demand proof)", dieRoll: { outcomes: { 1: "scene-4", 2: "scene-4", 3: "scene-4", 4: "scene-4", 5: "scene-4", 6: "scene-4" } } }
    ],
    autoEffects: { means: 50 } 
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
      { text: "Recruit 'Big Mike' Kowalski (Union Vet)", dieRoll: { outcomes: { 1: "scene-4-fail", 2: "scene-4-fail", 3: "scene-4-fail", 4: "scene-5", 5: "scene-5", 6: "scene-5" } }, effects: { addFlags: ["has_mike"] } },
      { text: "Recruit Fatima Al-Rashid (Journalist)", dieRoll: { outcomes: { 1: "scene-4-fail", 2: "scene-4-fail", 3: "scene-5", 4: "scene-5", 5: "scene-5", 6: "scene-5" } }, effects: { addFlags: ["has_fatima"] } },
      { text: "Recruit 'Ghost' (Anonymous Hacker)", nextSceneId: "scene-5", effects: { addFlags: ["has_ghost"] } }
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
      { text: "Rent a warehouse in Gary (200 Means)", nextSceneId: "scene-6", effects: { means: -200, addFlags: ["warehouse_safehouse"], surveillance: 10 } },
      { text: "Use Elena's cousin's farmhouse (Free)", dieRoll: { outcomes: { 1: "scene-6", 2: "scene-6", 3: "scene-6", 4: "scene-6", 5: "scene-6", 6: "scene-6" } }, effects: { addFlags: ["farm_safehouse"] } },
      { text: "Buy forged lease", condition: { item: "forged_docs" }, nextSceneId: "scene-6", effects: { addFlags: ["forged_safehouse"] } }
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
    choices: [{ text: "Regroup", nextSceneId: "scene-7", effects: { surveillance: 20 } }]
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
      "Flawless execution. All five factories were blanketed. The morning shift arrived to find revolutionary literature taped to every locker, machine press, and supervisor door.",
      "The workers are talking. The corporate owners are panicked. The cell gains massive credibility."
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
      { text: "Rob a corporate payroll truck", condition: { item: "weapons_cache" }, dieRoll: { outcomes: { 1: "scene-8", 2: "scene-8", 3: "scene-8", 4: "scene-8", 5: "scene-8", 6: "scene-8" } }, effects: { means: 600, surveillance: 40 } },
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
    autoDrawCards: 3
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
      { text: "Mediate between them", dieRoll: { outcomes: { 1: "scene-10", 2: "scene-10", 3: "scene-10", 4: "scene-10", 5: "scene-10", 6: "scene-10" } } }
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
      { text: "Physical infiltration", dieRoll: { outcomes: { 1: "scene-11", 2: "scene-11", 3: "scene-11", 4: "scene-11", 5: "scene-11", 6: "scene-11" } }, effects: { means: 50, surveillance: 20 } }
    ],
    autoEffects: { means: 150 }
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
    title: "The New Recruit",
    text: [
      "A new person wants to join the inner circle: Alex Mercer. Former military. Discharged under murky circumstances. He says he's disillusioned with the empire he served.",
      "He's very capable. Very smooth. He knows counter-surveillance and weapons tactics.",
      "But Ghost is inexplicably quiet about him. Ghost's background checks found nothing—which, in Ghost's world, means the file was professionally scrubbed."
    ],
    choices: [
      { text: "Welcome him to the inner circle", nextSceneId: "scene-13", effects: { addFlags: ["has_alex", "alex_trusted"] } },
      { text: "Keep him at arm's length", nextSceneId: "scene-13", effects: { addFlags: ["has_alex", "alex_suspected"] } }
    ],
    autoDrawCards: 3
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
      { text: "Lay a trap with false intel", dieRoll: { outcomes: { 1: "scene-14", 2: "scene-14", 3: "scene-14", 4: "scene-14", 5: "scene-14", 6: "scene-14" } } },
      { text: "Confront them directly", condition: { item: "weapons_cache" }, nextSceneId: "scene-14", effects: { surveillance: 40, addFlags: ["fbi_confronted"] } }
    ]
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
      { text: "Arm the movement", condition: { item: "weapons_cache" }, nextSceneId: "scene-16", effects: { surveillance: 50, addFlags: ["armed_movement"] } },
      { text: "Stay non-violent", nextSceneId: "scene-16", effects: { addFlags: ["peaceful_movement"] } },
      { text: "Train defensively only", nextSceneId: "scene-16" }
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
    autoDrawCards: 4
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
      { text: "Publish widely", dieRoll: { outcomes: { 1: "scene-18", 2: "scene-18", 3: "scene-18", 4: "scene-18", 5: "scene-18", 6: "scene-18" } } },
      { text: "Hold the intel as blackmail", nextSceneId: "scene-18" }
    ]
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
      { text: "Assume it was surveillance tech", nextSceneId: "scene-19", effects: { means: -100 } },
      { text: "Suspect Alex Mercer", dieRoll: { outcomes: { 1: "scene-19", 2: "scene-19", 3: "scene-19", 4: "scene-19", 5: "scene-19", 6: "scene-19" } }, effects: { addFlags: ["suspect_alex"] } },
      { text: "Suspect Ghost", nextSceneId: "scene-19" }
    ]
  },
  "scene-19": {
    id: "scene-19",
    act: 3,
    title: "The Crisis Meeting",
    text: [
      "The safehouse feels like a tomb. You gather the remaining inner circle.",
      "Alex stands up and delivers a rousing, passionate speech about solidarity, about avenging Darius. It unifies everyone in the room.",
      "Except you. You notice how carefully he chose his words. It was too perfect. Like it was rehearsed in front of a mirror. Or a handler."
    ],
    choices: [{ text: "Listen carefully. Say nothing.", nextSceneId: "scene-20" }],
    autoDrawCards: 5
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
      { text: "Execute the plan", dieRoll: { outcomes: { 1: "scene-23-fail", 2: "scene-23-fail", 3: "scene-23-partial", 4: "scene-23-partial", 5: "scene-23-success", 6: "scene-23-success" } } }
    ]
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
    autoDrawCards: 5
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
    choices: [{ text: "Return to Title", nextSceneId: "scene-1" }]
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
    choices: [{ text: "Return to Title", nextSceneId: "scene-1" }]
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
    choices: [{ text: "Return to Title", nextSceneId: "scene-1" }]
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
    choices: [{ text: "Watch it fall apart", nextSceneId: "e4-3" }]
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
    choices: [{ text: "Return to Title", nextSceneId: "scene-1" }]
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
    choices: [{ text: "Return to Title", nextSceneId: "scene-1" }]
  }
};
