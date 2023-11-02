// Importe o módulo exceljs
const ExcelJS = require('exceljs');

// Função para criar e baixar o arquivo Excel
async function downloadExcel(templateData) {
    // Crie um novo Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Template');

    const allFields = templates.reduce((fields, template) => {
        return fields.concat(Object.keys(template)); // Supõe que os templates são objetos com os dados dos campos
    }, []);

    // Adicione as colunas com os nomes dos campos
    worksheet.columns = [
        { header: 'Nome do Template', key: 'nome_template' },
        { header: 'Campos', key: 'nome_campo' },
        // Adicione mais colunas conforme necessário
    ];

    // Adicione os dados dos templates ao arquivo Excel
    for (const template of templateData) {
        worksheet.addRow({
            'Nome do Template': template.nome_template,
            'Tipo de Arquivo': template.tipo_arquivo,
            // Adicione mais campos conforme necessário
        });
    }

    // Gere o arquivo Excel
    const buffer = await workbook.xlsx.writeBuffer();

    // Crie um objeto Blob para o arquivo Excel
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Crie um URL para o Blob
    const url = window.URL.createObjectURL(blob);

    // Crie um link para iniciar o download do arquivo Excel
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nome_do_template.xlsx'; // Nome do arquivo Excel
    link.click();
}
