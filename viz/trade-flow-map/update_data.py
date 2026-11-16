import csv
import json
import sys
from collections import defaultdict

TOTAL_2025 = {
    "160": 99940244710,  # China
    "249": 37682246914,  # Estados Unidos
    "063": 18105303283,  # Argentina
    "573": 11726736048,  # Holanda
    "361": 6865880767,   # Índia
    "245": 8783248496,   # Espanha
    "493": 7728866863,   # México
    "741": 7353096562,   # Cingapura
    "149": 7251870870,   # Canadá
    "158": 7176227117,   # Chile
    "386": 5361690529,   # Itália
    "023": 6524224630    # Alemanha
}

PAIS_META = {
    "160": {"country": "China", "flag": "cn", "iso": "156", "coords": [105, 35], "labelPos": "right", "color": "#ff4500"},
    "249": {"country": "Estados Unidos", "flag": "us", "iso": "840", "coords": [-100, 40], "labelPos": "neutral", "color": "#005a87"},
    "063": {"country": "Argentina", "flag": "ar", "iso": "032", "coords": [-65, -34], "labelPos": "neutral", "color": "#6ec6ff"},
    "573": {"country": "Holanda", "flag": "nl", "iso": "528", "coords": [5.3, 52.1], "labelPos": "top", "color": "#ff9f43"},
    "361": {"country": "Índia", "flag": "in", "iso": "356", "coords": [78.9, 20.6], "labelPos": "left", "color": "#ff9f43"},
    "245": {"country": "Espanha", "flag": "es", "iso": "724", "coords": [-3.7, 40.4], "labelPos": "left", "color": "#ff9f43"},
    "493": {"country": "México", "flag": "mx", "iso": "484", "coords": [-102, 23], "labelPos": "left", "color": "#ff9f43"},
    "741": {"country": "Cingapura", "flag": "sg", "iso": "702", "coords": [103.8, 1.3], "labelPos": "bottom", "color": "#ff9f43"},
    "149": {"country": "Canadá", "flag": "ca", "iso": "124", "coords": [-106, 56], "labelPos": "top", "color": "#ff9f43"},
    "158": {"country": "Chile", "flag": "cl", "iso": "152", "coords": [-71, -33], "labelPos": "left", "color": "#ff9f43"},
    "386": {"country": "Itália", "flag": "it", "iso": "380", "coords": [12.5, 41.9], "labelPos": "right", "color": "#ff9f43"},
    "023": {"country": "Alemanha", "flag": "de", "iso": "276", "coords": [10.4, 51.1], "labelPos": "right", "color": "#ff9f43"}
}

SH4_NAMES = {
    "0201": "Carne bovina fresca",
    "0202": "Carne bovina congelada",
    "0203": "Carne suína",
    "0207": "Carne de aves",
    "0901": "Café",
    "1005": "Milho",
    "1201": "Soja",
    "1507": "Óleo de soja",
    "1701": "Açúcares",
    "2304": "Farelo de soja",
    "2601": "Minério de ferro",
    "2603": "Minério de cobre",
    "2709": "Óleos brutos de petróleo",
    "2710": "Óleos combustíveis",
    "2716": "Energia elétrica",
    "2818": "Óxido de alumínio",
    "4703": "Celulose",
    "7108": "Ouro",
    "7202": "Ferroligas",
    "7207": "Aço semi-acabado",
    "8414": "Bombas e compressores",
    "8701": "Tratores",
    "8703": "Automóveis",
    "8704": "Veículos de carga",
    "8708": "Autopeças",
    "8802": "Aeronaves"
}

csv_path = sys.argv[1] if len(sys.argv) > 1 else "EXP_2026.csv"
total_fob = 0
pais_totais = defaultdict(int)
mundo_produtos = defaultdict(int)
pais_produtos = defaultdict(lambda: defaultdict(int))
ano_ref = 2026

with open(csv_path, mode="r", encoding="utf-8") as f:
    reader = csv.DictReader(f, delimiter=";")
    for row in reader:
        ano_ref = int(row["CO_ANO"])
        pais = row["CO_PAIS"].strip()
        sh4 = row["CO_NCM"].strip()[:4]
        val = int(row["VL_FOB"])
        total_fob += val
        pais_totais[pais] += val
        mundo_produtos[sh4] += val
        pais_produtos[pais][sh4] += val

top_mundo = sorted(mundo_produtos.items(), key=lambda x: x[1], reverse=True)[:5]
export_data = {
    "Mundo": [{"p": SH4_NAMES.get(k, f"SH4 {k}"), "v": round(v / 1e9, 2)} for k, v in top_mundo]
}

ranking_data = [
    {"rank": "", "country": "Mundo", "value": round(total_fob / 1e9, 1), "trend": "", "flag": "un", "color": "#004b23"}
]

iso_map = {"Brasil": "076"}
top_paises = sorted(pais_totais.items(), key=lambda x: x[1], reverse=True)[:10]

for rank, (code, val) in enumerate(top_paises, start=1):
    meta = PAIS_META.get(code, {"country": f"País {code}", "flag": "un", "iso": code, "coords": [0, 0], "labelPos": "neutral", "color": "#ff9f43"})
    nome = meta["country"]
    v25 = TOTAL_2025.get(code, 0)
    if v25 > 0:
        pct = round(((val - v25) / v25) * 100)
        trend_str = f"+{pct}%" if pct > 0 else (f"{pct}%" if pct < 0 else "0%")
    else:
        trend_str = ""

    ranking_data.append({
        "rank": rank,
        "country": nome,
        "value": round(val / 1e9, 1),
        "trend": trend_str,
        "flag": meta["flag"],
        "color": meta["color"],
        "coords": meta["coords"],
        "labelPos": meta["labelPos"]
    })
    iso_map[nome] = meta["iso"]
    top_p = sorted(pais_produtos[code].items(), key=lambda x: x[1], reverse=True)[:5]
    export_data[nome] = [{"p": SH4_NAMES.get(k, f"SH4 {k}"), "v": round(v / 1e9, 2)} for k, v in top_p]

with open("data/exports.json", "w", encoding="utf-8") as out:
    json.dump({"year": ano_ref, "exportData": export_data, "rankingData": ranking_data, "isoMap": iso_map}, out, ensure_ascii=False, indent=2)
