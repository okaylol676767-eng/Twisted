/* ============================================================
   TWISTED — cinematic opening sequence.
   ============================================================ */
(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const cards = [
    { eyebrow: "A NEIGHBORHOOD STORY", title: "Two doors.<br>One wall.", text: "On a quiet floor, a new neighbor is about to make himself impossible to ignore." },
    { eyebrow: "ADELINE VANCE · 10:04 AM", title: "Her holiday.<br>Her rules.", text: "She guards her sleep, her space, and the narrow order of a life she worked hard to arrange. The sleep mask is part of the policy." },
    { eyebrow: "ZADE MILES · MOVING DAY", title: "A fresh start<br>in cardboard.", text: "He brought boxes, a power drill, a charm that arrives before he does—and one heavy, unlabeled box he is not ready to open." },
    { eyebrow: "ONE FLOOR · TWO APARTMENTS", title: "Then the wall<br>starts shaking.", text: "A drill cuts through Adeline’s quiet morning. A complaint becomes a first meeting. A first meeting becomes a dinner invitation with a strict deadline." },
    { eyebrow: "CHAPTER ONE", title: "9:00 PM<br>sharp.", text: "Her house rules. His dinner. Your choices. Begin the story." },
  ];
  const screen = $("introScreen"), eyebrow = $("introEyebrow"), title = $("introTitle"), text = $("introText"), progress = $("introProgress");
  const button = $("btnIntroNext"), skip = $("btnIntroSkip");
  let index = 0, resolver = null, started = false, playPromise = null;
  function paint() {
    const card = cards[index];
    eyebrow.textContent = card.eyebrow; title.innerHTML = card.title; text.textContent = card.text;
    progress.innerHTML = cards.map((_, i) => `<i class="${i === index ? "active" : ""}"></i>`).join("");
    button.innerHTML = index === cards.length - 1 ? 'Begin <span aria-hidden="true">→</span>' : 'Continue <span aria-hidden="true">→</span>';
    button.focus({ preventScroll: true });
  }
  function close() {
    if (!started) return;
    started = false; screen.classList.remove("visible");
    document.body.classList.remove("intro-playing");
    const finish = resolver; resolver = null; playPromise = null;
    window.setTimeout(() => {
      screen.setAttribute("hidden", "");
      if (finish) finish();
    }, 420);
  }
  function advance() { if (index < cards.length - 1) { index++; paint(); } else close(); }
  function play() {
    if (started) return playPromise;
    index = 0; started = true;
    playPromise = new Promise(resolve => { resolver = resolve; });
    screen.removeAttribute("hidden");
    [$("titleScreen"), $("gameScreen"), $("endScreen")].forEach(other => other.classList.remove("visible"));
    screen.classList.add("visible"); document.body.classList.add("intro-playing");
    paint();
    return playPromise;
  }
  button.addEventListener("click", advance);
  skip.addEventListener("click", close);
  window.addEventListener("keydown", event => {
    if (!started) return;
    if (event.key === "Escape") { event.preventDefault(); close(); }
    else if (event.key === " " || event.key === "Enter" || event.key === "ArrowRight") { event.preventDefault(); advance(); }
  });
  window.TwistedIntro = { play, close };
})();
