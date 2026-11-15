import './HomePage.css';
import { useNavigate } from "react-router";
import cat from '../assets/cat.png';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <main className="home-page">
            <img src="src/assets/birds.png" alt="" className="bird" />

            <section className="quote">
                <p className="quote-content">
                    唯有文字能担此重任，
                    <br/>
                    宣告生命曾经在场。
                </p>
            </section>

            <button className="new-record" onClick={() => navigate("/records/new")}>
                <div>
                    <div className="new-record-title">写点啥</div>
                    <div className="new-record-subtitle">把这一刻留下来。</div>
                </div>

                <img src={cat} alt="" className="cat"/>
            </button>

            <button className="all-record" onClick={() => navigate("/records")}>
                <span>全部记录</span>
                <span className="arrow">→</span>
            </button>
        </main>
    );
}

