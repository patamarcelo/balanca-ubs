import { applyComplementAreas, getComplementError, syncComplementObservation } from './partial-area';
import ListProducts from './list-products';
import ComplementAreasTable from './complement-areas-table';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ap = 'Teste - AP100 | 2026-11-10';
const products = [
    { finalCode: 'Teste - AP100', date: '2026-11-10', farmName: 'Fazenda Teste', inputId: 1, inputName: 'Produto A', inputType: 'Herbicida', dosage: 2, quantity: 200 },
    { finalCode: 'Teste - AP100', date: '2026-11-10', farmName: 'Fazenda Teste', inputId: 2, inputName: 'Produto B', inputType: 'Adjuvante', dosage: 0.5, quantity: 50 },
    { finalCode: 'Teste - AP100', date: '2026-11-10', farmName: 'Fazenda Teste', inputId: 3, inputName: 'Operação', inputType: 'Operação', dosage: 1, quantity: 100 },
    { finalCode: 'Teste - AP101', date: '2026-11-10', farmName: 'Fazenda Teste', inputId: 1, inputName: 'Produto A', inputType: 'Herbicida', dosage: 3, quantity: 300 },
];

test('20 ha uses each product dose and leaves operations and other APs unchanged', () => {
    const result = applyComplementAreas(products, { [ap]: '20' });
    expect(result.map((p) => p.quantity)).toEqual([40, 10, 100, 300]);
    expect(products[0].quantity).toBe(200);
    expect(applyComplementAreas(products, {})).toEqual(products);
});

test('accepts decimal comma and validates invalid areas and missing doses', () => {
    expect(applyComplementAreas(products, { [ap]: '20,5' })[0].quantity).toBe(41);
    for (const value of ['0', '-1', 'abc', 'Infinity', ' ']) {
        expect(getComplementError({ [ap]: value }, products)).not.toBe('');
    }
    expect(getComplementError({ [ap]: '20' }, [{ ...products[0], dosage: undefined }])).not.toBe('');
    expect(getComplementError({ [ap]: '20' }, products)).toBe('');
});

test('display and Protheus product list use recalculated quantities respecting exclusion filters', () => {
    const setProducts = jest.fn();
    const selectedData = { Projeto: ['Fazenda Teste'], Data: ['2026-11-10'], Ap: [ap], Tipo: ['Operação'], Insumo: ['Produto B'] };
    const setAreas = jest.fn();
    const renderList = (areas) => <ThemeProvider theme={createTheme()}>
        <div data-testid="capture-region">
        <ListProducts selectedData={selectedData} productsArr={applyComplementAreas(products, areas)}
            setprodcutsToProtheus={setProducts} observations={syncComplementObservation("Observação manual", Boolean(areas[ap]))} setObservations={jest.fn()} />
        </div>
        <ComplementAreasTable aps={selectedData.Ap} areas={areas} setAreas={setAreas} />
    </ThemeProvider>;
    const view = render(renderList({ [ap]: '20' }));
    expect(screen.getAllByText('40,00')).toHaveLength(2);
    expect(screen.queryByText('Produto B')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Observações' })).toHaveValue('Observação manual\nComplemento de produto');
    expect(setProducts.mock.calls.at(-1)[0]).toEqual([expect.objectContaining({ inputId: 1, quantidade: 40 })]);
    expect(within(screen.getByTestId('capture-region')).queryByLabelText('Área de complemento (ha) - Teste - AP100')).not.toBeInTheDocument();
    expect(screen.queryByRole('table', { name: 'Áreas de complemento por AP' })).not.toBeInTheDocument();
    const toggle = screen.getByRole('button', { name: /Solicitar complemento de produtos/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    const table = screen.getByRole('table', { name: 'Áreas de complemento por AP' });
    expect(within(table).getByRole('cell', { name: 'Teste - AP100 | 20 Há' })).toBeInTheDocument();
    expect(within(table).queryByText(ap)).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Área de complemento (ha) - Teste - AP100'), { target: { value: '30' } });
    expect(setAreas).toHaveBeenCalled();
    view.rerender(renderList({ [ap]: '1500' }));
    expect(within(table).getByRole('cell', { name: 'Teste - AP100 | 1.500 Há' })).toBeInTheDocument();
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(screen.getByLabelText('Área de complemento (ha) - Teste - AP100')).toHaveValue('1500');
    view.rerender(renderList({}));
    expect(screen.getAllByText('200,00')).toHaveLength(2);
    expect(screen.getByRole('textbox', { name: 'Observações' })).toHaveValue('Observação manual');
    expect(setProducts.mock.calls.at(-1)[0][0].quantidade).toBe(200);
});

test('complement observation preserves manual text without duplicating the marker', () => {
    const observation = syncComplementObservation('Entregar pela manhã', true);
    expect(observation).toBe('Entregar pela manhã\nComplemento de produto');
    expect(syncComplementObservation(observation, true)).toBe(observation);
    expect(syncComplementObservation(observation, false)).toBe('Entregar pela manhã');
});
