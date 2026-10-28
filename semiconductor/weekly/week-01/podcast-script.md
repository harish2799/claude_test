# Silicon Explained — Week 1: Why “3 nanometre” isn’t 3 nanometres

**Hosts:** Dr. Meera (process and device engineer, the expert) and Rohan (an engineer new to the chip industry, the learner).
**Length:** about 15 minutes.

The audio is generated from this file. Each line starting with a speaker name in bold becomes one spoken turn.

---

**ROHAN:** Welcome to Silicon Explained, week one. I'm Rohan. I studied electronics, but I've never worked in a fab, and every week I get to ask an expert all the questions I'm slightly embarrassed to ask. With me is Dr. Meera.

**MEERA:** Hi Rohan. And no question is embarrassing. Half the industry quietly wonders about the same things.

**ROHAN:** Great, then let's start with the big one. Apple says its phone chip is made on a three nanometre process. So, is something on that chip three nanometres long?

**MEERA:** Honestly? No. Nothing important on that chip measures three nanometres. The name is a brand, a bit like a car model number.

**ROHAN:** Wait, really? Then where did the name come from?

**MEERA:** Back in the nineteen nineties, the node name roughly matched the length of the transistor's gate. A half-micron process had gates around half a micron long. Then, in the late nineties, the two drifted apart. Gate length got hard to shrink because of leakage, but engineers kept finding other ways to pack more transistors in. Every new generation kept the old naming rhythm of roughly zero point seven times the previous number. Twenty-eight, twenty, fourteen, ten, seven, five, three, two. Customers and investors expect that rhythm, so the names kept going.

**ROHAN:** So how big is the gate on a three nanometre chip?

**MEERA:** The gate length is somewhere around fifteen to twenty nanometres. And the distance from one gate to the next, which we call the contacted poly pitch, or C P P, is around forty-eight nanometres.

**ROHAN:** Okay, so if the name is marketing, what numbers should I actually look at?

**MEERA:** Think of a city map. First, the gate pitch, C P P. That's like the spacing between streets running north to south, and it sets how wide your standard cells are. Second, the minimum metal pitch. That's the spacing of the thinnest wires, the streets running east to west, and it sets how tall your cells are. Third, logic density, in millions of transistors per square millimetre. Fourth, the size of an SRAM memory cell. And finally, the money ones: what a wafer costs, and how many good chips you get from it.

**ROHAN:** You said the metal pitch sets the cell height. How exactly?

**MEERA:** A standard cell's height is counted in tracks. A track is one metal pitch, one lane for a wire. If your library uses six track cells and the metal pitch is twenty-three nanometres, the cell is six times twenty-three, about a hundred and thirty-eight nanometres tall.

**ROHAN:** So if I want smaller cells, I shrink the pitch?

**MEERA:** That was the old way. Here's the surprising part. From the five nanometre node to the two nanometre node, the gate pitch has only shrunk by about six nanometres. Pitches have nearly stopped shrinking. So the industry got clever. It shrinks the cell instead. Go from seven and a half tracks to six tracks, then to five. Use fewer fins per transistor. Put the gate contact directly on top of the transistor instead of off to the side. All of that has a name: design technology co-optimisation, or D T C O.

**ROHAN:** So D T C O is basically process engineers and designers sitting in the same room?

**MEERA:** Exactly. Ten years ago the fab made a process and threw a rulebook over the wall to the designers. Now they design the two together. That's also a good career hint, by the way. People who understand both sides are in high demand.

**ROHAN:** Noted! Let's get to the transistor itself. Why does it keep changing shape? Planar, then FinFET, now something called gate-all-around.

**MEERA:** It all comes down to one idea. The gate has to be the boss of the channel. A transistor is a switch. The gate voltage decides whether current flows from source to drain. But when the channel gets very short, the drain starts interfering. Its electric field reaches into the channel and partly turns the transistor on, even when the gate says off.

**ROHAN:** And that shows up as leakage.

