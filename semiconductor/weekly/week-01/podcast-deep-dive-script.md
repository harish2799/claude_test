# Silicon Explained — Week 1 deep dive: Inside the transistor

**Hosts:** Dr. Meera (chip engineer, the expert) and Rohan (the learner, who has finished the beginner episode).
**Length:** about 20 minutes. Listen to the beginner episode first.

The audio is generated from this file. Each line starting with a speaker name in bold becomes one spoken turn.

---

**ROHAN:** Welcome back to Silicon Explained. This is the week one deep dive. Last episode, Dr. Meera explained chips with taps, hoses and layer cakes. Today I want the real thing: the physics, the actual measurements, and how these transistors are built. But still in words I can follow.

**MEERA:** Deal. Every time I use a technical word, I'll explain it. And if I forget, stop me.

**ROHAN:** I will! Let's start with the transistor itself. Last time it was a tap. What is it really?

**MEERA:** The real name is MOSFET. It stands for metal, oxide, semiconductor, field-effect transistor, and the name describes its layers from the top. A metal gate on top. Under it, a very thin insulator, the oxide. And under that, the silicon, which is the semiconductor.

**ROHAN:** And "field effect"?

**MEERA:** The gate never touches the current. It controls it from above with an electric field, like a magnet pulling metal filings without touching them.

**ROHAN:** Okay. So where does the current actually flow?

**MEERA:** There are three silicon regions side by side. On the left, the source. On the right, the drain. Both are "doped", which means we add a pinch of another element, like phosphorus, so they're packed with spare electrons. In the middle is the body, doped the opposite way, with boron. It has almost no free electrons. So by default, electrons in the source can't cross the body. The switch is off.

**ROHAN:** So how does it turn on?

**MEERA:** You put a positive voltage on the gate. That positive charge attracts electrons. They gather in a very thin layer right under the oxide, maybe one or two nanometres thick. Once enough collect, that layer conducts. It's a bridge from source to drain, and we call it the channel.

**ROHAN:** So the channel only exists when the switch is on.

**MEERA:** Exactly. And the gate voltage where the channel just appears is called the threshold voltage, or V T. Today it's around a quarter to a third of a volt.

**ROHAN:** You mentioned the oxide is thin. How thin?

**MEERA:** About one nanometre. That's only a handful of atoms. In fact, around two thousand seven, the old material, silicon dioxide, got so thin that electrons started tunnelling straight through it. So the industry switched to hafnium oxide, called a high-k material, which works like a thinner insulator but can be physically thicker.

**ROHAN:** Okay. Last episode you said tiny switches leak. How do engineers actually measure that?

**MEERA:** With what I call the report card. You slowly raise the gate voltage and measure the current. You plot it on a log scale, where each step up means ten times more current.

**ROHAN:** Why a log scale?

**MEERA:** Because the current goes from a few picoamps, trillionths of an amp, when the switch is off, to about a hundred microamps when it's on. That's a range of ten million. Only a log scale shows both ends.

**ROHAN:** And what do you read from it?

**MEERA:** Three numbers. First, I off: the current at zero volts on the gate. That's the leak. Second, I on: the current at full voltage, which tells you how fast the chip can run. And third, the steepness of the curve in between, called the subthreshold swing, S S. It's how many millivolts of gate voltage you need to raise the current ten times.

**ROHAN:** And smaller is better?

**MEERA:** Smaller is better. And here's something beautiful: physics sets a limit. At room temperature, the best possible value is about sixty millivolts for every ten times more current.

**ROHAN:** Why sixty?

**MEERA:** Electrons don't all have the same energy. Like water molecules in a warm pond, some are jumping higher than others. The spread is set by temperature, about twenty-six millivolts at room temperature. To get ten times more electrons over the barrier, you need two point three times that. Twenty-six times two point three is about sixty. No ordinary transistor can beat it.

**ROHAN:** And real transistors?

**MEERA:** Good ones are around sixty-five to seventy-five. And it matters a lot. Say you want ten times less leakage. You have to raise V T. With a seventy-five millivolt slope, you raise it seventy-five millivolts. With sixty, only sixty. A higher V T means you need a higher supply voltage, and power goes up roughly with the square of voltage.

**ROHAN:** So a sloppy slope costs battery life.

**MEERA:** Exactly.

