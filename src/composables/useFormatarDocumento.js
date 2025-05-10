export function useFormatarDocumento() {
  const formatarDocumento = (documento) => {
    if (!documento) return ''; // Retorna vazio se for null ou undefined
    const apenasNumeros = documento.replace(/\D/g, ''); // Remove tudo que não for número

    // CPF: 11 dígitos
    if (apenasNumeros.length === 11) {
      return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    // CNPJ: 14 dígitos
    else if (apenasNumeros.length === 14) {
      return apenasNumeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    // Retorna sem formatação se não for CPF nem CNPJ
    return documento;
  };

  return { formatarDocumento };
}