**MEERA:** Right. We measure it with something called subthreshold swing: how many millivolts of gate voltage you need to change the current by ten times. At room temperature, physics sets the best possible value at about sixty millivolts per decade. A short, badly controlled transistor might be at seventy-five or eighty. That means for the same leakage, you need a higher threshold voltage, which means a higher supply voltage, which means more power.

**ROHAN:** So how do you make the gate a better boss?

**MEERA:** Three ways. Make the silicon channel thinner, so there's less silicon for the drain to sneak through. Use a better gate insulator, which is why we moved to high-k materials years ago. And the big one: wrap the gate around more sides of the channel.

**ROHAN:** That's where FinFET comes in.

**MEERA:** Yes. In an old planar transistor, the gate sits on top of a flat channel, so it touches it from one side. In a FinFET, the channel stands up like a thin wall, a fin, and the gate drapes over it like a saddle. Now the gate touches three sides. Intel shipped this first, in twenty eleven, at twenty-two nanometres, and FinFETs carried the industry for about ten years, all the way to three nanometres.

**ROHAN:** So why not keep going with fins?

**MEERA:** Two problems. First, the fins got really thin and tall, a few nanometres wide, and you can't push that much further. Second, and designers feel this one, the drive strength comes in whole fins. One fin, two fins, three fins. You can't have two and a half fins. With fewer fins per transistor, you lose flexibility.

**ROHAN:** And gate-all-around fixes both?

**MEERA:** It does. Take the fin, slice it horizontally into three or four thin ribbons, and stack them like pancakes with gaps in between. Then fill the gaps with gate. Now the gate wraps all four sides of every ribbon. Those ribbons are called nanosheets. Samsung calls the device M B C FET, Intel calls it RibbonFET, and TSMC just calls it nanosheet.

**ROHAN:** And the sizing problem?

**MEERA:** You get to choose how wide each sheet is. Narrow sheets for small, low-power cells, wide sheets for fast cells. Here's a fun calculation from this week's exercises. A two-fin FinFET with fifty nanometre tall fins has an effective width of about two hundred and twelve nanometres. A three-sheet nanosheet, each sheet thirty nanometres wide, comes to about two hundred and ten. Almost the same! So the win isn't raw current. It's better control, plus the freedom to size.

**ROHAN:** Okay, I have to ask. How on earth do you build pancakes with gate metal in between? You can't just slide metal into a three nanometre gap.

**MEERA:** Ha! That's the clever part. You grow a layer cake first. Alternate layers of silicon and silicon-germanium, one on top of the other. The silicon layers will become your channels. The silicon-germanium layers are temporary. They're placeholders.

**ROHAN:** Placeholders for the gate.

**MEERA:** Exactly. You pattern the cake into fins, build a dummy gate, form the source and drain. Then you remove the dummy gate and use a very selective etch that eats the silicon-germanium but leaves the silicon alone. Suddenly your silicon sheets are hanging in the air, held only at the ends. We call that the channel release. Then you deposit the gate insulator and the gate metals, atom layer by atom layer, so they coat every surface, including the gaps between the sheets.

**ROHAN:** That sounds incredibly hard.

**MEERA:** Three steps are especially hard. One: inner spacers. Before you grow the source and drain, you eat a little way into the edges of the silicon-germanium and fill those notches with insulator. That keeps the gate from shorting into the source and drain, and it cuts capacitance. You need control to about a nanometre. Two: the channel release itself, removing the silicon-germanium cleanly without damaging the sheets. Three: fitting the whole gate stack into gaps of about ten nanometres.

**ROHAN:** Why is the third one such a big deal?

**MEERA:** Because chip designers love options. They want several threshold voltage flavours: ultra-low, low, standard, high. Each flavour usually needs a slightly different metal stack around the gate. But with only about ten nanometres between sheets, there's no room for thick or multiple layers. So offering lots of threshold voltage options gets harder, and library designers have to use other tricks, like adjusting the gate length or the sheet width.

**ROHAN:** This connects to something I read. Equipment companies say gate-all-around is good for business. Why?

