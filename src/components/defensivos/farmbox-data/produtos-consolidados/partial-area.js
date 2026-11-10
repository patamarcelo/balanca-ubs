export const parseArea = (value) => Number(String(value).trim().replace(',', '.'));

export const getComplementError = (areas, products = []) => {
    if (Object.values(areas).some((value) => !Number.isFinite(parseArea(value)) || parseArea(value) <= 0)) {
        return 'Informe uma área de complemento maior que zero.';
    }
    const missingDose = products.some((product) =>
        areas[`${product.finalCode} | ${product.date}`] !== undefined &&
        product.inputType !== 'Operação' &&
        (product.dosage === null || product.dosage === undefined || product.dosage === '' ||
            !Number.isFinite(Number(product.dosage)) || Number(product.dosage) < 0)
    );
    return missingDose ? 'Há insumos sem dose válida no Farmbox para calcular o complemento.' : '';
};

export const applyComplementAreas = (products, areas) => products.map((product) => {
    const ap = `${product.finalCode} | ${product.date}`;
    if (areas[ap] === undefined || product.inputType === 'Operação') return product;
    const area = parseArea(areas[ap]);
    const dose = Number(product.dosage);
    return {
        ...product,
        quantity: Number.isFinite(area) && area > 0 && Number.isFinite(dose) ? dose * area : 0,
    };
});
