/**
 * Copyright (c) 2015-2026, FineX, All Rights Reserved.
 * @author Emma.czy
 * @date 2026/10/31
 */
import {type DBSchema, openDB} from "idb";
import type { WritingRecord } from "../types/writingRecord.ts";
import { v4 as uuidv4 } from "uuid";

// 定义数据库schema
interface RecordDB extends DBSchema {
    records: {
        key: string;
        value: WritingRecord;
    }
}

// 打开数据库，不存在就创建
const dbPromise = openDB<RecordDB>("life-record", 1, {
    upgrade(db) {
        db.createObjectStore("records", {
            keyPath: "id",
        });
    },
});

/**
 * 新建记录
 */
export async function createRecord(content: string): Promise<WritingRecord> {
    const now = new Date();

    const record: WritingRecord = {
        id: uuidv4(),
        content,
        createdAt: now,
        updatedAt: now,
    };
    const db = await dbPromise;

    await db.add("records", record);
    return record;
}

/**
 * 读取单篇记录
 */
export async function getRecordById(id: string): Promise<WritingRecord | undefined> {
    const db = await dbPromise;

    return db.get("records", id);
}

/**
 * 读取全部记录
 */
export async function getRecords(): Promise<WritingRecord[]> {
    const db = await dbPromise;
    const records = await db.getAll("records");
    return records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * 修改记录
 */
export async function updateRecord(id: string, content: string): Promise<WritingRecord> {
    const db = await dbPromise;
    const tx = db.transaction("records", "readwrite");

    const oldRecord = await tx.store.get(id);
    if (!oldRecord) {
        throw new Error("Record not found");
    }

    const updatedRecord: WritingRecord = {
        ...oldRecord,
        content,
        updatedAt: new Date(),
    };

    await tx.store.put(updatedRecord);
    await tx.done;

    return updatedRecord;
}

/**
 * 删除记录
 */
export async function deleteRecord(id: string): Promise<void> {
    const db = await dbPromise;
    await db.delete("records", id);
}
