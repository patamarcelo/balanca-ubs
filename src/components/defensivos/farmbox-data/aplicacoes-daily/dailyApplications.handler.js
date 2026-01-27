// aplicacoes-daily/dailyApplications.handler.js

const normalizeTxt = (v) =>
    (v ?? "")
        .toString()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim();

const toNumber = (v) => {
    if (v == null) return 0;
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    const s = String(v).replace(",", ".").replace(/[^\d.-]/g, "");
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
};

const toYmdLocal = (dateStr) => {
    if (!dateStr) return null;
    const dt = new Date(dateStr);
    if (Number.isNaN(dt.getTime())) return null;
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const groupBy = (arr, keyFn) =>
    arr.reduce((acc, item) => {
        const k = keyFn(item);
        (acc[k] ||= []).push(item);
        return acc;
    }, {});

const uniqBy = (arr, keyFn) => {
    const seen = new Set();
    const out = [];
    for (const x of arr) {
        const k = keyFn(x);
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(x);
    }
    return out;
};


// ---------- Operação ----------
const pickOperationLabel = (ap) => {
    const items = Array.isArray(ap?.inputs)
        ? ap.inputs
        : Array.isArray(ap?.insumos)
            ? ap.insumos
            : [];

    const isOperacao = (item) => {
        const t = item?.input?.input_type_name || item?.input_type_name || item?.tipo;
        return normalizeTxt(t) === "operacao";
    };

    const opItem = items.find(isOperacao);

    const opName =
        opItem?.input?.name ||
        opItem?.input?.nome ||
        opItem?.name ||
        opItem?.nome ||
        opItem?.produto ||
        opItem?.descricao ||
        "";

    return opName || ap?.operacao || ap?.operation || "";
};

// ---------- Fazendas (fix definitivo) ----------
const normalizeFarmKey = (v) => {
    const s = String(v ?? "")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase()
        .trim()
        .replace(/^fazenda\s+/i, "")
        .replace(/\s+/g, " ");
    return s;
};

// ✅ FIX: NÃO usar equipment.farms (isso quebra o filtro)
const pickFarmNames = ({ ap, pr, plantationsMeta }) => {
    const fromApFarm = [
        ap?.fazenda,
        ap?.farm?.name,
        ap?.farm_name,
        ap?.farmName,
    ].filter(Boolean);

    const fromPlantationsMeta = Array.isArray(plantationsMeta)
        ? plantationsMeta.map((p) => p?.farm_name).filter(Boolean)
        : [];

    return uniqBy(
        [...fromApFarm, ...fromPlantationsMeta]
            .map((x) => String(x).trim())
            .filter(Boolean)
            .map((name) => ({ name })),
        (x) => normalizeFarmKey(x.name)
    ).map((x) => x.name);
};



// ---------- Talhões / Plantations ----------
const buildPlantationsMeta = (ap) => {
    const raw = Array.isArray(ap?.plantations) ? ap.plantations : [];

    const rich = raw
        .map((p) => p?.plantation)
        .filter(Boolean)
        .map((pl) => ({
            plantationId: pl.id,
            name: pl.name,
            variety_name: pl.variety_name,
            farm_name: pl.farm?.name || pl.farm_name,
            area: toNumber(pl.area),
        }));

    const simple = raw
        .filter((p) => p?.plantation_id != null)
        .map((p) => ({
            plantationId: p.plantation_id,
            name: "",
            variety_name: "",
            farm_name: "",
            area: toNumber(p.area),
        }));

    return uniqBy([...rich, ...simple].filter((x) => x.plantationId != null), (x) => String(x.plantationId));
};

const buildProgressPlantations = (pr) => {
    const raw = Array.isArray(pr?.plantations) ? pr.plantations : [];
    return uniqBy(
        raw
            .filter((p) => p?.plantation_id != null)
            .map((p) => ({
                plantationId: p.plantation_id,
                areaHa: toNumber(p.area),
            })),
        (x) => String(x.plantationId)
    );
};

export function buildDashboardData(applications = []) {
    const parcelas = (applications || []).flatMap((ap) => {
        const progresses = Array.isArray(ap?.progresses) ? ap.progresses : [];
        const operationLabel = pickOperationLabel(ap);

        const plantationsMeta = buildPlantationsMeta(ap);
        const plantationsMetaById = new Map((plantationsMeta || []).map((p) => [String(p.plantationId), p]));


        return progresses.flatMap((pr) => {
            const day = toYmdLocal(pr?.date);
            if (!day) return [];

            const progPlants = buildProgressPlantations(pr);

            const rows =
                progPlants.length > 0
                    ? progPlants.map((pp) => {
                        const meta = plantationsMetaById.get(String(pp.plantationId));
                        return {
                            day,
                            applicationId: ap.id,
                            progressId: pr?.id,
                            plantationId: pp.plantationId,

                            code: ap.code || ap.app || String(ap.id),
                            status: ap.status || "",
                            operationLabel,

                            equipmentName: pr?.equipment?.name || "",
                            areaHa: pp.areaHa > 0 ? pp.areaHa : toNumber(pr?.area),

                            velocity: pr?.velocity ?? null,
                            solution: pr?.solution ?? null,

                            plantationName: meta?.name || "",
                            variety_name: meta?.variety_name || "",

                            // ✅ agora traz fazendas também do meta de talhão
                            farmNames: pickFarmNames({ ap, pr, plantationsMeta }),

                            raw: { ap, pr },
                        };
                    })
                    : [
                        {
                            day,
                            applicationId: ap.id,
                            progressId: pr?.id,
                            plantationId: null,

                            code: ap.code || ap.app || String(ap.id),
                            status: ap.status || "",
                            operationLabel,

                            equipmentName: pr?.equipment?.name || "",
                            areaHa: toNumber(pr?.area),

                            velocity: pr?.velocity ?? null,
                            solution: pr?.solution ?? null,

                            plantationName: "",
                            variety_name: "",

                            farmNames: pickFarmNames({ ap, pr, plantationsMeta }),

                            raw: { ap, pr },
                        },
                    ];

            return rows;
        });
    });

    const byDay = groupBy(parcelas, (p) => p.day);
    const daysAsc = Object.keys(byDay).sort();
    const seriesDaily = daysAsc.map((day) => ({
        day,
        area: byDay[day].reduce((acc, r) => acc + toNumber(r.areaHa), 0),
    }));

    const byApp = groupBy(parcelas, (p) => String(p.applicationId));
    const apps = Object.values(byApp).map((rows) => {
        const first = rows[0];
        const totalArea = rows.reduce((acc, r) => acc + toNumber(r.areaHa), 0);

        const parcelasSorted = rows.slice().sort((a, b) => {
            if (a.day !== b.day) return a.day < b.day ? -1 : 1;
            const pa = String(a.progressId ?? "");
            const pb = String(b.progressId ?? "");
            if (pa !== pb) return pa < pb ? -1 : 1;
            return String(a.plantationId ?? "") < String(b.plantationId ?? "") ? -1 : 1;
        });

        const chips = uniqBy(
            rows
                .filter((r) => r.plantationId != null)
                .map((r) => ({
                    key: r.plantationId,
                    label: `${r.plantationName || "Talhão " + r.plantationId}${r.variety_name ? ` — ${r.variety_name}` : ""}`,
                })),
            (x) => String(x.key)
        );

        const farms = uniqBy(
            (rows || []).flatMap((r) => r.farmNames || []).map((n) => ({ n })),
            (x) => normalizeFarmKey(x.n)
        ).map((x) => x.n);

        return {
            applicationId: first.applicationId,
            code: first.code,
            status: first.status,
            operationLabel: first.operationLabel,
            farms,
            equipmentName: first.equipmentName,
            totalAreaHa: totalArea,
            parcelas: parcelasSorted,
            chips,
        };
    });

    const byOp = groupBy(parcelas, (p) => normalizeTxt(p.operationLabel || "sem operacao"));
    const ops = Object.entries(byOp)
        .map(([opKey, rows]) => ({
            operationKey: opKey,
            operationLabel: rows[0]?.operationLabel || "Sem operação",
            area: rows.reduce((acc, r) => acc + toNumber(r.areaHa), 0),
            countParcelas: rows.length,
        }))
        .sort((a, b) => b.area - a.area);

    return { parcelas, seriesDaily, apps, ops };
}

// ✅ FIX: aplica TODOS os filtros e recomputa todas as visões
export function filterDashboard({ data, q, farms, dateStart, dateEnd, operation }) {
    const nq = normalizeTxt(q);
    const farmSet = new Set((farms || []).map(normalizeFarmKey).filter(Boolean));
    const opKey = normalizeTxt(operation);

    const parcelas = (data?.parcelas || [])
        // date range
        .filter((p) => (!dateStart || p.day >= dateStart) && (!dateEnd || p.day <= dateEnd))
        // farms
        .filter((p) => {
            if (!farmSet.size) return true;
            const keys = (p.farmNames || []).map(normalizeFarmKey).filter(Boolean);
            return keys.some((k) => farmSet.has(k));
        })
        // operação
        .filter((p) => {
            if (!opKey) return true;
            return normalizeTxt(p.operationLabel || "") === opKey;
        })
        // busca
        .filter((p) => {
            if (!nq) return true;
            const hay = normalizeTxt(
                `${p.code || ""} ${p.operationLabel || ""} ${p.equipmentName || ""} ${(p.farmNames || []).join(" ")} ${p.plantationName || ""} ${p.variety_name || ""}`
            );
            return hay.includes(nq);
        });

    // --- derivados (sempre a partir de parcelas filtradas) ---
    const byDay = groupBy(parcelas, (p) => p.day);
    const daysAsc = Object.keys(byDay).sort();
    const seriesDaily = daysAsc.map((day) => ({
        day,
        area: byDay[day].reduce((acc, r) => acc + toNumber(r.areaHa), 0),
    }));

    const byApp = groupBy(parcelas, (p) => String(p.applicationId));
    const apps = Object.values(byApp).map((rows) => {
        const first = rows[0];
        const totalArea = rows.reduce((acc, r) => acc + toNumber(r.areaHa), 0);

        const parcelasSorted = rows.slice().sort((a, b) => {
            if (a.day !== b.day) return a.day < b.day ? -1 : 1;
            const pa = String(a.progressId ?? "");
            const pb = String(b.progressId ?? "");
            if (pa !== pb) return pa < pb ? -1 : 1;
            return String(a.plantationId ?? "") < String(b.plantationId ?? "") ? -1 : 1;
        });

        const chips = uniqBy(
            rows
                .filter((r) => r.plantationId != null)
                .map((r) => ({
                    key: r.plantationId,
                    label: `${r.plantationName || "Talhão " + r.plantationId}${r.variety_name ? ` — ${r.variety_name}` : ""}`,
                })),
            (x) => String(x.key)
        );

        const farmsUniq = uniqBy(
            (rows || []).flatMap((r) => r.farmNames || []).map((n) => ({ n })),
            (x) => normalizeFarmKey(x.n)
        ).map((x) => x.n);

        return {
            applicationId: first.applicationId,
            code: first.code,
            status: first.status,
            operationLabel: first.operationLabel,
            farms: farmsUniq,
            equipmentName: first.equipmentName,
            totalAreaHa: totalArea,
            parcelas: parcelasSorted,
            chips,
        };
    });

    const byOp = groupBy(parcelas, (p) => normalizeTxt(p.operationLabel || "sem operacao"));
    const ops = Object.entries(byOp)
        .map(([operationKey, rows]) => ({
            operationKey,
            operationLabel: rows[0]?.operationLabel || "Sem operação",
            area: rows.reduce((acc, r) => acc + toNumber(r.areaHa), 0),
            countParcelas: rows.length,
        }))
        .sort((a, b) => b.area - a.area);

    return { parcelas, seriesDaily, apps, ops };
}

export function buildExportRows(parcelas = []) {
    return parcelas.map((p) => {
        const fazendas = (p.farmNames || []).join(" | ");

        const talhao =
            p.plantationId != null
                ? `${p.plantationName || "Talhão " + p.plantationId}${p.variety_name ? ` (${p.variety_name})` : ""}`
                : "";

        return {
            Dia: p.day,
            AP: p.code,
            Operacao: p.operationLabel || "",
            Status: p.status || "",
            Equipamento: p.equipmentName || "",
            Area_ha: p.areaHa,
            Velocidade: p.velocity ?? "",
            Calda: p.solution ?? "",
            Fazendas: fazendas,
            Talhao: talhao,
            Plantation_ID: p.plantationId ?? "",
            Progress_ID: p.progressId ?? "",
        };
    });
}
