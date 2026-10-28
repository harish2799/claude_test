# Silicon Explained — Week 1: How computer chips work

**Hosts:** Dr. Meera (chip engineer, the expert) and Rohan (curious, no background in chips, the learner).
**Length:** about 13 minutes. No background needed.

The audio is generated from this file. Each line starting with a speaker name in bold becomes one spoken turn.

---

**ROHAN:** Welcome to Silicon Explained, episode one. I'm Rohan, and I'll be honest: I use my phone all day, but I have no idea what's actually inside it. So every week I'm going to ask an expert all the basic questions. With me is Dr. Meera.

**MEERA:** Hi Rohan. Basic questions are the best kind. Even engineers had to start somewhere.

**ROHAN:** Let's start at the very beginning. People keep saying "chips". What is a chip?

**MEERA:** Pick up your phone. Somewhere inside is a small, flat square of silicon, about the size of your fingernail. That's the chip. It's the phone's brain. It runs your apps, plays your videos, takes your photos, everything.

**ROHAN:** And what's inside the chip?

**MEERA:** If you zoomed in with a super-powerful microscope, you'd see billions of tiny switches. They're called transistors. And each switch can only do one thing: be on, or be off.

**ROHAN:** Just on or off? That's it?

**MEERA:** That's it. On means one, off means zero. Every photo, every song, every message you've ever sent is stored and processed as long patterns of ones and zeros. With billions of switches flipping billions of times every second, you get everything your phone can do.

**ROHAN:** Okay, so how does a switch that small actually work?

**MEERA:** Think of a water tap. There's a tank of water on one side. We call that the source. There's a pipe, which we call the channel. And there's where the water ends up, the drain. In the middle is the tap handle, and on a transistor that's called the gate.

**ROHAN:** So the gate is the handle.

**MEERA:** Exactly. Put a small voltage on the gate and the tap opens, so electric current flows from source to drain. That's a one. Remove the voltage and the tap closes, no current. That's a zero.

**ROHAN:** How many of these taps are we talking about?

**MEERA:** Here's a fun comparison. In nineteen seventy-one, Intel made one of the first computer chips. It had about two thousand three hundred switches. In the year two thousand, a desktop computer chip had about forty-two million. And the chip inside an iPhone fifteen Pro, from twenty twenty-three, has about nineteen billion.

**ROHAN:** Nineteen billion! In something the size of my fingernail?

**MEERA:** Yes! And that's the whole story of the chip industry: make the switches smaller, fit more of them in, and the chip can do more.

**ROHAN:** So how small is one switch?

**MEERA:** We measure them in nanometres. A nanometre is one billionth of a metre. A human hair is about eighty thousand nanometres wide. A virus is about a hundred. The control part of a modern switch, the gate, is about fifteen to twenty nanometres long. So you could line up about four thousand of them across a single hair.

**ROHAN:** That's wild. But why do we keep making them smaller? Isn't it good enough already?

**MEERA:** Four reasons. One, more switches fit in the same space, so you get more features, like better camera processing and AI. Two, signals travel shorter distances, so the chip is faster. Three, smaller switches use less energy, so your battery lasts longer. And four, more chips fit on each silicon disc in the factory, so each one costs less to make.

**ROHAN:** Okay, now the question I really wanted to ask. Phone companies say their chip is "three nanometre". So the switches are three nanometres?

**MEERA:** This surprises everyone. No. Nothing on a three nanometre chip is actually three nanometres.

**ROHAN:** What? Then why call it that?

**MEERA:** Have you ever bought wood from a hardware store? A plank sold as a "two by four" isn't two inches by four inches. It's actually one and a half by three and a half. The name is an old tradition that stuck.

**ROHAN:** Huh, I didn't know that!

**MEERA:** Chips are the same. Thirty years ago, the name of a chip generation really did match the size of its switches. Over time the two drifted apart, but the industry kept counting down the names anyway. Fourteen, ten, seven, five, three, two. On a "three nanometre" chip, the switches are about twenty nanometres long and about forty-eight nanometres apart.

**ROHAN:** So "three nanometre" really just means "the next generation after five nanometre".

**MEERA:** Exactly, like "iPhone fifteen" just means the one after "iPhone fourteen". So when you compare chips, don't look at the nanometre number. Look at what they actually do: speed, battery life, and cost.

