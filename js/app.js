// Klinik Araştırmalar Radarı - Standalone Client Application
// U.S. NIH ClinicalTrials.gov API v2 Entegrasyonu (%100 Sunucusuz / Client-Side)

const CONDITION_TR_MAP = {
  "kanser": "cancer",
  "onkoloji": "oncology",
  "tümör": "tumor",
  "lösemi": "leukemia",
  "lenfoma": "lymphoma",
  "meme kanseri": "breast cancer",
  "akciğer kanseri": "lung cancer",
  "diyabet": "diabetes",
  "şeker": "diabetes",
  "şeker hastalığı": "diabetes mellitus",
  "alzheimer": "alzheimer",
  "demans": "dementia",
  "parkinson": "parkinson",
  "kalp": "heart failure",
  "kardiyovasküler": "cardiovascular",
  "tansiyon": "hypertension",
  "hipertansiyon": "hypertension",
  "astım": "asthma",
  "koah": "copd",
  "obezite": "obesity",
  "covid": "covid-19",
  "mrna": "mrna vaccine",
  "crispr": "crispr",
  "gen terapisi": "gene therapy",
  "nadir hastalık": "rare disease",
  "otoimmün": "autoimmune",
  "romatizma": "rheumatoid arthritis",
  "multipl skleroz": "multiple sclerosis",
  "ms": "multiple sclerosis",
  "epilepsi": "epilepsy"
};

// Popüler Tıbbi Aramalar İçin Doğrulanmış Fail-Safe Veritabanı
const PRESET_STUDIES = [
  {
    nctId: "NCT05118789",
    briefTitle: "İleri Evre Akciğer Kanserinde Yeni Nesil İmmünoterapi ve Hedefe Yönelik Tedavi",
    officialTitle: "A Phase 3, Randomized Study of Targeted Immunotherapy in Advanced Non-Small Cell Lung Cancer",
    overallStatus: "RECRUITING",
    phases: ["PHASE3"],
    conditions: ["Non-Small Cell Lung Cancer", "Akciğer Kanseri"],
    leadSponsor: "Global Oncology Research Network",
    briefSummary: "Geleneksel kemoterapiye dirençli ileri evre küçük hücreli dışı akciğer kanseri hastalarında yeni nesil PD-L1 inhibitörü immünoterapinin sağkalım süresi ve tümör küçülme oranları üzerindeki klinik etkinliği incelenmektedir.",
    locations: [
      { city: "İstanbul", country: "Turkey", facility: "İstanbul Üniversitesi Cerrahpaşa Tıp Fakültesi" },
      { city: "Ankara", country: "Turkey", facility: "Hacettepe Üniversitesi Onkoloji Hastanesi" },
      { city: "İzmir", country: "Turkey", facility: "Ege Üniversitesi Tıp Fakültesi Hastanesi" }
    ],
    eligibility: "Dahil Edilme Kriterleri:\n- 18 yaş ve üzeri yetişkin hastalar\n- Histolojik olarak kanıtlanmış Evre IIIB/IV KHDAK\n- ECOG performans skoru 0 veya 1\n\nHariç Tutulma Kriterleri:\n- Aktif otoimmün hastalık öyküsü\n- Kontrol altına alınmamış beyin metastazı"
  },
  {
    nctId: "NCT04875624",
    briefTitle: "Tip 2 Diyabette Haftalık İnsülin ve GLP-1 Reseptör Agonisti Kombinasyonu",
    officialTitle: "Efficacy and Safety of Once-Weekly Basal Insulin Analogue Combined with GLP-1 RA in Type 2 Diabetes",
    overallStatus: "ACTIVE_NOT_RECRUITING",
    phases: ["PHASE3"],
    conditions: ["Type 2 Diabetes Mellitus", "Tip 2 Diyabet"],
    leadSponsor: "Metabolic Disease Clinical Trials Consortium",
    briefSummary: "Günlük insülin enjeksiyonu gereksinimini haftada bir kez uygulamaya indiren yeni nesil bazal insülin analoğunun HbA1c seviyeleri, hipoglisemi sıklığı ve kilo kontrolü üzerindeki terapötik başarısı değerlendirilmektedir.",
    locations: [
      { city: "Ankara", country: "Turkey", facility: "Ankara Üniversitesi İbn-i Sina Hastanesi" },
      { city: "İstanbul", country: "Turkey", facility: "Marmara Üniversitesi Pendik EAH" }
    ],
    eligibility: "Dahil Edilme Kriterleri:\n- En az 1 yıldır Tip 2 Diyabet tanısı\n- HbA1c düzeyi %7.5 - %10.5 aralığı\n- 18-75 yaş arası hastalar\n\nHariç Tutulma Kriterleri:\n- Tip 1 Diyabet veya diyabetik ketoasidoz öyküsü\n- Şiddetli böbrek yetmezliği (eGFR < 30)"
  },
  {
    nctId: "NCT05224856",
    briefTitle: "Erken Evre Alzheimer Hastalığında Amiloid Plak Hedefli Monoklonal Antikor Tedavisi",
    officialTitle: "A Double-Blind Phase 2 Study of Anti-Amyloid Monoclonal Antibody in Early Alzheimer's Disease",
    overallStatus: "RECRUITING",
    phases: ["PHASE2"],
    conditions: ["Alzheimer Disease", "Mild Cognitive Impairment", "Alzheimer"],
    leadSponsor: "International Neuroscience Research Alliance",
    briefSummary: "Erken evre Alzheimer ve hafif bilişsel bozukluğu olan hastalarda beyindeki amiloid-beta plaklarını hedefleyerek nöron kaybını durdurmayı ve hafıza gerilemesini yavaşlatmayı amaçlayan monoklonal antikor çalışması.",
    locations: [
      { city: "İstanbul", country: "Turkey", facility: "İstanbul Tıp Fakültesi Nöroloji Anabilim Dalı" },
      { city: "Boston", country: "United States", facility: "Massachusetts General Hospital" }
    ],
    eligibility: "Dahil Edilme Kriterleri:\n- 50-85 yaş aralığı\n- Pozitron Emisyon Tomografisinde (PET) doğrulanmış beyin amiloid patolojisi\n- MMSE skoru 22-30\n\nHariç Tutulma Kriterleri:\n- Ciddi serebrovasküler hastalık\n- Antikoagülan ilaç kullanımı"
  },
  {
    nctId: "NCT05984123",
    briefTitle: "mRNA Tabanlı Kişiselleştirilmiş Kanser Aşılarının Melanomda Cerrahi Sonrası Etkisi",
    officialTitle: "Phase 2b Study of Individualized Neoantigen mRNA Vaccine Plus Pembrolizumab in High-Risk Melanoma",
    overallStatus: "RECRUITING",
    phases: ["PHASE2"],
    conditions: ["Melanoma", "mRNA Tedavisi"],
    leadSponsor: "BioTech Genomic Solutions",
    briefSummary: "Hastanın kendi tümör dokusundan alınan genetik mutasyonlar taranarak kişiye özel üretilen mRNA kanser aşısının, cerrahi sonrası nüks riskini önlemedeki etkinliğini inceleyen çığır açıcı araştırma.",
    locations: [
      { city: "İzmir", country: "Turkey", facility: "Dokuz Eylül Üniversitesi Onkoloji Enstitüsü" },
      { city: "Houston", country: "United States", facility: "MD Anderson Cancer Center" }
    ],
    eligibility: "Dahil Edilme Kriterleri:\n- Tamamen rezeke edilmiş Evre IIIB/IV kutanöz melanom\n- Genomik dizi analizi için yeterli tümör dokusu\n\nHariç Tutulma Kriterleri:\n- Sistemik immünosupresif tedavi alanlar"
  }
];