**ROHAN:** Now, why do short transistors leak more? You used a hose last time.

**MEERA:** For the deep dive, I'll use a dam. Picture electron energy as height. The source is a reservoir full of electrons. The drain is lower ground. And in between there's a dam, an energy barrier. The gate controls the dam's height. Raise the gate voltage and the dam goes down, so electrons flow.

**ROHAN:** Okay, I can picture that.

**MEERA:** In a long transistor, the drain is far away, so only the gate controls the dam. But in a very short one, the drain is right next to the dam, and its voltage pulls the dam down too, and makes it thinner. So even when the gate says off, electrons spill over the top.

**ROHAN:** And that has a name?

**MEERA:** D I B L. Drain-induced barrier lowering. It's the classic short-channel effect.

**ROHAN:** So how do you fight it?

**MEERA:** Engineers use a rule of thumb called the natural length. You don't need the formula. It just says three things help. Make the silicon thinner, so there's less room for the drain's influence to sneak underneath. Use a better insulator. And wrap more gate around the channel. That last one is the big one: one side, then three sides with FinFET, then all four with nanosheets.

**ROHAN:** Let's switch to measuring nodes. Last time you said three nanometre is a nickname. What do engineers actually measure?

**MEERA:** Two distances. Chips are built from standard cells, which are like Lego bricks for logic. Each brick's width is counted in gate pitches, the distance from one gate to the next. Engineers call it C P P. On a three nanometre class process, it's about forty-eight nanometres.

**ROHAN:** And the height?

**MEERA:** The height is counted in metal tracks, the lanes for the tiny wires on top. The distance between wires is the metal pitch, M M P, about twenty-three nanometres. A six-track cell is six times twenty-three, so about a hundred and thirty-eight nanometres tall.

**ROHAN:** So to shrink the chip, you shrink those pitches?

**MEERA:** That's the surprising part. From the five nanometre generation to two nanometre, the gate pitch only shrank about six nanometres. It's nearly stopped. So engineers shrink the cell instead. Go from seven and a half tracks to six, then to five. Same pitch, but the cell is a third shorter. That approach has a name, D T C O, design technology co-optimisation. The factory engineers and the cell designers redesign the rules together.

**ROHAN:** You also mentioned SRAM. What's that?

**MEERA:** SRAM is the fast memory built into every chip, the cache. Each bit uses six transistors. And here's the problem: SRAM has almost stopped shrinking. TSMC's reported memory cell was about the same size at five nanometre and three nanometre. And AI chips need enormous caches.

**ROHAN:** So what do they do?

**MEERA:** Split the chip. Keep the logic on the expensive new process, and put the memory on a cheaper chiplet, or stack it on top. We'll cover that in week five.

**ROHAN:** Okay, FinFET versus nanosheet. Give me the real numbers.

**MEERA:** A fin is about fifty nanometres tall and six wide. The gate wraps three sides, so the effective width is two times fifty plus six, a hundred and six nanometres per fin. And you can only use whole fins: one, two or three.

**ROHAN:** Like buying pipes only in fixed sizes.

**MEERA:** Exactly. A nanosheet transistor has three sheets, each about five nanometres thick. The gate wraps all four sides of each sheet. If the sheets are thirty nanometres wide, that's three times two times thirty-five: two hundred and ten nanometres. Nearly the same as two fins. But you can make the sheets fifteen nanometres wide, or forty-five, or anything in between. Designers get fine control back.

**ROHAN:** Now the build. You told me about the layer cake. What are the real steps?

**MEERA:** There are eight main ones. The secret is building everything around placeholders. Step one: grow alternating layers of silicon and silicon-germanium, each a few nanometres thick. That's done by epitaxy, which means growing a perfect crystal layer on top of another crystal.

**ROHAN:** Okay.

**MEERA:** Step two: put a fake gate on top, a dummy gate, just to mark where the real one goes. Step three: etch away the layer cake everywhere except under that dummy gate. Step four is the first hard one: inner spacers.

**ROHAN:** What are those?

**MEERA:** You etch a few nanometres sideways into the ends of each silicon-germanium layer, and fill those little notches with insulator. Later, when the real gate fills the gaps, these insulators stop it touching the source and drain. And you need about one nanometre of precision, on billions of transistors, across the whole wafer.

**ROHAN:** That sounds terrifying.