**MEERA:** Look at what we just described. Growing the layer cake is epitaxy. Removing silicon-germanium is selective etch. Coating the gaps is atomic layer deposition. And you need to measure it all, which is metrology. Every one of those is extra equipment and extra steps compared to FinFET. So companies like Applied Materials, Lam Research, Tokyo Electron, A S M International and K L A all benefit. A S M L's E U V scanners matter for patterning, but a lot of the new money goes to deposition and etch.

**ROHAN:** Nice, there's my investing angle. Last big topic: backside power. What's that?

**MEERA:** On a normal chip, all the wiring sits on top of the transistors. Maybe fifteen or more layers of metal. And two very different kinds of wiring share that space: signal wires, carrying the ones and zeros, and power wires, carrying the supply current to every transistor.

**ROHAN:** Like water pipes and data cables running through the same narrow hallway.

**MEERA:** Perfect analogy. And the power pipes have to go all the way down to the bottom, through the thinnest, most resistive wires. So you lose voltage along the way. That's called I R drop. And the power rails eat routing tracks in every cell. Backside power says: move the water pipes to the basement.

**ROHAN:** How do you even get under the transistors? They're sitting on the silicon wafer.

**MEERA:** You build the transistors and the signal wiring as usual. Then you flip the whole wafer over, bond it to a second carrier wafer, and grind away the original silicon until you're almost touching the transistors. Then you build the power network on what used to be the back. Intel calls it PowerVia, and ships it with its eighteen A process. TSMC calls it Super Power Rail, coming with its A sixteen process.

**ROHAN:** That sounds like a big win. What's the catch?

**MEERA:** A few. Grinding away the silicon removes a path for heat, so hotspots get worse. And that matters for AI chips, which burn a lot of power. Debugging gets harder too. Engineers used to probe chips from the back, and now the power network is in the way. And the whole design flow changes: power grid design, I R and electromigration sign-off, the process design kit, the E D A tools. Which, again, means jobs for people in physical design and sign-off.

**ROHAN:** Let's zoom out. Who's winning the two nanometre race?

**MEERA:** Three players. TSMC is ramping its N2 process, its first gate-all-around node, and its biggest customers, like Apple and the high-performance chip companies, go first. Intel has eighteen A, which combines RibbonFET and PowerVia. That's a big technical bet, and the real test is whether Intel can win outside foundry customers. Samsung actually shipped gate-all-around first, back in twenty twenty-two, but it has struggled with yields and winning big customers. So when you read the news, watch three things: yield, customer wins, and wafer pricing.

**ROHAN:** And not the names.

**MEERA:** Never the names! Compare density, performance per watt, SRAM cell size, yield and cost.

**ROHAN:** Before we wrap up: I want to work in chip design or AI hardware. What should I take from this week?

**MEERA:** The most interesting work right now is at the boundary between the process and the design. Standard cell library design and characterisation. D T C O. Process design kits and E D A flows. Power integrity and thermal sign-off. Gate-all-around and backside power make all of those harder, so they need more people. And many of those teams sit in design centres in India, in Bengaluru, Hyderabad and Noida.

**ROHAN:** Okay, let me try the recap. One: node names are brands. Look at pitches, density, SRAM and cost. Two: pitches have nearly stopped shrinking, and density now comes from D T C O. Three: more gate around the channel means better control, which means lower voltage. Four: nanosheets are built from a silicon and silicon-germanium layer cake, and the hard steps are inner spacers, channel release and filling the gate. Five: backside power moves the power wiring under the transistors. That frees routing and cuts I R drop, but makes heat and the design flow harder.

**MEERA:** That's a perfect summary, Rohan. Gold star.

**ROHAN:** Ha! For everyone listening: the slides and the written lesson have the diagrams, the exercises and a ten-question quiz. Next week, we're tackling lithography: how E U V works, why only one company in the world makes the machines, and what High N A changes.

**MEERA:** See you next week.

**ROHAN:** Thanks for listening to Silicon Explained!
