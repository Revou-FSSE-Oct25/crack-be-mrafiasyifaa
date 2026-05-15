import 'dotenv/config';
import { PrismaClient, AntibioticCategory, AntibioticForm } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

const antibiotics = [
  // ─── KOMERSIAL (Access) ──────────────────────────────────────────────────
  {
    name: 'Amoksisilin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.TABLET,
    description: 'Penisilin broad-spectrum oral, lini pertama infeksi saluran napas atas, ISK ringan, dan otitis media',
  },
  {
    name: 'Amoksisilin-Asam Klavulanat',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.TABLET,
    description: 'Kombinasi amoksisilin dengan inhibitor beta-laktamase; aktif terhadap bakteri penghasil ESBL ringan',
  },
  {
    name: 'Ampisilin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.INJEKSI,
    description: 'Penisilin broad-spectrum parenteral, digunakan untuk meningitis dan infeksi berat gram positif/negatif',
  },
  {
    name: 'Ampisilin-Sulbaktam',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.INJEKSI,
    description: 'Kombinasi ampisilin dengan inhibitor beta-laktamase sulbaktam; infeksi intraabdominal dan ginekologi',
  },
  {
    name: 'Benzatin Benzil Penisilin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.INJEKSI,
    description: 'Penisilin long-acting IM; lini pertama faringitis streptokokus dan sifilis stadium awal',
  },
  {
    name: 'Doksisiklin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.TABLET,
    description: 'Tetrasiklin broad-spectrum; aktif terhadap bakteri intraseluler, Chlamydia, Rickettsia, dan malaria',
  },
  {
    name: 'Eritromisin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.TABLET,
    description: 'Makrolid generasi pertama; alternatif penisilin pada pasien alergi, aktif terhadap bakteri atipik',
  },
  {
    name: 'Fenoksimetilpenisilin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.TABLET,
    description: 'Penisilin oral (penisilin V) untuk infeksi ringan gram positif, terutama streptokokus',
  },
  {
    name: 'Gentamisin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.INJEKSI,
    description: 'Aminoglikosida; aktif terhadap gram negatif aerobik termasuk Pseudomonas, sering dikombinasi dengan beta-laktam',
  },
  {
    name: 'Kanamisin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.INJEKSI,
    description: 'Aminoglikosida; digunakan dalam regimen tuberkulosis lini kedua dan infeksi gram negatif',
  },
  {
    name: 'Klindamisin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.KAPSUL,
    description: 'Linkosamid; aktif terhadap gram positif dan anaerob, pilihan pada infeksi kulit dan jaringan lunak',
  },
  {
    name: 'Kloksasilin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.TABLET,
    description: 'Penisilin tahan penisilinase (isoksazolil penisilin); pilihan utama untuk Staphylococcus aureus non-MRSA',
  },
  {
    name: 'Kloramfenikol',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.TABLET,
    description: 'Broad-spectrum bakteriostatik; cadangan untuk demam tifoid dan meningitis di sumber daya terbatas',
  },
  {
    name: 'Metronidazol',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.TABLET,
    description: 'Aktif terhadap bakteri anaerob dan protozoa; digunakan untuk infeksi intraabdominal, vaginosis, dan C. difficile',
  },
  {
    name: 'Oksitetrasiklin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.SALEP,
    description: 'Tetrasiklin topikal untuk infeksi kulit dan mata superfisial',
  },
  {
    name: 'Prokain Penisilin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.INJEKSI,
    description: 'Penisilin depot IM untuk infeksi sedang, terutama pneumonia pneumokokus dan sifilis',
  },
  {
    name: 'Sefadroksil',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.SIRUP,
    description: 'Sefalosporin generasi 1 oral; infeksi kulit, jaringan lunak, dan saluran kemih tanpa komplikasi',
  },
  {
    name: 'Sefaleksin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.KAPSUL,
    description: 'Sefalosporin generasi 1 oral; infeksi ringan-sedang kulit dan saluran kemih',
  },
  {
    name: 'Sefazolin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.INJEKSI,
    description: 'Sefalosporin generasi 1 parenteral; pilihan utama profilaksis antibiotik bedah',
  },
  {
    name: 'Siprofloksasin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.TABLET,
    description: 'Fluorokuinolon generasi 2 oral; infeksi saluran kemih, diare bakteri, dan infeksi gram negatif ringan',
  },
  {
    name: 'Streptomisin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.INJEKSI,
    description: 'Aminoglikosida tertua; lini kedua tuberkulosis dan brucellosis',
  },
  {
    name: 'Sulfadiazin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.TABLET,
    description: 'Sulfonamid; dikombinasi dengan pirimetamin untuk toksoplasmosis pada pasien imunokompromais',
  },
  {
    name: 'Tetrasiklin',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.TABLET,
    description: 'Broad-spectrum bakteriostatik; aktif terhadap Chlamydia, Helicobacter pylori, dan Rickettsia',
  },
  {
    name: 'Tiamfenikol',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.TABLET,
    description: 'Derivat kloramfenikol dengan profil efek samping lebih aman; digunakan untuk demam tifoid dan gonore',
  },
  {
    name: 'Ko-trimoksazol',
    category: AntibioticCategory.KOMERSIAL,
    form: AntibioticForm.TABLET,
    description: 'Kombinasi sulfametoksazol-trimetoprim; ISK, Pneumocystis jirovecii, dan toksoplasmosis',
  },

  // ─── DIAWASI (Watch) ─────────────────────────────────────────────────────
  {
    name: 'Amikasin',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.INJEKSI,
    description: 'Aminoglikosida semi-sintetik; aktif terhadap gram negatif resisten termasuk ESBL dan Pseudomonas aeruginosa',
  },
  {
    name: 'Azitromisin',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.TABLET,
    description: 'Makrolid long-acting (half-life 68 jam); infeksi saluran napas, bakteri atipik, dan klamidia',
  },
  {
    name: 'Fosfomisin',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.TABLET,
    description: 'Antibiotik unik penghambat sintesis dinding sel; lini pertama ISK tanpa komplikasi pada wanita',
  },
  {
    name: 'Klaritomisin',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.TABLET,
    description: 'Makrolid; eradikasi Helicobacter pylori, infeksi Mycobacterium avium, dan saluran napas',
  },
  {
    name: 'Levofloksasin',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.TABLET,
    description: 'Fluorokuinolon respiratorik generasi 3; pneumonia komunitas, sinusitis, dan ISK kompleks',
  },
  {
    name: 'Moksifloksasin',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.TABLET,
    description: 'Fluorokuinolon generasi 4 dengan aktivitas anaerob; pneumonia komunitas berat dan tuberkulosis lini kedua',
  },
  {
    name: 'Ofloksasin',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.TABLET,
    description: 'Fluorokuinolon generasi 2; ISK kompleks, gonore, dan tuberkulosis lini kedua',
  },
  {
    name: 'Sefiksim',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.TABLET,
    description: 'Sefalosporin generasi 3 oral; gonore tanpa komplikasi, ISK, dan infeksi saluran napas',
  },
  {
    name: 'Sefoperazon-Sulbaktam',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.INJEKSI,
    description: 'Sefalosporin generasi 3 dikombinasi inhibitor beta-laktamase; infeksi intraabdominal dan nosokomial berat',
  },
  {
    name: 'Sefotaksim',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.INJEKSI,
    description: 'Sefalosporin generasi 3 parenteral; meningitis bakterial, sepsis, dan infeksi gram negatif berat',
  },
  {
    name: 'Seftazidim',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.INJEKSI,
    description: 'Sefalosporin generasi 3 dengan aktivitas kuat terhadap Pseudomonas aeruginosa; infeksi nosokomial',
  },
  {
    name: 'Seftriakson',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.INJEKSI,
    description: 'Sefalosporin generasi 3 long-acting once-daily; meningitis, gonore, sepsis, dan infeksi berat',
  },
  {
    name: 'Sefuroksim',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.TABLET,
    description: 'Sefalosporin generasi 2; infeksi saluran napas, kulit, dan Lyme disease',
  },
  {
    name: 'Siprofloksasin Injeksi',
    category: AntibioticCategory.DIAWASI,
    form: AntibioticForm.INJEKSI,
    description: 'Fluorokuinolon parenteral; infeksi gram negatif berat dan sepsis pada pasien yang tidak dapat minum oral',
  },

  // ─── RISET (Reserve) ─────────────────────────────────────────────────────
  {
    name: 'Aztreonam',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INJEKSI,
    description: 'Monobaktam; aktif spesifik terhadap gram negatif aerobik termasuk Pseudomonas, aman pada alergi penisilin',
  },
  {
    name: 'Daptomisin',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INJEKSI,
    description: 'Lipopeptida siklik; MRSA bakteremia, endokarditis, dan infeksi kulit komplikasi',
  },
  {
    name: 'Meropenem',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INFUS,
    description: 'Karbapenem broad-spectrum; infeksi berat MDR gram negatif, meningitis, dan neutropenia febris',
  },
  {
    name: 'Imipenem-Silastatin',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INFUS,
    description: 'Karbapenem pertama dengan spektrum terluas; infeksi polimikroba berat dan gram negatif resisten',
  },
  {
    name: 'Ertapenem',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INJEKSI,
    description: 'Karbapenem once-daily tanpa aktivitas terhadap Pseudomonas; infeksi komunitas ESBL dan kaki diabetik',
  },
  {
    name: 'Ko-trimoksazol Injeksi',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INJEKSI,
    description: 'Bentuk parenteral untuk pneumonia Pneumocystis jirovecii berat dan infeksi serius pada imunokompromais',
  },
  {
    name: 'Linezolid',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.TABLET,
    description: 'Oksazolidinon; MRSA pneumonia, infeksi kulit komplikasi, dan VRE yang tidak responsif terhadap glikopeptida',
  },
  {
    name: 'Piperasilin-Tazobaktam',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INFUS,
    description: 'Penisilin antipseudomonas dikombinasi inhibitor beta-laktamase; infeksi nosokomial berat dan neutropenia febris',
  },
  {
    name: 'Polimiksin B',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INJEKSI,
    description: 'Polipeptida siklik; last resort untuk infeksi gram negatif pan-resisten (XDR) termasuk Acinetobacter',
  },
  {
    name: 'Kolistin (Polimiksin E)',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INJEKSI,
    description: 'Polipeptida; last resort untuk Acinetobacter baumannii XDR dan Klebsiella pneumoniae KPC',
  },
  {
    name: 'Sefepim',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INJEKSI,
    description: 'Sefalosporin generasi 4; aktif terhadap Pseudomonas, ESBL, dan infeksi nosokomial berat',
  },
  {
    name: 'Seftarolin',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INJEKSI,
    description: 'Sefalosporin generasi 5; satu-satunya sefalosporin aktif terhadap MRSA, pneumonia dan infeksi kulit kompleks',
  },
  {
    name: 'Seftazidim-Avibaktam',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INJEKSI,
    description: 'Sefalosporin + inhibitor beta-laktamase baru; aktif terhadap KPC, OXA-48, dan gram negatif XDR',
  },
  {
    name: 'Seftolozane-Tazobaktam',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INJEKSI,
    description: 'Sefalosporin + inhibitor beta-laktamase; Pseudomonas aeruginosa MDR dan infeksi intraabdominal',
  },
  {
    name: 'Teikoplanin',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INJEKSI,
    description: 'Glikopeptida; alternatif vankomisin dengan half-life lebih panjang untuk MRSA dan gram positif berat',
  },
  {
    name: 'Tigesiklin',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INFUS,
    description: 'Glisisilsiklin (derivat tetrasiklin); infeksi polimikroba, MRSA, dan gram negatif MDR termasuk Acinetobacter',
  },
  {
    name: 'Vankomisin',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.INFUS,
    description: 'Glikopeptida; gold standard MRSA, endokarditis gram positif berat, dan C. difficile oral',
  },
  {
    name: 'Nitrofurantoin',
    category: AntibioticCategory.RISET,
    form: AntibioticForm.TABLET,
    description: 'Aktif eksklusif di saluran kemih; ISK tanpa komplikasi, efektif terhadap ESBL karena mekanisme unik',
  },
];

async function main() {
  console.log('Seeding antibiotics...');

  const existingCount = await prisma.antibiotic.count();
  if (existingCount === 0) {
    await prisma.antibiotic.createMany({
      data: antibiotics.map((a) => ({ ...a, stock: 0 })),
    });
    console.log(`Seeded ${antibiotics.length} antibiotics.`);
  } else {
    console.log(`Skipping antibiotics — ${existingCount} records already exist.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
