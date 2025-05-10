export default function useCalcularPrecoVendas () {
  const calcularPrecoVenda = (valor, percentual) => {
    const precoVenda = valor * (1 + percentual / 100);
    return Number(precoVenda.toFixed(2));
  };

  return { calcularPrecoVenda }
}
