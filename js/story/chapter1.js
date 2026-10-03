/* ============================================================
   TWISTED — Chapter 1: "9:00 PM Sharp"
   Canon dialogue spine with branching scene graph.
   Lines: *thought/narration* · ~soft dialogue · Name: dialogue
   ============================================================ */
(function () {
  "use strict";
  const E = window.TwistedEngine;
  const ACT1 = {
    act1: {
      pov: "Adeline", mood: "morning",
      act: { id: "act1", kicker: "Chapter One · Her Side", title: "Act I — Hibernation", sub: "In which sleep dies at 10:00 AM.", mood: "morning" },
      lines: ["*There are two kinds of people in this world: those who respect a holiday, and those who own power drills.*", "*Adeline Vance had been having a wonderful dream about a locked door and a do-not-disturb sign. Then the hallway started dying.*", "*Thud. Scrape. A box dropped. Somebody's entire life, being dragged in on trolleys, one floor up and one door over.*"],
      next: "wake",
    },
    wake: { pov: "Adeline", mood: "morning", lines: ["*She surfaced from the dream into pure, concentrated noise. The clock said 10:04. Unforgivable. Unforgivable.*"], next: "wake_react" },
    wake_react: {
      pov: "Adeline", mood: "morning", lines: ["*The nerve. The absolute, load-bearing nerve of some people.*"],
      choices: [
        { label: "Storm out right now.", hint: "temper, first meeting", goto: "c1", effects: [{ stat: "temper", add: 2 }, { set: "wake_mode", value: "storm" }] },
        { label: "Lie there fuming first. Give it a minute.", hint: "composure — barely", goto: "wake_fume", effects: [{ set: "wake_mode", value: "fume" }] },
        { label: "Bang on the shared wall. Twice. Loudly.", hint: "a warning shot", goto: "wake_wall", effects: [{ stat: "temper", add: 1 }, { set: "wake_mode", value: "wall" }] },
      ],
    },
    wake_fume: { pov: "Adeline", mood: "morning", lines: ["*One minute. She granted the world one minute to fix itself. It did not take the deal.*", "*The trolley came back. It came back with friends.*"], next: "c1" },
    wake_wall: { pov: "Adeline", mood: "morning", lines: ["*Two flat smacks of her palm against the wall. Statement made. Inventory concluded.*", "*The noise paused. Then — worse — it continued with what could only be described as optimism.*"], next: "c1" },

    /* Canon spine: user's first-meeting script, with the final sentence carried by each fork. */
    c1: {
      pov: "Adeline", mood: "doorway",
      lines: [
        "*Early one morning, Adeline’s peaceful slumber was shattered by a cacophony of noises drifting in from the hallway. Irritated and bleary-eyed, she threw open her door, ready to snap at whoever was responsible. Instead, she found herself standing inches away from a stranger surrounded by a mountain of moving boxes.*",
        "{if:wake_mode=storm}*Adeline hit the hallway at full speed, sleep mask crooked and patience already gone.*{endif}",
        "{if:wake_mode=fume}*She gave the noise one final minute to apologize. It did not take the offer.*{endif}",
        "{if:wake_mode=wall}*The echo of her two warning knocks followed her into the hallway.*{endif}",
        "*She scanned him from head to toe, her expression sour. With her sleep mask pushed up onto her forehead and her voice thick with sleep, she grumbled,*",
        "Adeline: \"Notch it down a little. People are sleeping.\"",
        "*The man turned around, caught off guard by a voice he found unexpectedly melodic. His eyes landed on Adeline, who was leaning against her doorframe in her night-suit. A slow smirk spread across his face.*",
        "Zade: \"Calling it 'sleep' at 10:00 AM is a bit of a stretch,\" he countered. \"That’s more like hibernation.\"",
        "Adeline: \"Well, I’m on holiday and I love sleep,\" she shot back, crossing her arms. \"So just shut down whatever it is you’re doing and let me have some peace.\"",
        "*He let out a short, amused huff.*",
        "Zade: \"That sounds like a 'you' problem. You should probably get used to it, though—\"",
      ],
      next: "c1_choice",
    },
    c1_choice: {
      pov: "Adeline", mood: "doorway", lines: ["*Incensed by his arrogance, Adeline decided how to end the conversation.*"],
      choices: [
        { label: "Slam the door mid-sentence.", hint: "cut him off", goto: "c1_slam", effects: [{ set: "impression", value: "fiery" }] },
        { label: "Fire one last comeback — then slam.", hint: "leave a mark on the way out", goto: "c1_comeback", effects: [{ set: "impression", value: "playful" }, { set: "knows_zade_name", value: true }] },
        { label: "Promise him a noise complaint. Icily.", hint: "weaponized paperwork", goto: "c1_threat", effects: [{ set: "impression", value: "icy" }, { set: "knows_zade_name", value: true }] },
      ],
    },
    c1_slam: { pov: "Adeline", mood: "doorway", lines: ["*She slammed the door in his face mid-sentence.*"], next: "c2" },
    c1_comeback: { pov: "Adeline", mood: "doorway", lines: ["Adeline: \"Congratulations on the boxes. Truly the most interesting thing about you.\"", "Zade: \"Zade, by the way. Your new neighbor.\"", "*The door closed with the precise, musical fury of a woman who had won. From the other side came a low, delighted laugh.*"], next: "c2" },
    c1_threat: { pov: "Adeline", mood: "doorway", lines: ["Adeline: \"It's 10 AM. If that drill wakes one more person on this floor, the building manager learns your name by lunch. He's chatty. They love him.\"", "*The smirk flickered — recalculated — and held. Points for nerve, though she'd have died before awarding them.*", "Zade: \"Zade, by the way. Your new neighbor.\"", "*She shut the door before he could add anything.*"], next: "c2" },
    /* Exact scripted through-the-door exchange follows all three introductions. */
    c2: {
      pov: "Adeline", mood: "doorway",
      lines: [
        "*A beat. Then his muffled voice carried through the wood.*",
        "{if:knows_zade_name}Zade: \"That was certainly one way to introduce yourself!\"{else}Zade: \"That was certainly one way to introduce yourself! By the way, I'm Zade!\"{endif}",
        "Adeline: \"Wasn't interested in meeting you anyway!\" she shouted back, not bothering to turn around. \"Thanks for destroying the only thing I love!\"",
        "Zade: \"Now that I'm here, your list of loves will probably expand!\" he called out before entering his own apartment.",
        "*She turned back toward her bed. 'In your dreams, bubblehead,' she muttered, collapsing onto her pillows. But the silence didn't last; a few moments later, the aggressive whine of a power drill echoed through the wall.",
      ], next: "c2_choice",
    },
    c2_choice: {
      pov: "Adeline", mood: "doorway", lines: ["*Through the wall, the drill screamed on. {if:impression=icy}She considered calling the building manager. The number was already in her phone.{else}Somewhere under the irritation, something else stirred — small, and entirely unwelcome.{endif}*"],
      choices: [
        { label: "Yell back through the door.", hint: "match his volume", goto: "c2_yell", effects: [{ stat: "attraction_ad", add: 1 }] },
        { label: "Bury your face in the pillow and plot.", hint: "quiet wars win", goto: "c2_pillow" },
        { label: "Almost smile. Almost.", hint: "no one has to know", goto: "c2_smile", effects: [{ stat: "attraction_ad", add: 1 }] },
      ],
    },
    c2_yell: { pov: "Adeline", mood: "doorway", lines: ["~\"It's still going! Do you even have a permit for existing?!\"", "Zade: \"Nice to meet you too, neighbor!\""], next: "act2" },
    c2_pillow: { pov: "Adeline", mood: "doorway", lines: ["*She drafted, in her head, a formal noise complaint. It was excellent. Devastating, even. She fell asleep editing paragraph two.*"], next: "act2" },
    c2_smile: { pov: "Adeline", mood: "doorway", lines: ["*The corner of her mouth moved. Half a centimeter. Betrayal — from her own face.*", "*The drill whined on, oblivious, and she fell asleep somehow less angry than she had any right to be.*"], next: "act2" },
  };

  const ACT2 = {
    act2: {
      pov: "Adeline", mood: "daylight",
      act: { id: "act2", kicker: "Chapter One · Her Side", title: "Act II — The Transformation", sub: "In which armor is chosen carefully.", mood: "daylight" },
      lines: ["*Late afternoon. The hallway had finally gone quiet — the way a battlefield goes quiet.*", "*Adeline stood at her closet and told herself the outfit was for her. She was an excellent liar about exactly one thing, and it was this.*"], next: "ready",
    },
    ready: { pov: "Adeline", mood: "daylight", lines: ["*Black. Obviously. The hoops were not a decision; they were a reflex. The boots meant business, and the business was minding her own.*"], next: "ready_choice" },
    ready_choice: {
      pov: "Adeline", mood: "daylight", lines: ["*Mirror check. Sharp, professional, entirely unbothered. Who was she lying to, exactly?*"],
      choices: [
        { label: "This is just who I am today.", hint: "for herself. obviously.", goto: "hall" },
        { label: "…It's a little for an audience.", hint: "let him reconcile the two versions", goto: "hall", effects: [{ stat: "attraction_z", add: 1 }] },
        { label: "Definitely not for the neighbor. Definitely.", hint: "the lie she tells best", goto: "hall", effects: [{ stat: "attraction_ad", add: 1 }] },
      ],
    },
    hall: {
      pov: "Adeline", mood: "daylight",
      lines: [
        "Later that afternoon, Adeline emerged from her room, now looking sharp and professional in her work attire. She found Zade still busy in the hall.",
        "~\"Well, well,\" she said, her tone dripping with mock ceremony. \"The noisy neighbor again.\"",
        "*Zade started to reply, but the words died in his throat. He was momentarily mesmerized by the transformation from the sleepy girl in the mask to the polished woman standing before him.*",
        "*Adeline noticed his lingering gaze and offered a small, knowing smile.*",
        "*Shaking off his daze, Zade gestured to the mess.*",
        "Zade: \"What do you expect to happen when someone moves into a new place? Actually, now that you’re here, mind giving me a hand? This is a hell of a task to manage alone.\"",
        "*Ignoring his request entirely, Adeline adjusted her bag.*",
        "~\"As a 'nice' neighbor, I just came to ask if you need water or food for tonight. You can crash at my place for dinner. I have a lot of work to do right now, though.\"",
        "*Zade leaned against a crate, his charm returning.*",
        "Zade: \"I wouldn’t mind sharing a table with someone like you. I'm curious to know what you’re serving.\"",
        "~\"You’re getting Noodles ,\" she replied flatly. \"I’ll be late from work and I won't have the energy to make anything else.\"",
        "Zade: \"In that case,\" he suggested, \"since I’m on leave today and have nothing but boxes to look at, I wouldn't mind preparing everything while you're gone. If you lend me your keys, that is.\"",
        "*Adeline held up a hand.*",
        "~\"Woah, woah. Slow down, neighbor. What if you steal my stuff? I trust no one. So, if you want dinner, mister, be there at 9:00 PM sharp.\"",
      ], next: "hall_choice",
    },
    hall_choice: {
      pov: "Adeline", mood: "daylight", lines: ["*His eyebrows went up — amused, assessing. The next move was hers, and they both knew it.*"],
      choices: [
        { label: "\"I trust no one.\" Flat. Final.", hint: "the house rule", goto: "hearts", effects: [{ set: "impression_two", value: "guarded" }] },
        { label: "Dangle the suspicion like a toy.", hint: "prove you’re not a thief, neighbor", goto: "hall_tease", effects: [{ set: "impression_two", value: "teasing" }] },
        { label: "Let the consideration show for exactly one second.", hint: "a dangerous offer, briefly weighed", goto: "hall_consider", effects: [{ set: "impression_two", value: "considered" }, { stat: "trust", add: 1 }] },
      ],
    },
    hall_tease: { pov: "Adeline", mood: "daylight", lines: ["~\"Tell you what — you return my One Missed Call album exactly where you'd find it, and we'll call the keys a chapter for another day.\"", "Zade: \"You have a One Missed Call album?\"", "~\"Focus, neighbor. 9:00 PM.\""], next: "hearts" },
    hall_consider: { pov: "Adeline", mood: "daylight", lines: ["*For one second — one — she imagined handing him the keys. Dinner ready when she walked in. The sheer, reckless domesticity of it.*", "*She blinked the image away like smoke. Almost, neighbor. Almost.*"], next: "hearts" },
    hearts: { pov: "Adeline", mood: "daylight", lines: ["Zade: \"Stealing stuff isn't my thing.\" *His voice dropped an octave.* \"I steal hearts.\""], next: "hearts_choice" },
    hearts_choice: {
      pov: "Adeline", mood: "daylight", lines: ["*The hallway held its breath. One of them had to blink, and Adeline Vance had never lost a staring contest in her life.*"],
      choices: [
        { label: "Eye-roll. Walk. Legacy behavior.", hint: "the classic", goto: "goodbye", effects: [{ stat: "attraction_z", add: 1 }] },
        { label: "Fluster him for once. Find the crack.", hint: "counterattack", goto: "goodbye", effects: [{ set: "flustered_him", value: true }, { stat: "attraction_z", add: 2 }] },
        { label: "Hold the eye contact one second too long.", hint: "dangerous game", goto: "goodbye", effects: [{ set: "charged_look", value: true }, { stat: "attraction_z", add: 2 }, { stat: "attraction_ad", add: 1 }] },
      ],
    },
    goodbye: {
      pov: "Adeline", mood: "daylight",
      lines: [
        "{if:flustered_him}~\"Shame about the returns policy, though. Everything you've stolen today is going back.\" *For the first time all day, Zade Miles lost the timing of his own smile. She watched him find it again. Noted it. Filed it.*{else}Adeline scoffed, rolling her eyes.{endif}",
        "~\"Yeah, sure.\" she replied, rolling her eyes. \"If you’re late, there’s no entry. I hate being kept waiting.\"",
        "Zade: \"You don't have to remind me twice,\" he promised. \"By the way, you look good—a lot better than you did earlier.\"",
        "~\"Obviously,\" she tossed over her shoulder. \"Tell me something I don't know. Anyway, I’m late for work.\"",
        "Zade: \"Okay, I will,\" he called out. \"How about: ‘Excuse me, I have a lot of stuff to do!’\"",
        "~\"Wasn't interested anyway. Bye!\"",
        "*Zade watched her go, a genuine grin tugging at his lips. 'Ugh, that attitude... I love it,' he thought to himself, shaking his head. He turned back to his boxes, suddenly feeling a lot more motivated to finish his work before 9:00 PM.*",
      ], next: "phone",
    },
    phone: {
      pov: "Adeline", mood: "dusk", beats: { left: null, right: null },
      lines: ["*The office. 6:40 PM. Her phone lit up with a name that had never once respected a workday.*", "Priya: so. the neighbor. scale of 1 to 10. and I KNOW there's a neighbor, you said 'the neighbor' in your sleep once in a shared cab, don't argue", "~Adeline: there is no neighbor. there is a noise complaint with a jawline.", "Priya: A JAWLINE.", "~Adeline: he's cooking dinner at mine at 9 because I lost one (1) verbal exchange. it's noodles. it's discipline, not a date.", "Priya: 'it's discipline not a date' ok write that on your wedding invite I'll frame it", "*Adeline put the phone face-down. Smiled at the spreadsheet. Caught herself. Stopped. Considered restarting. Did not.*"], next: "act3",
    },
  };

  const ACT3 = {
    act3: {
      pov: "Zade", mood: "evening",
      act: { id: "act3", kicker: "Chapter One · His Side", title: "Act III — 9:00 PM Sharp", sub: "In which the door judges everyone equally.", mood: "evening" },
      lines: ["*8:00 PM. Zade Miles stood in a half-built apartment, sleeves rolled, holding a spatula like it had personally insulted him.*", "*Somewhere across the hall: his dinner reservation, his judge, jury, and executioner — 9:00 sharp, no entry after.*"], next: "boxes",
    },
    boxes: { pov: "Zade", mood: "evening", lines: ["*He'd unpacked exactly one box, and it wasn't the books. It was the heavy one. The one with the leather journal wrapped in a shirt that no longer smelled like anything but cardboard.*", "*He looked at it for four seconds too long, put it under the bed, and didn't label that box. Some inventories can wait for Chapter 2.*"], next: "prep_choice", effects: [{ set: "saw_journal", value: true }] },
    prep_choice: {
      pov: "Zade", mood: "evening", lines: ["*The challenge, verbatim: 'You're getting noodles.' Zade read that as a duel invitation.*"],
      choices: [
        { label: "Honor the noodles. Earn it.", hint: "her rules, his execution", goto: "z_ready", effects: [{ set: "cook_noodles", value: true }] },
        { label: "Improvise. Upgrade the noodles.", hint: "show off — gently", goto: "z_ready", effects: [{ set: "cook_improv", value: true }, { stat: "attraction_z", add: 1 }] },
        { label: "Order backup, just in case.", hint: "paranoia, plated", goto: "z_ready", effects: [{ set: "cook_backup", value: true }] },
      ],
    },
    z_ready: {
      pov: "Zade", mood: "evening",
      lines: ["{if:cook_noodles}*Steam, garlic, soy, and a respectable wok still boxed from his old life. Noodles, executed with respect. Her rules, his craft.*{endif}", "{if:cook_improv}*The noodles became a vehicle. Chili oil. Scallions. An egg, folded like a secret. If she wanted noodles, she'd get the best noodles of her life, and she'd hate how much she loved it.*{endif}", "{if:cook_backup}*The pan was ready AND the delivery app was loaded. Hope for the best, insure for the worst. His mother would call it wisdom. Adeline would call it something sharper.*{endif}", "*8:34. He checked his hair twice, hated that he checked it twice, and knocked on her door at —*"], next: "door_choice",
    },
    door_choice: {
      pov: "Zade", mood: "evening", lines: ["*The hallway was silent. Her door sat there like a verdict.*"],
      choices: [
        { label: "Knock at 8:41. Eager beats sorry.", hint: "nineteen minutes early", goto: "door_early", effects: [{ set: "punctuality", value: "early" }, { set: "early_bird", value: true }] },
        { label: "Knock at 9:00. Exactly.", hint: "sharp means sharp", goto: "door_sharp", effects: [{ set: "punctuality", value: "sharp" }, { stat: "attraction_ad", add: 1 }] },
        { label: "Finish the sauce first. 9:20.", hint: "the sauce is the mission", goto: "door_late", effects: [{ set: "punctuality", value: "late" }, { stat: "trust", add: -1 }] },
      ],
    },
    door_early: { pov: "Zade", mood: "evening", lines: ["*8:41. The door opened four inches. One eye. The eye was not impressed.*", "~Adeline: \"It's 8:41.\"", "Zade: \"I contain multitudes and a finished sauce.\"", "~Adeline: \"Door opens at 9:00. This is a door, and it is not 9:00.\" *It closed with the softness of an insult.*", "*He waited nineteen minutes in the hallway like a man outside a principal's office, holding noodles.*"], next: "d1" },
    door_sharp: { pov: "Zade", mood: "evening", lines: ["*9:00:00. He raised his knuckles. The door opened first — she'd been watching the clock too, then. He filed that away, carefully, where he kept things.*"], next: "d1" },
    door_late: { pov: "Zade", mood: "night", lines: ["*9:22. The sauce had won. The sauce had won completely.*", "*He knocked. Silence. He knocked again, and the door did not open, because she had told him — plainly, in a hallway — that it would not.*"], next: "locked_out" },
    locked_out: { pov: "Zade", mood: "night", lines: ["Zade: \"Adeline. The sauce needed one more minute.\"", "*Through the wood, muffled, terrible, triumphant:*", "~Adeline: \"That was certainly one way to test a house rule!\" *A pause he could feel.* \"I hate being kept waiting. I warned you.\"", "*He leaned his forehead against the door. Somewhere inside, bare feet padded away from it.*", "*Then — a whisper of paper. A folded note slid under the door, straight and businesslike:*", "*'9:00 means 9:00. Noodles are getting cold. You have 30 seconds to knock like you mean it. — A.'*", "*He knocked like he meant it. The lock turned. Her face: furious, gorgeous, fighting the left corner of her mouth with everything she had.*"], next: "d1", effects: [{ set: "late", value: true }] },
    d1: { pov: "Zade", mood: "dinner", lines: ["{if:late}*The door swung wide.*{else}*The door swung wide, and the smell of her place hit him — clean laundry, something vanilla, a life with a system.*{endif}", "~Adeline: \"Shoes off. Comments off. Sit.\"", "Zade: \"You're allowed to say thank you.\"", "~Adeline: \"I'm allowed a lot of things I don't do.\""], next: "d2" },
    d2: { pov: "Zade", mood: "dinner", lines: ["*Her table was set for two. Two plates, two glasses, and the good candles — which meant some version of her had been preparing for this since 6 PM, and he was absolutely not allowed to know that. He decided not to say this out loud, out of self-preservation.*", "~Adeline: \"Okay. Plate me.\""], next: "d3" },
    d3: { pov: "Zade", mood: "dinner", lines: ["*She ate like she argued: precise, committed, no survivors. He pretended not to watch. He was bad at pretending.*", "{if:cook_noodles}~Adeline: \"…These are the noodles.\" *Said like a confession wrung out of a hostage.* \"Fine. FINE. The neighbor can cook.\"{endif}", "{if:cook_improv}~Adeline: \"What did you DO to the noodles.\" *Another bite. Another. She put her fork down like it had betrayed her.* \"I'm not saying it's good. My face is saying it, but I'm not.\"{endif}", "{if:cook_backup}*The delivery bag stayed hidden by the door, insurance he'd never need. Confidence, apparently, was just fear with a good tailor.*{endif}"], next: "d4" },
    d4: { pov: "Zade", mood: "dinner", lines: ["Zade: \"For the record — 'I steal hearts' — I stand by it. I cook for my heists. It's the trap.\"", "~Adeline: \"The trap needs work. The victim is doing the dishes after.\"", "Zade: \"Bold of you to assume I'm not staying for that too.\""], next: "d5" },
    d5: { pov: "Zade", mood: "dinner", lines: ["*On her bookshelf, spines arranged like soldiers. One shelf, one shelf only, was a mess: novels, all dog-eared. He reached —*", "~Adeline: \"Touch the shelf and lose the hand.\"", "Zade: \"Noted. What's the shelf called?\"", "~Adeline: \"None of your business.\" *A beat.* \"…It's the 'believable people' shelf.\"", "Zade: \"Meaning the rest of them aren't.\"", "~Adeline: \"Meaning the rest of them I haven't finished.\""], next: "d6" },
    d6: { pov: "Zade", mood: "dusk", lines: ["*Dishes done — she'd allowed it, arms crossed, supervising like a foreman — she poured two glasses of wine and, unexplained, opened the window to the fire escape instead of the balcony.*", "~Adeline: \"Fire escape. The balcony is being punished for something else.\"", "*They sat in the doorway, plates balanced on knees, the city doing its orange-to-indigo trick below them.*"], next: "d7" },
    d7: { pov: "Zade", mood: "dusk", lines: ["~Adeline: \"Why do you do that?\"", "Zade: \"Do what?\"", "~Adeline: \"The… act. The lines. 'I steal hearts.' You checked your hair twice before knocking — don't argue, the peephole sees everything — so you're not casual. So what's the act FOR?\"", "*The city hummed. Zade looked at his wine, and for once in his life didn't answer with a line.*", "Zade: \"Habit. People like people who seem… finished. Nobody asks questions about a finished thing.\"", "~Adeline: \"That's the saddest sentence I've ever heard a handsome man say.\" *She heard herself say 'handsome.' She took a long sip of wine and dared him, with her whole face, to mention it.*", "*He did not mention it. It was, possibly, the bravest thing he'd ever done.*"], next: "d8", effects: [{ stat: "attraction_ad", add: 2 }, { stat: "trust", add: 1 }] },
    d8: { pov: "Zade", mood: "dinner", lines: ["*They migrated back inside as the night cooled. She sat cross-legged on the counter — ON it, like a rule-breaker with excellent boots — and pointed a chopstick at him.*", "~Adeline: \"Okay, neighbor. Truth tax. Worst thing you unpacked today. Go.\"", "Zade: \"A box I didn't label.\"", "~Adeline: \"Creepy. Accepted.\""], next: "d9" },
    d9: { pov: "Zade", mood: "dinner", lines: ["*It happened in the kitchen, the way these things do: all at once and very slowly.*", "*He reached past her for the last clean plate. She didn't move. The counter was behind her, his arm was beside her hip, and the kitchen was suddenly the size of a phone booth.*", "*Her perfume was vanilla and something darker. His sleeve brushed her arm — a two-second accident neither of them corrected.*", "~Adeline: \"You're doing the act again.\" *Quieter now.* \"Your voice dropped an octave.\"", "Zade: \"Noted.\" *He didn't step back.*", "~Adeline: \"You should step back.\"", "Zade: \"You should stop holding my sleeve.\"", "*She looked down. She was holding his sleeve. She did not stop holding his sleeve.*"], next: "d10_choice" },
    d10_choice: { pov: "Zade", mood: "dinner", lines: ["*The kitchen hummed. Her hand on his sleeve. The whole night balanced on a hinge, and the hinge was him.*", "Adeline: \"Ask me first.\""], choices: [{ label: "Close the distance. Kiss her.", hint: "the risky one", goto: "k1" }, { label: "Say the true thing instead.", hint: "honesty, unarmored", goto: "real1" }, { label: "Make a joke of it.", hint: "safe. cowardly. familiar.", goto: "joke1" }] },
    k1: { pov: "Zade", mood: "night", lines: ["Zade: \"Can I kiss you?\"", "Adeline: \"Yes.\" *She answered by letting go of his sleeve and taking his collar instead.*", "*The kiss landed somewhere between a decision and a surrender. Her hand fisted in his shirt like he might be confiscated. The pan went cold on the stove, unbothered, off-duty.*", "*When they broke apart, she kept her eyes closed one extra second. He watched her reassemble the armor and fail at the left corner of her mouth. Again. Always the left corner.*", "~Adeline: \"…That's not in the house rules.\"", "Zade: \"Write a new rule.\"", "~Adeline: \"Get out before I do.\" *She said it against his jaw, which undermined the threat considerably.*", "*At her door, shoes in hand, he looked back. She was still on the counter, exactly where he'd left her, smiling like a safe-cracker.*"], next: "close_spark", effects: [{ set: "kissed_dinner", value: true }, { stat: "attraction_ad", add: 2 }] },
    real1: { pov: "Zade", mood: "night", lines: ["*He stepped back. One full step — the hardest unit of distance in his entire life.*", "Zade: \"The act's easier. The act doesn't get people evicted from your good shelf.\"", "~Adeline: \"Zade.\"", "Zade: \"I don't want the performance with you. I want whatever this is when your voice does the quiet thing. I want the 'believable people' shelf. I want to be finished enough to deserve a dog-ear.\"", "*Silence. The refrigerator hummed its judgment. She looked at him the way she'd looked at the noise at 10 AM — like something she'd have to reorganize her whole day around.*"], next: "real2" },
    real2: { pov: "Zade", mood: "night", lines: ["~Adeline: \"Okay. New terms, since you insist on being a person. I don't trust easily. You've got 'funny' and 'cooks' — that's two of maybe nine required virtues.\"", "Zade: \"What's virtue number three?\"", "~Adeline: \"Consistency. Tomorrow exists, neighbor. So does the day after.\"", "*She slid off the counter, took his wrist, and walked him to the door — unhurried, deliberate, terrifying. At the threshold she kissed his cheek, an inch from everything.*", "~Adeline: \"Goodnight, Zade. Be early. Not 8:41 early.\""], next: "close_smolder", effects: [{ stat: "trust", add: 2 }, { stat: "attraction_ad", add: 1 }] },
    joke1: { pov: "Zade", mood: "night", lines: ["Zade: \"So — is this the part where the ceiling fan falls on us, or…?\"", "*The kitchen exhaled. She laughed — a real one, startled out of her — and let go of his sleeve.*"], next: "joke2" },
    joke2: { pov: "Zade", mood: "night", lines: ["~Adeline: \"You ruin everything. It's almost impressive.\" *She hopped off the counter, took his plate, and pointed at the door — the executioner's gesture, executed warmly.*", "~Adeline: \"Same time tomorrow. And neighbor — the act's fine. The act is safe. Whatever that was, just now? Put it back in the box you didn't label.\"", "*He walked home four feet. It took a while.*"], next: "close_joke_check", effects: [{ stat: "attraction_z", add: 1 }] },
    close_joke_check: { pov: "Zade", mood: "night", lines: ["*One more laugh than the night strictly called for. He'd take it. He'd take anything she handed him, apparently.*"], next: function (s) { return s.stats.attraction_z >= 5 ? "close_spark" : "close_cold"; } },
    close_spark: { pov: "Zade", mood: "night", lines: ["*Midnight. His apartment was still a cardboard nation, and he'd never liked a place less or a hallway more.*", "{if:late}*He was already drafting the apology. It was going to involve breakfast. It was going to be excellent.*{endif}", "{if:impression=icy}*He'd have to ask before he knocked on her door tomorrow. He wanted to get it right this time.*{endif}", "*Then he saw it — a folded note under his door. Cream paper. Her handwriting, slanted and sure:*", "*'The noodles needed salt. Same time tomorrow. Don't be early. — A.'*", "{if:early_bird}*Underneath, smaller, like it had lost an argument on the way out: '…8:41 was acceptable.'*{else}*Underneath, smaller, like it had lost an argument on the way out: 'P.S. Whatever that was tonight — do it again.'*{endif}", "*Zade laughed alone in a box-filled apartment at midnight like a maniac. Across the hall, a light went off. Chapter 2 — The Letter — was going to be a problem.*"], next: null, effects: [{ set: "chapter_close", value: "spark" }, { set: "note_under_door_of", value: "zade" }] },
    close_smolder: { pov: "Zade", mood: "night", lines: ["*Midnight. The hallway between their doors had never felt so short and so wide at the same time.*", "{if:late}*Tomorrow, he'd be early. Not 8:41 early. The good kind.*{endif}", "*He found a folded note under his door. Graph paper — from her work notebook. Her handwriting, clipped, official, and fighting itself:*", "*'Virtue three, demonstrated: you asked instead of took. Credit where due. Noodles tomorrow. Consistency starts at 9:00. — A.'*", "*He read it four times. Then he got out a pen, and on the back of a moving-box flap, started drafting his reply. Chapter 2 — The Letter — was going to be a problem.*"], next: null, effects: [{ set: "chapter_close", value: "smolder" }, { set: "note_under_door_of", value: "zade" }] },
    close_cold: { pov: "Zade", mood: "cold", lines: ["*Midnight. He lay on a mattress in a cardboard nation, staring at a ceiling he didn't know yet.*", "{if:late}*9:22. He'd blown the one rule she'd written in ink. Tomorrow he'd knock at 8:59:59 and stand there.*{endif}", "*No note under his door. He checked twice. Then, at her door — where she'd never know — he left one anyway:*", "*'Best noodles in the city. Same time tomorrow. Consistency, virtue three, starts now. — Z.'*", "*Whether she read it, and what she did with the pen she surely owned, is Chapter 2's problem. Chapter 2 — The Letter. It was going to be a problem.*"], next: null, effects: [{ set: "chapter_close", value: "cold" }, { set: "note_under_door_of", value: "adeline" }] },
  };
  const scenes = {};
  [ACT1, ACT2, ACT3].forEach(function (group) { Object.keys(group).forEach(function (id) { if (scenes[id]) throw new Error("duplicate scene: " + id); scenes[id] = group[id]; }); });
  E.registerChapter(1, { num: 1, title: "9:00 PM Sharp", start: "act1", scenes: scenes });
})();
