let currentAudio = null;
let currentReciter = "ar.alafasy";
let currentPlayingCard = null;
let currentSurahData = [];

const reciters = {
  "ar.alafasy": "مشاري العفاسي",
  "ar.mahermuaiqly": "ماهر المعيقلي",
  "ar.husary": "محمود خليل الحصري",
  "ar.minshawi": "محمد صديق المنشاوي",
  "ar.ahmedajamy": "أحمد العجمي",
};

function normalizeArabic(text) {
  return text
    .replace(/[ًٌٍَُِّْـ]/g, "")
    .replace(/أ|إ|آ/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي");
}

function loadReciters() {
  const select = document.getElementById("reciterSelect");
  select.innerHTML = "";

  for (let key in reciters) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = reciters[key];
    select.appendChild(option);
  }
  select.value = currentReciter;
}

async function loadSurahList() {
  const res = await fetch("https://api.alquran.cloud/v1/surah");
  const data = await res.json();

  const select = document.getElementById("surahSelect");
  select.innerHTML = "";

  data.data.forEach((surah) => {
    const option = document.createElement("option");
    option.value = surah.number;
    option.textContent = `${surah.number} - ${surah.name}`;
    select.appendChild(option);
  });

  if (!select.value) select.value = "1";
  loadSurah();
}

async function loadSurah() {
  const surahNumber = document.getElementById("surahSelect").value || 1;
  const container = document.getElementById("quranContainer");
  const results = document.getElementById("searchResults");

  results.innerHTML = "";
  container.innerHTML = "جاري التحميل...";

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    const data = await res.json();

    container.innerHTML = "";
    currentSurahData = data.data.ayahs;

    currentSurahData.forEach((ayah) => {
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${currentReciter}/${ayah.number}.mp3`;

      const card = document.createElement("div");
      card.className = "ayah";
      card.id = `ayah-${ayah.numberInSurah}`;
      card.setAttribute("data-testid", `card-ayah-${ayah.numberInSurah}`);

      card.innerHTML = `
        <div class="ayah-text" data-testid="text-ayah-${ayah.numberInSurah}">
          ${ayah.text} ﴿${ayah.numberInSurah}﴾
        </div>

        <div class="actions">
          <button data-testid="button-listen-${ayah.numberInSurah}">استماع</button>
          <button data-testid="button-tafsir-${ayah.numberInSurah}">تفسير</button>
        </div>

        <div class="tafsir" data-testid="text-tafsir-${ayah.numberInSurah}"></div>
      `;

      const [listenBtn, tafsirBtn] = card.querySelectorAll("button");
      listenBtn.addEventListener("click", () => playAudio(audioUrl, card));
      tafsirBtn.addEventListener("click", () => loadTafsir(surahNumber, ayah.numberInSurah, card));

      container.appendChild(card);
    });
  } catch {
    container.innerHTML = "حدث خطأ أثناء تحميل السورة.";
  }
}

function playAudio(url, card) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  if (currentPlayingCard) {
    currentPlayingCard.style.boxShadow = "";
  }

  currentAudio = new Audio(url);

  currentAudio.onerror = () => {
    alert("فشل في تحميل الصوت. جرّب قارئ آخر أو تحقق من الاتصال.");
  };

  currentAudio.play().catch(() => {
    alert("فشل في تشغيل الصوت. اضغط مرة أخرى للمحاولة.");
  });

  currentPlayingCard = card;
  card.style.boxShadow = "0 0 0 1px rgba(212,175,55,.30), 0 0 60px rgba(212,175,55,.22)";

  currentAudio.onended = () => {
    card.style.boxShadow = "";
  };
}

async function loadTafsir(surah, ayah, card) {
  const tafsirDiv = card.querySelector(".tafsir");

  if (tafsirDiv.style.display === "block") {
    tafsirDiv.style.display = "none";
    return;
  }

  tafsirDiv.style.display = "block";
  tafsirDiv.textContent = "جاري تحميل التفسير...";

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar.muyassar`);
    const data = await res.json();
    tafsirDiv.textContent = data.data?.text || "لا يوجد تفسير متاح.";
  } catch {
    tafsirDiv.textContent = "حدث خطأ أثناء تحميل التفسير.";
  }
}