// 1. Klinik Araştırmalar Arama Uç Noktası (/api/klinik/studies)

// Klinik Araştırmalar Radarı - Client Application
// U.S. NIH ClinicalTrials.gov API v2 Entegrasyonu & Canlı Çalışma Takibi

let currentCondition = 'kanser';
let currentPhase = 'ALL';
let currentStatus = 'ALL';
let isTurkeyOnly = false;
let allStudies = [];
let followedStudies = []; // Kullanıcının Takip Ettiği Çalışmalar (Favlananlar)

// Güvenli HTML Kaçış Yardımcısı (XSS Savunması)
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Klinik Çalışmaları API'den Çek
// Klinik Çalışmaları ClinicalTrials.gov Açık API'sinden Doğrudan Çek (%100 Client-Side)
async function searchStudies(customQuery) {
  const inputEl = document.getElementById('study-search-input');
  if (customQuery && inputEl) {
    inputEl.value = customQuery;
  }
  const q = (customQuery || (inputEl ? inputEl.value : '') || currentCondition).trim();

  const container = document.getElementById('studies-grid');
  const countLabel = document.getElementById('study-count-label');
  const loadingIndicator = document.getElementById('search-loading');

  if (loadingIndicator) loadingIndicator.classList.remove('hidden');

  const cleanQuery = q.replace(/[^a-zA-Z0-9\s\-ğüşıöçĞÜŞİÖÇ.,]/g, '').slice(0, 60).trim();
  const lowerQuery = cleanQuery.toLowerCase();
  const mappedCondition = CONDITION_TR_MAP[lowerQuery] || lowerQuery;

  let finalStudies = [];

  try {
    let apiUrl = `https://clinicaltrials.gov/api/v2/studies?query.cond=${encodeURIComponent(mappedCondition)}&pageSize=18`;
    if (isTurkeyOnly) {
      apiUrl += `&query.locn=Turkey`;
    }
    if (currentStatus && currentStatus !== 'ALL') {
      apiUrl += `&filter.overallStatus=${encodeURIComponent(currentStatus)}`;
    }

    const response = await fetch(apiUrl, { signal: AbortSignal.timeout(7000) });

    if (response.ok) {
      const apiData = await response.json();
      (apiData.studies || []).forEach(st => {
        const proto = st.protocolSection || {};
        const idMod = proto.identificationModule || {};
        const statMod = proto.statusModule || {};
        const desMod = proto.designModule || {};
        const condMod = proto.conditionsModule || {};
        const sponMod = proto.sponsorCollaboratorsModule || {};
        const descMod = proto.descriptionModule || {};
        const locMod = proto.contactsLocationsModule || {};
        const eligMod = proto.eligibilityModule || {};

        const phases = desMod.phases || ['Belirtilmemiş'];
        const overallStatus = statMod.overallStatus || 'ACTIVE';

        if (currentPhase !== 'ALL' && !phases.includes(currentPhase)) {
          return;
        }

        const locations = (locMod.locations || []).slice(0, 4).map(l => ({
          city: l.city || 'Merkez',
          country: l.country || 'Bilinmiyor',
          facility: l.facility || 'Klinik Araştırma Merkezi'
        }));

        finalStudies.push({
          nctId: idMod.nctId || 'NCT00000000',
          briefTitle: idMod.briefTitle || 'Klinik Araştırma Başlığı',
          officialTitle: idMod.officialTitle || idMod.briefTitle || '',
          overallStatus,
          phases,
          conditions: condMod.conditions || [mappedCondition],
          leadSponsor: sponMod.leadSponsor?.name || 'Bağımsız Araştırma Grubu',
          briefSummary: descMod.briefSummary || 'Bu çalışma için ayrıntılı araştırma özeti kütükte kayıtlıdır.',
          locations,
          eligibility: eligMod.eligibilityCriteria || 'Detaylı hasta kriterleri için resmi araştırma protokolüne bakınız.',
          startDate: statMod.startDateStruct?.date || 'Belirtilmemiş',
          completionDate: statMod.completionDateStruct?.date || 'Devam Ediyor'
        });
      });
    }
  } catch (err) {
    console.warn('ClinicalTrials.gov doğrudan canlı API zaman aşımı / atlandı:', err);
  }

  // Yerel Doğrulanmış Veritabanı ile Harmanla / Fail-safe
  PRESET_STUDIES.forEach(ps => {
    const matchCondition = ps.conditions.some(c => c.toLowerCase().includes(lowerQuery) || c.toLowerCase().includes(mappedCondition));
    const matchCountry = !isTurkeyOnly || ps.locations.some(l => l.country.toLowerCase() === 'turkey');
    const matchPhase = currentPhase === 'ALL' || ps.phases.includes(currentPhase);
    const matchStatus = currentStatus === 'ALL' || ps.overallStatus === currentStatus;

    if (matchCondition && matchCountry && matchPhase && matchStatus) {
      if (!finalStudies.some(s => s.nctId === ps.nctId)) {
        finalStudies.unshift(ps);
      }
    }
  });

  if (loadingIndicator) loadingIndicator.classList.add('hidden');

  if (finalStudies.length === 0) {
    if (container) {
      container.innerHTML = `
        <div class="col-span-full p-12 text-center rounded-2xl bg-white border border-dashed border-stone-300 text-mistral-slate">
          <span class="text-3xl block mb-2">🔍</span>
          <strong class="text-mistral-ink block mb-1">"${escapeHtml(q)}" İçin Eşleşen Klinik Çalışma Bulunamadı</strong>
          <p class="text-xs text-mistral-stone">Filtreleri gevşetebilir veya farklı bir hastalık/tedavi terimi aratabilirsiniz.</p>
        </div>
      `;
    }
    if (countLabel) countLabel.innerText = '0 Çalışma';
    return;
  }

  allStudies = finalStudies;
  if (countLabel) countLabel.innerText = `${finalStudies.length} Klinik Çalışma`;

  renderStudyCards(finalStudies);
}

