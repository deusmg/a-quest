export default function DemoPage() { 
        return ( 
        <main style={{ padding: "60px", fontFamily: "Arial, sans-serif"}}>
        <p>Это пробная демо-страница на Next.js.</p>

        <section style={{ marginTop: "30px" }}>
        <h2>Первый квест.</h2>
        <p>Здесь позже появится описание уровня, заданя и кнопка старта</p>
        </section>

        <button style={{
        marginTop: "20px",
        padding: "12px 20px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer"
        }}>
        Начать
        </button>
	</main>
	);
}