function searchAyah() {
  const query = document.getElementById("searchInput").value.trim();
  const results = document.getElementById("searchResults");

  if (!query) {
    results.innerHTML = "";
    return;
  }

  const normalizedQuery = normalizeArabic(query);
  const matches = currentSurahData.filter((ayah) =>
    normalizeArabic(ayah.text).includes(normalizedQuery)
  );

  results.innerHTML = "";

  if (matches.length === 0) {
    results.innerHTML = "لا توجد نتائج داخل هذه السورة.";
    return;
  }

  matches.forEach((match) => {
    const div = document.createElement("div");
    div.className = "search-result";
    div.setAttribute("data-testid", `row-search-${match.numberInSurah}`);

    div.innerHTML = `
      <strong>آية ${match.numberInSurah}</strong>
      <p>${match.text}</p>
    `;

    div.onclick = () => {
      const target = document.getElementById(`ayah-${match.numberInSurah}`);
      target.scrollIntoView({ behavior: "smooth", block: "center" });

      target.style.boxShadow = "0 0 0 1px rgba(212,175,55,.30), 0 0 60px rgba(212,175,55,.22)";
      setTimeout(() => (target.style.boxShadow = ""), 1800);
    };

    results.appendChild(div);
  });
}

function changeReciter() {
  currentReciter = document.getElementById("reciterSelect").value;
  loadSurah();
}

document.getElementById("surahSelect").addEventListener("change", loadSurah);
document.getElementById("reciterSelect").addEventListener("change", changeReciter);
document.getElementById("searchInput").addEventListener("input", searchAyah);

loadReciters();
loadSurahList();
let fullSurahIndex = 0;
let isPlayingFullSurah = false;

document.getElementById("playBtn").addEventListener("click", () => {
  const input = document.getElementById("playInput").value.trim();
  const nowPlaying = document.getElementById("nowPlaying");
  
  if (!currentSurahData.length) return alert("الرجاء تحميل السورة أولاً.");

  if (input === "") {
    // تشغيل السورة كاملة
    isPlayingFullSurah = true;
    fullSurahIndex = 0;
    playNextAyah();
  } else {
    const ayahNum = parseInt(input);
    if (isNaN(ayahNum) || ayahNum < 1 || ayahNum > currentSurahData.length) {
      alert("رقم الآية غير صالح.");
      return;
    }
    const ayah = currentSurahData[ayahNum - 1];
    const card = document.getElementById(`ayah-${ayah.numberInSurah}`);
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/${currentReciter}/${ayah.number}.mp3`;
    playAudio(audioUrl, card);
    nowPlaying.textContent = `الآية ${ayah.numberInSurah}`;
  }
});

document.getElementById("stopBtn").addEventListener("click", () => {
  if (currentAudio) currentAudio.pause();
  if (currentPlayingCard) currentPlayingCard.style.boxShadow = "";
  isPlayingFullSurah = false;
  document.getElementById("nowPlaying").textContent = "توقف";
});

function playNextAyah() {
  if (!isPlayingFullSurah || fullSurahIndex >= currentSurahData.length) {
    isPlayingFullSurah = false;
    document.getElementById("nowPlaying").textContent = "انتهت السورة";
    return;
  }

  const ayah = currentSurahData[fullSurahIndex];
  const card = document.getElementById(`ayah-${ayah.numberInSurah}`);
  const audioUrl = `https://cdn.islamic.network/quran/audio/128/${currentReciter}/${ayah.number}.mp3`;

  playAudio(audioUrl, card);
  document.getElementById("nowPlaying").textContent = `الآية ${ayah.numberInSurah}`;
  
  currentAudio.onended = () => {
    card.style.boxShadow = "";
    fullSurahIndex++;
    playNextAyah();
  };
}
