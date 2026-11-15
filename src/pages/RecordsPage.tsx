import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { WritingRecord } from "../types/writingRecord.ts";
import { getRecords } from "../db/record.ts";
import './RecordsPage.css';

// 取正文第一行非空文字作为标题
function getPreview(content: string): string {
    return content.split(/\r?\n/).find(line => line.trim())?.trim() || '无题'
}

export default function RecordsPage() {
    const navigate = useNavigate();

    const [records, setRecords] = useState<WritingRecord[]>([]);

    useEffect(() => {
        getRecords().then(data => setRecords(data));
    }, [])

    return (
        <main className='records-page'>
            <header className='records-header'>
                <button onClick={() => navigate('/')}>
                    <ChevronLeft />
                </button>
                <h1>全部记录</h1>
            </header>

            <section className='records-list'>
                {records.map((record) => (
                    <button
                        className='record-item'
                        onClick={() => navigate(`/records/${record.id}`)}
                    >
                        <span className='record-info'>
                            <span className='record-title'>
                                {getPreview(record.content)}
                            </span>
                            <span className='record-time'>
                                {record.createdAt.toUTCString()}
                            </span>
                        </span>
                        <ChevronRight className='record-chevron'/>
                    </button>
                ))}
            </section>

            <footer className='records-footer'>
                <img className='records-cat' src='src/assets/cat-sleep.png' alt='' />
            </footer>
        </main>
    )
}
