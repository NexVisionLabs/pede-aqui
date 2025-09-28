const path = window.location.pathname; // "/pede-aqui/girafas"
const prefix = "/pede-aqui/";
const value = path.startsWith(prefix) ? path.slice(prefix.length) : null;
const lambdaUrl = 'https://gnzfdeubnee3waor43psjpnjoi0ielfw.lambda-url.us-east-2.on.aws/?company='

export const cardapioService = {
    getCardapio: async () => {
        console.log(value);
        const response = await fetch(lambdaUrl+`${value}`);
        console.log(response);
        if (!response.ok) {
            return [];
        }
        return response.json();
    },
};
