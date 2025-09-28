import { useEffect, useState } from "react";
import { ProductCard } from "../../components/Card";
import { cardapioService } from "../../services/cardapioService";

export const Home = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCardapio = async () => {
            try {
                const data = await cardapioService.getCardapio();
                console.log('Data', data);
                setProducts(data.items);
            } catch (err) {
                console.error("Erro ao buscar cardápio", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCardapio();
    }, []);

    if (loading) return <p>Carregando cardápio...</p>;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                width: "100vw",
                backgroundColor: "#f5f5f5",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >
            {products.map((product, index) => (
                <ProductCard
                    key={index}
                    title={product.name}
                    description={product.description}
                    price={product.price}
                    imageUrl={product.image}
                    date={product.date}
                />
            ))}
        </div>
    );
};