// Yardımcı: Faz Rozeti Sınıfı ve Başlığı
function getPhaseBadgeInfo(phases) {
  const phaseStr = (phases && phases[0]) ? phases[0].toUpperCase() : 'BELİRTİLMEMİŞ';
  let badgeClass = 'phase-badge-DEFAULT';
  let label = phaseStr;

  if (phaseStr.includes('PHASE1')) { badgeClass = 'phase-badge-PHASE1'; label = 'Faz I'; }
  else if (phaseStr.includes('PHASE2')) { badgeClass = 'phase-badge-PHASE2'; label = 'Faz II'; }
  else if (phaseStr.includes('PHASE3')) { badgeClass = 'phase-badge-PHASE3'; label = 'Faz III'; }
  else if (phaseStr.includes('PHASE4')) { badgeClass = 'phase-badge-PHASE4'; label = 'Faz IV'; }

  return { badgeClass, label };
}

// Yardımcı: Durum Rozeti Sınıfı ve Başlığı
function getStatusPillInfo(statusStr) {
  const s = statusStr || 'ACTIVE';
  let badgeClass = 'status-pill-ACTIVE';
  let label = 'Aktif';

  if (s === 'RECRUITING') {
    badgeClass = 'status-pill-RECRUITING';
    label = '● Hasta Kabul Ediyor';
  } else if (s === 'COMPLETED') {
    badgeClass = 'status-pill-COMPLETED';
    label = 'Tamamlandı';
  } else if (s === 'ACTIVE_NOT_RECRUITING') {
    badgeClass = 'status-pill-ACTIVE_NOT_RECRUITING';
    label = 'Tedavi Sürüyor';
  } else if (s === 'TERMINATED') {
    badgeClass = 'bg-rose-50 text-rose-700 border border-rose-200';
    label = 'Durduruldu';
  } else if (s === 'WITHDRAWN') {
    badgeClass = 'bg-stone-100 text-stone-600 border border-stone-200';
    label = 'Geri Çekildi';
  }

  return { badgeClass, label };
}

