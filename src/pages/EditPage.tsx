import { useCallback, useEffect, useRef, useState } from "react";
import './EditPage.css';
import { createRecord, deleteRecord, getRecordById, updateRecord } from "../db/record.ts";
import { ChevronLeft, MoreHorizontal, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router";

export default function EditPage() {
    const navigate = useNavigate();

    const { id } = useParams<{ id: string }>();

    const [content, setContent] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    // 当前记录的id
    const recordId = useRef<string>(null);
    // 是否发生过编辑
    const hasEdited = useRef(false);
    // 始终保存最新的正文
    const latestContent = useRef('');
    // 用promise队列保证写入顺序
    const saveQueue = useRef<Promise<void>>(
        // 创建队列起点，一个已经完成的promise
        Promise.resolve());

    // 统一处理创建和更新
    const persist = useCallback((text: string) => {
        const task = saveQueue.current
            // 某次保存失败后，后续保存仍有机会继续尝试
            .catch(() => {
            })
            // 等上一个任务完成再执行
            .then(async () => {
                if (recordId.current) {
                    // 已存在记录，更新
                    await updateRecord(recordId.current, text);
                } else if (text.trim()) {
                    // 新记录首次保存，创建
                    const record = await createRecord(text);
                    recordId.current = record.id;
                }
            })

        saveQueue.current = task;
        return task;
    }, []);

    // 监听正文变化，实现防抖自动保存
    useEffect(() => {
        if (!hasEdited.current) return;

        const timer = setTimeout(() => {
            persist(content)
                .catch((e) => {
                    console.error('保存失败', e);
                })
        }, 500);
        return () => clearTimeout(timer);
    }, [content, persist]);

    useEffect(() => {
        if (!id) return;

        getRecordById(id).then((record) => {
            if (!record) return;

            recordId.current = record.id;
            latestContent.current = record.content;
            setContent(record.content);
        }).catch((error) => {
            console.error('加载记录失败', error);
        })
    }, [id]);

    const handleChange = (text: string) => {
        latestContent.current = text;
        hasEdited.current = true;
        setContent(text);
    }

    // 返回前，把最后的修改写入数据库
    const handleBack = async () => {
        await persist(latestContent.current);
        navigate('/');
    }

    const handleDelete = async () => {
        setMenuOpen(false);
        const confirmed = window.confirm('确定删除这篇记录吗？删除后无法恢复。')
        if (!confirmed) return

        try {
            // 还没输入任何内容时，点击删除，直接回列表，不需要操作数据库
            if (recordId.current) {
                await deleteRecord(recordId.current);
            }

            // 替换全部页的历史记录
            navigate('/records', { replace: true })
        } catch (error) {
            console.error('删除失败', error)
        }
    }

    return (
        <main className="edit-page">
            <header className="edit-header">
                <button onClick={handleBack}>
                    <ChevronLeft/>
                </button>

                <div className="edit-menu">
                    <button onClick={() => setMenuOpen(!menuOpen)}>
                        <MoreHorizontal />
                    </button>
                    {menuOpen && (
                        <div className="edit-menu-popup">
                            <button className="edit-delete" onClick={handleDelete}>
                                <Trash2 size={18} strokeWidth={1.8} />
                                <span>删除</span>
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="edit-stats">
                {content.length}
            </div>

            <textarea
                className="edit-content"
                value={content}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="写点啥..."
            />
        </main>
    )
}