**MEERA:** It's one of the hardest steps in the industry. Step five: grow the source and drain out from the edges of the silicon sheets. Step six, hard step number two: remove the dummy gate, then use a chemical that dissolves silicon-germanium about a hundred times faster than silicon. The silicon sheets are left floating, held only at their ends.

**ROHAN:** And step seven fills the gaps.

**MEERA:** Yes, the third hard step. We use atomic layer deposition, A L D, which coats surfaces one atomic layer at a time, so it reaches inside gaps only about ten nanometres wide. First the insulator, then several metal layers. And this creates a problem for designers.

**ROHAN:** What problem?

**MEERA:** Designers like several flavours of transistor: fast but leaky ones, and slow but frugal ones. Each flavour has a different threshold voltage, which usually needs a different metal stack. In a ten nanometre gap there's no room for lots of layers. So nanosheets offer fewer flavours, and designers use other tricks.

**ROHAN:** And step eight?

**MEERA:** Contacts: metal plugs connecting the source, drain and gate to the wiring above.

**ROHAN:** Speaking of wiring, backside power. What's really going on there?

**MEERA:** Above the transistors are more than fifteen layers of wires. The bottom ones are only tens of nanometres wide. At that size, copper gets very resistive, because electrons bounce off the edges of the wire. Think of drinking through a thinner and thinner straw.

**ROHAN:** So power has to squeeze through the thinnest straws.

**MEERA:** Right. Power traditionally comes in from the top and squeezes down to every transistor, losing voltage along the way. That loss is called I R drop. Backside power flips the wafer over, grinds away almost all the original silicon, and builds a thick power network underneath.

**ROHAN:** And Intel and TSMC do it differently?

**MEERA:** Intel's PowerVia uses tiny pillars, nano T S Vs, through-silicon vias, that run up beside the transistors. It's simpler, and Intel shipped it first with eighteen A. TSMC's Super Power Rail, coming with A sixteen, connects power directly into each transistor's source from below. That's harder to make, but it saves more space.

**ROHAN:** What's the catch?

**MEERA:** Heat. Grinding away the silicon removes some of the material that spreads heat, so hotspots get worse. Debugging is harder too. And the whole design flow changes: power grids, voltage-drop checks, and checks for electromigration.

**ROHAN:** Electro what?

**MEERA:** Electromigration. When a lot of current flows through a tiny wire, it slowly pushes metal atoms along, like a river moving pebbles. Over years, the wire can break. Engineers have to sign off that it won't.

**ROHAN:** And after nanosheets?

**MEERA:** Two ideas. Every logic gate needs an n-type and a p-type transistor side by side. Forksheet puts an insulating wall between them so they can sit much closer, about three quarters of the space. Then CFET, complementary FET, stacks one directly on top of the other, about half the space. That's expected in the twenty thirties.

**ROHAN:** Last part: careers. I'm interested in chip design. What does this week mean for me?

**MEERA:** Every change we discussed creates design work. Standard-cell library designers build those Lego bricks, and nanosheets give them new options. D T C O engineers co-design the rules. Physical design engineers place and wire the chip, and backside power changes their power grids. Power-integrity engineers sign off voltage drop and electromigration. And verification engineers prove it all works before tape-out.

**ROHAN:** Tape-out?

**MEERA:** The moment the final design is sent to the factory. Many of these roles are hiring in Bengaluru, Hyderabad and Noida.

**ROHAN:** Okay, let me try the deep-dive recap. One: a gate voltage above the threshold pulls electrons up to form the channel. Two: you grade a switch by its on current, its off leakage, and its slope, which can't beat sixty millivolts per decade. Three: short channels leak because the drain pulls the energy dam down, D I B L. Four: nodes are really measured by gate pitch, metal pitch and tracks, and density now comes mostly from D T C O. Five: nanosheets are built with silicon-germanium placeholders that get swapped for the real gate. Six: backside power moves the power wires under the transistors.

**MEERA:** That's a deep dive, Rohan. You could explain that in a job interview.

**ROHAN:** Ha, that's the plan! Everyone, the deep-dive slides and notes have all the diagrams, worked examples and practice problems. Next week: lithography, how chips are printed with light.

**MEERA:** See you next week.

**ROHAN:** Thanks for listening to Silicon Explained!