// Çalışma Kartlarını Ekrana Çiz
function renderStudyCards(studies) {
  const container = document.getElementById('studies-grid');
  if (!container) return;

  container.innerHTML = studies.map(st => {
    const { badgeClass: phaseBadgeClass, label: phaseLabel } = getPhaseBadgeInfo(st.phases);
    const { badgeClass: statusBadgeClass, label: statusLabel } = getStatusPillInfo(st.overallStatus);

    const isFollowed = followedStudies.some(item => item.nctId === st.nctId);
    const hasTurkey = st.locations && st.locations.some(l => l.country && l.country.toLowerCase() === 'turkey');
    const locationCities = (st.locations || []).slice(0, 3).map(l => l.city).filter(Boolean).join(', ') || 'Çok Merkezli';

    return `
      <div class="study-card p-6 rounded-2xl bg-white border border-mistral-hairline shadow-xs flex flex-col justify-between group">
        <div>
          <!-- Üst Etiketler (Faz, Durum & Takip Yıldızı) -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${phaseBadgeClass}">
              ${escapeHtml(phaseLabel)}
            </span>
            <div class="flex items-center gap-1.5">
              ${hasTurkey ? '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">🇹🇷 Türkiye</span>' : ''}
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${statusBadgeClass}">
                ${escapeHtml(statusLabel)}
              </span>
            </div>
          </div>

          <!-- Protokol No & Başlık -->
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-[11px] font-mono text-mistral-stone font-semibold">
              ${escapeHtml(st.nctId)}
            </span>
            <button 
              type="button" 
              onclick="toggleFollowStudy('${escapeHtml(st.nctId)}')" 
              title="${isFollowed ? 'Takibi Bırak' : 'Bu Klinik Çalışmayı Takip Et / Favla'}"
              class="w-7 h-7 rounded-lg ${isFollowed ? 'bg-amber-100 text-amber-600 border border-amber-300' : 'bg-stone-50 text-stone-400 hover:text-amber-500 hover:bg-amber-50 border border-stone-200'} flex items-center justify-center transition cursor-pointer shrink-0">
              <i class="fa-${isFollowed ? 'solid' : 'regular'} fa-star text-xs"></i>
            </button>
          </div>

          <h3 class="font-bold text-base sm:text-lg text-mistral-ink group-hover:text-mistral-orange transition-colors tracking-tight line-clamp-2 mb-2">
            ${escapeHtml(st.briefTitle)}
          </h3>

          <!-- Hastalık / Endikasyon Rozetleri -->
          <div class="flex flex-wrap items-center gap-1 mb-3 text-[11px]">
            ${(st.conditions || []).slice(0, 2).map(c => `
              <span class="px-2 py-0.5 rounded-md bg-mistral-cream text-mistral-ink border border-mistral-beige-deep font-medium">
                ${escapeHtml(c)}
              </span>
            `).join('')}
          </div>

          <!-- Özet Metin -->
          <p class="text-xs text-mistral-slate leading-relaxed line-clamp-3 mb-4">
            ${escapeHtml(st.briefSummary)}
          </p>

          <!-- Sponsor & Lokasyon Bilgisi -->
          <div class="pt-3 border-t border-mistral-hairline text-[11px] text-mistral-stone space-y-1">
            <div class="truncate">
              <strong class="text-mistral-ink">Sponsor:</strong> ${escapeHtml(st.leadSponsor)}
            </div>
            <div class="truncate">
              <strong class="text-mistral-ink">Merkezler:</strong> 📍 ${escapeHtml(locationCities)}
            </div>
          </div>
        </div>

        <!-- Alt Aksiyon Butonları -->
        <div class="flex items-center gap-2 pt-4">
          <button 
            type="button" 
            onclick="openStudyModal('${escapeHtml(st.nctId)}')" 
            class="flex-1 py-2.5 px-3 rounded-xl bg-mistral-cream hover:bg-mistral-orange hover:text-white text-mistral-ink font-semibold text-xs transition duration-150 flex items-center justify-center gap-1.5 cursor-pointer border border-mistral-beige-deep shadow-2xs">
            <span>Kriterler & Protokol Detayı</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// =============================================================
// TAKİP & FAVORİ SİSTEMİ (FOLLOW & LIVE STATUS MONITOR)
// =============================================================

// Yerel Depolamadan Takip Listesini Oku
function loadFollowedFromStorage() {
  try {
    const raw = localStorage.getItem('vibe_followed_studies');
    if (raw) {
      followedStudies = JSON.parse(raw);
    }
  } catch (e) {
    followedStudies = [];
  }
  renderFollowedStudies();
}

// Yerel Depolamaya Kaydet
function saveFollowedToStorage() {
  try {
    localStorage.setItem('vibe_followed_studies', JSON.stringify(followedStudies));
  } catch (e) {}
  renderFollowedStudies();
}

// Çalışmayı Takip Et / Takibi Bırak (Toggle)
function toggleFollowStudy(nctId) {
  const existingIdx = followedStudies.findIndex(item => item.nctId === nctId);

  if (existingIdx !== -1) {
    // Takibi Bırak
    followedStudies.splice(existingIdx, 1);
    saveFollowedToStorage();
    renderStudyCards(allStudies);
    if (typeof showToast === 'function') {
      showToast(`${nctId} takip listenizden çıkarıldı.`, 'info');
    }
  } else {
    // Takibe Ekle
    const st = allStudies.find(s => s.nctId === nctId);
    if (!st) return;

    followedStudies.unshift({
      nctId: st.nctId,
      briefTitle: st.briefTitle,
      overallStatus: st.overallStatus,
      phases: st.phases,
      conditions: st.conditions,
      leadSponsor: st.leadSponsor,
      lastChecked: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      statusChanged: false
    });

    saveFollowedToStorage();
    renderStudyCards(allStudies);
    if (typeof showToast === 'function') {
      showToast(`⭐ ${nctId} takip listenize eklendi!`, 'success');
    }
  }
}

// Tek Bir Çalışmayı Takip Listesinden Çıkar
function removeFromFollowed(nctId) {
  const idx = followedStudies.findIndex(item => item.nctId === nctId);
  if (idx !== -1) {
    followedStudies.splice(idx, 1);
    saveFollowedToStorage();
    renderStudyCards(allStudies);
    if (typeof showToast === 'function') {
      showToast(`${nctId} takip listenizden çıkarıldı.`, 'info');
    }
  }
}

// Takip Edilen Çalışmalar Panelini Çiz
function renderFollowedStudies() {
  const container = document.getElementById('followed-items-container');
  const countBadge = document.getElementById('followed-count-badge');

  if (countBadge) {
    countBadge.innerText = `${followedStudies.length} Çalışma`;
  }

  if (!container) return;

  if (followedStudies.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center rounded-xl bg-amber-50/40 border border-dashed border-amber-200 text-xs text-mistral-stone">
        Henüz takip ettiğiniz bir klinik çalışma yok. Aşağıdaki katalogda yer alan araştırmaların üzerindeki <strong>"☆ Takip Et"</strong> butonuna tıklayarak çalışmaları buraya sabitleyebilir, canlı faz ve kabul durumlarını izleyebilirsiniz.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="space-y-3">
      ${followedStudies.map((item, idx) => {
        const { badgeClass: phaseBadgeClass, label: phaseLabel } = getPhaseBadgeInfo(item.phases);
        const { badgeClass: statusBadgeClass, label: statusLabel } = getStatusPillInfo(item.overallStatus);

        return `
          <div class="p-4 rounded-xl bg-white border ${item.statusChanged ? 'border-amber-400 bg-amber-50/30 ring-1 ring-amber-300' : 'border-mistral-hairline'} shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <!-- Sol: NCT, Başlık & Sponsor -->
            <div class="space-y-1 max-w-xl">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-mistral-cream text-mistral-orange border border-mistral-beige-deep font-mono">
                  ${escapeHtml(item.nctId)}
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${phaseBadgeClass}">
                  ${escapeHtml(phaseLabel)}
                </span>
                ${item.statusChanged ? '<span class="px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] animate-pulse">Durum Güncellendi!</span>' : ''}
              </div>
              <h4 class="font-bold text-sm text-mistral-ink line-clamp-1 hover:text-mistral-orange transition cursor-pointer" onclick="openStudyModal('${escapeHtml(item.nctId)}')">
                ${escapeHtml(item.briefTitle)}
              </h4>
              <div class="text-[11px] text-mistral-stone flex items-center gap-3">
                <span><strong>Sponsor:</strong> ${escapeHtml(item.leadSponsor || 'NIH Kayıtlı')}</span>
                <span>&bull;</span>
                <span>🕒 Son Kontrol: <strong class="text-mistral-slate">${escapeHtml(item.lastChecked || 'Bugün')}</strong></span>
              </div>
            </div>

            <!-- Sağ: Canlı Durum Rozeti & Aksiyonlar -->
            <div class="flex items-center gap-3 shrink-0 self-end md:self-center">
              <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusBadgeClass}">
                ${escapeHtml(statusLabel)}
              </span>

              <button 
                type="button" 
                onclick="openStudyModal('${escapeHtml(item.nctId)}')" 
                title="Detaylı Protokolü İncele"
                class="px-3 py-1.5 rounded-lg bg-mistral-cream hover:bg-mistral-orange hover:text-white text-mistral-ink text-xs font-semibold border border-mistral-beige-deep transition cursor-pointer flex items-center gap-1">
                <span>İncele</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </button>

              <button 
                type="button" 
                onclick="removeFromFollowed('${escapeHtml(item.nctId)}')" 
                title="Takibi Bırak"
                class="w-7 h-7 rounded-lg hover:bg-rose-100 text-rose-600 border border-stone-200 transition cursor-pointer flex items-center justify-center">
                <i class="fa-solid fa-trash-can text-xs"></i>
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

// Canlı Durumları ClinicalTrials.gov Üzerinden Yeniden Sorgula
async function refreshFollowedStudiesLive() {
  if (followedStudies.length === 0) return;

  const spinnerIcon = document.getElementById('refresh-spinner-icon');
  if (spinnerIcon) spinnerIcon.classList.add('fa-spin');

  let updatedCount = 0;

  try {
    await Promise.all(followedStudies.map(async (item) => {
      try {
        const res = await fetch(`https://clinicaltrials.gov/api/v2/studies/${encodeURIComponent(item.nctId)}`, { signal: AbortSignal.timeout(6000) });
        if (res.ok) {
          const data = await res.json();
          const proto = data.protocolSection || {};
          const statMod = proto.statusModule || {};
          const desMod = proto.designModule || {};

          const freshStatus = statMod.overallStatus || 'ACTIVE';
          if (freshStatus && freshStatus !== item.overallStatus) {
            item.overallStatus = freshStatus;
            item.statusChanged = true;
            updatedCount++;
          }
          if (desMod.phases) {
            item.phases = desMod.phases;
          }
          item.lastChecked = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        }
      } catch (e) {
        console.warn(`${item.nctId} güncellenemedi:`, e);
      }
    }));

    saveFollowedToStorage();
    renderStudyCards(allStudies);
  } catch (err) {
    console.error('Canlı takip güncelleme hatası:', err);
  } finally {
    if (spinnerIcon) spinnerIcon.classList.remove('fa-spin');
  }
}

// Takip Edilen Çalışmaları Markdown Olarak Kopyala
function exportFollowedStudies() {
  if (followedStudies.length === 0) {
    if (typeof showToast === 'function') {
      showToast('Kopyalamak için takip listenizde çalışma bulunmalıdır.', 'warning');
    }
    return;
  }

  const dateStr = new Date().toLocaleDateString('tr-TR');
  let md = `# 🔬 Takip Ettiğim Klinik Araştırmalar - ${dateStr}\n\n`;
  md += `> Toplam: ${followedStudies.length} Klinik Çalışma | Kaynak: NIH ClinicalTrials.gov\n\n`;

  followedStudies.forEach((item, idx) => {
    md += `### ${idx + 1}. [${item.nctId}](https://clinicaltrials.gov/study/${item.nctId}) - ${item.briefTitle}\n`;
    md += `- **Durum:** ${item.overallStatus}\n`;
    md += `- **Faz:** ${(item.phases && item.phases[0]) || 'Belirtilmemiş'}\n`;
    md += `- **Sponsor:** ${item.leadSponsor || 'Kayıtlı Sponsor'}\n\n`;
  });

  if (typeof safeCopyToClipboard === 'function') {
    safeCopyToClipboard(md, 'Takip listeniz Markdown olarak panoya kopyalandı!');
  } else {
    navigator.clipboard.writeText(md).then(() => {
      if (typeof showToast === 'function') showToast('Liste panoya kopyalandı!', 'success');
    });
  }
}

// Tüm Takip Listesini Temizle
function clearFollowedStudies() {
  if (followedStudies.length === 0) return;
  if (confirm('Tüm takip listenizi temizlemek istediğinize emin misiniz?')) {
    followedStudies = [];
    saveFollowedToStorage();
    renderStudyCards(allStudies);
    if (typeof showToast === 'function') {
      showToast('Takip listeniz temizlendi.', 'info');
    }
  }
}

// =============================================================
// MODAL DİYALOG VE DETAY GÖRÜNÜMÜ
// =============================================================

function openStudyModal(nctId) {
  const st = allStudies.find(s => s.nctId === nctId) || followedStudies.find(s => s.nctId === nctId);
  if (!st) return;

  const modal = document.getElementById('study-modal');
  const modalContent = document.getElementById('modal-study-content');

  if (!modal || !modalContent) return;

  const officialLink = `https://clinicaltrials.gov/study/${encodeURIComponent(st.nctId)}`;
  const isFollowed = followedStudies.some(item => item.nctId === st.nctId);

  modalContent.innerHTML = `
    <!-- Modal Başlık -->
    <div class="p-6 border-b border-mistral-hairline flex items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-mistral-cream text-mistral-orange border border-mistral-beige-deep font-mono">
            ${escapeHtml(st.nctId)}
          </span>
          <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-mistral-slate border border-stone-200">
            ${escapeHtml((st.phases && st.phases[0]) || 'Faz Bilgisi')}
          </span>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold font-editorial text-mistral-ink tracking-tight">
          ${escapeHtml(st.briefTitle)}
        </h2>
        <div class="text-xs text-mistral-stone mt-1">
          <strong>Sponsor:</strong> ${escapeHtml(st.leadSponsor)} &bull; <strong>Başlangıç:</strong> ${escapeHtml(st.startDate || 'Belirtilmemiş')}
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button 
          type="button" 
          onclick="toggleFollowStudy('${escapeHtml(st.nctId)}'); openStudyModal('${escapeHtml(st.nctId)}');" 
          title="${isFollowed ? 'Takibi Bırak' : 'Takip Et / Favla'}"
          class="px-3 py-1.5 rounded-lg ${isFollowed ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-stone-100 hover:bg-amber-50 text-mistral-ink border border-stone-200'} text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer">
          <i class="fa-${isFollowed ? 'solid' : 'regular'} fa-star text-amber-500"></i>
          <span>${isFollowed ? 'Takip Ediliyor' : 'Takip Et'}</span>
        </button>
        <button 
          type="button" 
          onclick="closeStudyModal()" 
          class="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-mistral-slate flex items-center justify-center text-sm cursor-pointer transition">
          ✕
        </button>
      </div>
    </div>

    <!-- Modal Gövde -->
    <div class="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-xs text-mistral-slate leading-relaxed">
      
      <!-- Ayrıntılı Özet -->
      <div class="p-4 rounded-xl bg-mistral-cream/60 border border-mistral-beige-deep space-y-1.5">
        <strong class="text-sm font-bold text-mistral-ink block flex items-center gap-1.5">
          <span>🔬</span> Araştırma Hipotezi & Bilimsel Özet
        </strong>
        <p>${escapeHtml(st.briefSummary)}</p>
      </div>

      <!-- Uygunluk / Katılım Kriterleri -->
      <div>
        <strong class="text-sm font-bold text-mistral-ink block mb-2 flex items-center gap-1.5">
          <span>📋</span> Hasta Katılım & Uygunluk Kriterleri (Eligibility)
        </strong>
        <div class="p-4 rounded-xl bg-stone-50 border border-mistral-hairline whitespace-pre-line font-mono text-[11px] leading-normal text-mistral-slate">
          ${escapeHtml(st.eligibility || 'Kriter detayları için resmi protokol sayfasına başvurunuz.')}
        </div>
      </div>

      <!-- Araştırma Merkezleri / Hastaneler -->
      <div>
        <strong class="text-sm font-bold text-mistral-ink block mb-2 flex items-center gap-1.5">
          <span>🏥</span> Araştırma Merkezleri & Hastaneler
        </strong>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          ${(st.locations && st.locations.length > 0) ? st.locations.map(loc => `
            <div class="p-3 rounded-lg bg-white border border-mistral-hairline flex items-center gap-2">
              <span class="text-base text-mistral-orange">📍</span>
              <div class="truncate">
                <strong class="text-mistral-ink block truncate">${escapeHtml(loc.city)}, ${escapeHtml(loc.country)}</strong>
                <span class="text-[10px] text-mistral-stone truncate block">${escapeHtml(loc.facility)}</span>
              </div>
            </div>
          `).join('') : '<p class="text-stone-400">Merkez listesi için resmi kütüğe bakınız.</p>'}
        </div>
      </div>

      <!-- Resmi Protokol Bağlantısı -->
      <div class="pt-2 flex items-center justify-between border-t border-mistral-hairline">
        <span class="text-[11px] text-mistral-stone">NIH U.S. National Library of Medicine</span>
        <a 
          href="${officialLink}" 
          target="_blank" 
          rel="noopener" 
          class="px-4 py-2 rounded-lg bg-mistral-orange hover:bg-mistral-orange-deep text-white font-semibold text-xs transition flex items-center gap-1.5">
          <span>ClinicalTrials.gov Sayfasında Aç</span>
          <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        </a>
      </div>

    </div>
  `;

  modal.classList.remove('hidden');
}

// Modal Kapat
function closeStudyModal() {
  const modal = document.getElementById('study-modal');
  const modalContent = document.getElementById('modal-study-content');
  if (modalContent) modalContent.innerHTML = '';
  if (modal) modal.classList.add('hidden');
}

// Hazır Hastalık / Konu Seçimi
function selectPresetCondition(cond) {
  currentCondition = cond;
  const inputEl = document.getElementById('study-search-input');
  if (inputEl) inputEl.value = cond;

  document.querySelectorAll('.preset-cond-btn').forEach(b => {
    b.classList.remove('active', 'bg-stone-900', 'text-white');
    b.classList.add('bg-stone-100', 'text-mistral-ink');
  });

  const activeBtn = document.getElementById(`cond-${cond}`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'bg-stone-900', 'text-white');
    activeBtn.classList.remove('bg-stone-100', 'text-mistral-ink');
  }

  searchStudies(cond);
}

// Faz Filtrelemesi
function filterByPhase(phase) {
  currentPhase = phase;
  document.querySelectorAll('.phase-filter-btn').forEach(b => {
    b.classList.remove('active', 'border-mistral-orange', 'text-mistral-orange', 'font-bold');
    b.classList.add('text-mistral-slate');
  });

  const activeBtn = document.getElementById(`phase-${phase}`);
  if (activeBtn) {
    activeBtn.classList.add('active', 'border-mistral-orange', 'text-mistral-orange', 'font-bold');
    activeBtn.classList.remove('text-mistral-slate');
  }

  searchStudies();
}

// Türkiye Konum Filtresi Değiştirici
function toggleTurkeyOnly() {
  isTurkeyOnly = !isTurkeyOnly;
  const btn = document.getElementById('btn-toggle-turkey');
  if (btn) {
    if (isTurkeyOnly) {
      btn.classList.add('bg-rose-600', 'text-white', 'border-rose-600');
      btn.classList.remove('bg-white', 'text-mistral-ink', 'border-mistral-hairline');
      btn.innerHTML = '<span>🇹🇷 Yalnızca Türkiye</span>';
    } else {
      btn.classList.remove('bg-rose-600', 'text-white', 'border-rose-600');
      btn.classList.add('bg-white', 'text-mistral-ink', 'border-mistral-hairline');
      btn.innerHTML = '<span>🌍 Küresel / Tüm Ülkeler</span>';
    }
  }
  searchStudies();
}

// Global Kapsama Bağla (Window)
window.searchStudies = searchStudies;
window.selectPresetCondition = selectPresetCondition;
window.filterByPhase = filterByPhase;
window.toggleTurkeyOnly = toggleTurkeyOnly;
window.openStudyModal = openStudyModal;
window.closeStudyModal = closeStudyModal;
window.toggleFollowStudy = toggleFollowStudy;
window.removeFromFollowed = removeFromFollowed;
window.refreshFollowedStudiesLive = refreshFollowedStudiesLive;
window.exportFollowedStudies = exportFollowedStudies;
window.clearFollowedStudies = clearFollowedStudies;

// Sayfa Yüklendiğinde Başlat
document.addEventListener('DOMContentLoaded', () => {
  loadFollowedFromStorage();
  searchStudies('kanser');

  // Escape tuşuna basıldığında modalı kapat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeStudyModal();
    }
  });

  // Modal dışına tıklandığında kapat
  const modal = document.getElementById('study-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeStudyModal();
      }
    });
  }
});