**ROHAN:** Got it. So what happens when you keep shrinking the switches? Does it just keep working?

**MEERA:** No, and this is the big problem. When a switch gets really tiny, it starts to leak. Even when it's supposed to be off, a little current sneaks through. Like a tap that keeps dripping.

**ROHAN:** And one drip doesn't matter, but billions of dripping taps...

**MEERA:** ...waste your battery and make your phone warm. Exactly.

**ROHAN:** So how do you stop the dripping?

**MEERA:** Imagine you want to stop water flowing through a garden hose by squeezing it. If you press down with one finger on top, water still gets through. If you grip it with your whole hand around three sides, much better. And if you squeeze it with your whole fist, all the way around, it stops completely.

**ROHAN:** So more grip, less leaking.

**MEERA:** That's exactly what chip engineers did. Old switches were flat, and the gate only touched the channel from the top. That's the one finger. Then, in twenty eleven, Intel introduced the FinFET. The channel stands up like a thin wall, a fin, and the gate wraps over three sides. That's your hand.

**ROHAN:** And the fist?

**MEERA:** That's the newest design, called gate-all-around. The channel is split into three thin sheets, stacked like pancakes, and the gate wraps around every side of every sheet. Samsung shipped it first, in twenty twenty-two, and TSMC and Intel followed around twenty twenty-five.

**ROHAN:** Hold on. How do you get the gate in between pancakes that are only a few nanometres apart? You can't just slide metal in there.

**MEERA:** Ha, great question! They use a layer cake trick. First, you build a stack of alternating layers, like a cake. Silicon layers, which are the sponge you want to keep, and temporary layers, which are like the jam.

**ROHAN:** Okay, sponge and jam.

**MEERA:** Then you use a special chemical that dissolves only the jam. Suddenly you've got silicon sheets floating with empty gaps between them, held up at the ends. Finally, you spray in the gate material one atom-thick layer at a time, so it coats every side of every sheet and fills the gaps.

**ROHAN:** That's incredibly precise.

**MEERA:** It is. And that's good news for the companies that build the machines that do this. Names like Applied Materials, Lam Research, and A S M L. When chips move to a new design, those machine makers get busy.

**ROHAN:** Okay, there was one more thing on my list: power from the back? What's that?

**MEERA:** On top of all those switches, a chip has more than ten layers of tiny wires. Some carry data, the ones and zeros. Some carry power, the electricity the switches need.

**ROHAN:** And they're all mixed up together?

**MEERA:** Imagine a house where the water pipes and the internet cables are all crammed into the same ceiling. It's messy, and the long, thin water pipes lose pressure along the way. On a chip, that means wasted electricity.

**ROHAN:** So what's the fix?

**MEERA:** Move the water pipes to the basement! Engineers flip the chip over and build the power wiring underneath the switches. Now the ceiling is tidy, just for data, and the power pipes are short and fat, so less electricity is wasted. Intel calls it PowerVia, and TSMC calls it Super Power Rail.

**ROHAN:** I love that. Last question: who actually makes these chips?

**MEERA:** Only three companies in the world can make the most advanced ones. TSMC in Taiwan is the biggest. It makes chips for Apple, Nvidia, AMD and others. Samsung in South Korea, and Intel in the United States.

**ROHAN:** Wait, so Apple doesn't make its own chips?

**MEERA:** Apple designs them. TSMC builds them. A company that builds chips for others is called a foundry. And building one advanced chip factory costs more than twenty billion dollars.

**ROHAN:** Okay, let me try a recap. One: a chip is billions of tiny on-off switches called transistors, and each one works like a tap. Two: smaller switches mean more features, more speed, longer battery and lower cost. Three: "three nanometre" is a nickname, like a two-by-four plank of wood. Four: tiny switches leak, so the gate now wraps all the way around, like squeezing a hose with your fist. Five: power wiring is moving to the basement, underneath the switches.

**MEERA:** Perfect, Rohan! You've just explained week one better than many textbooks do.

**ROHAN:** Ha, thanks! Everyone listening: the slides have pictures of everything we talked about, the tap, the hose, the layer cake and the house. Next week: how chips are actually printed, using light.

**MEERA:** See you next week!

**ROHAN:** Thanks for listening to Silicon Explained!
