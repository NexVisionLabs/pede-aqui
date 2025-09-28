const x =
    "https://gnzfdeubnee3waor43psjpnjoi0ielfw.lambda-url.us-east-2.on.aws/?company=pedeaqui";

export const cardapioService = {
    getCardapio: async () => {
        const response = await fetch(x);
        if (!response.ok) {
            console.error("Erro ao fazer GET para a URL", x);
            return [];
        }
        return response.json();
    },
};
