"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { ArrowLeft, Check, ImagePlus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/lib/supabase";

type UploadRecord = { id: string; title: string; date: string; description: string; image: string; fileName: string };

export default function AdminUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10).replaceAll("-", "."));
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState<UploadRecord[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      if (supabase) {
        const { data } = await supabase.from("drawings").select("id,title,date,description,image_url").order("created_at", { ascending: false });
        if (data) { setSaved(data.map(item => ({ id: String(item.id), title: item.title, date: item.date, description: item.description || "", image: item.image_url, fileName: "Supabase Storage" }))); return; }
      }
      try { setSaved(JSON.parse(localStorage.getItem("eunsu-upload-records") || "[]")); } catch { setSaved([]); }
    };
    void load();
  }, []);
  useEffect(() => () => { if (preview.startsWith("blob:")) URL.revokeObjectURL(preview); }, [preview]);

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith("image/")) { setMessage("JPG, PNG, WEBP 같은 이미지 파일만 올려주세요."); return; }
    if (selected.size > 8 * 1024 * 1024) { setMessage("사진은 8MB 이하로 선택해주세요."); return; }
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(selected); setPreview(URL.createObjectURL(selected)); setMessage("");
  };

  const savePhoto = async () => {
    if (!file || !preview || !title.trim()) { setMessage("사진과 제목을 먼저 입력해주세요."); return; }
    if (supabase) {
      const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
      const filePath = `drawings/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from("eunsu-images").upload(filePath, file, { upsert: false });
      if (uploadError) { setMessage(`사진 업로드 실패: ${uploadError.message}`); return; }
      const { data: publicData } = supabase.storage.from("eunsu-images").getPublicUrl(filePath);
      const { error: rowError } = await supabase.from("drawings").insert({ title: title.trim(), date, description: description.trim(), category: "기타", quote: "", image_url: publicData.publicUrl });
      if (rowError) { setMessage(`사진 정보 저장 실패: ${rowError.message}`); return; }
      setFile(null); setPreview(""); setTitle(""); setDescription(""); setMessage("Supabase에 사진이 저장되었습니다. 다른 PC에서도 확인할 수 있어요.");
      const { data } = await supabase.from("drawings").select("id,title,date,description,image_url").order("created_at", { ascending: false });
      if (data) setSaved(data.map(item => ({ id: String(item.id), title: item.title, date: item.date, description: item.description || "", image: item.image_url, fileName: "Supabase Storage" })));
      return;
    }
    const record: UploadRecord = { id: crypto.randomUUID(), title: title.trim(), date, description: description.trim(), image: preview, fileName: file.name };
    const next = [record, ...saved];
    try { localStorage.setItem("eunsu-upload-records", JSON.stringify(next)); setSaved(next); setFile(null); setPreview(""); setTitle(""); setDescription(""); setMessage("사진이 이 브라우저에 저장되었습니다."); } catch { setMessage("사진 용량이 커서 브라우저 저장에 실패했습니다."); }
  };
  const removePhoto = async (id: string) => { if (supabase) { await supabase.from("drawings").delete().eq("id", id); } const next = saved.filter(item => item.id !== id); localStorage.setItem("eunsu-upload-records", JSON.stringify(next)); setSaved(next); };

  return <main className="admin-page"><header className="admin-header"><a className="admin-back" href="/"><ArrowLeft size={17}/> 사이트로 돌아가기</a><span className="admin-logo"><span>은</span><b>은수 관리자</b></span></header><section className="admin-wrap"><div className="admin-intro"><span className="admin-kicker">EUNSU ARCHIVE · ADMIN</span><h1>사진 업로드</h1><p>은수의 소중한 순간을 한 장씩 기록해 보세요.</p></div><div className="admin-grid"><section className="upload-panel"><div className="panel-title"><div><h2>새 사진 추가</h2><p>현재는 이 브라우저에만 저장되는 미리보기 버전입니다.</p></div><ImagePlus size={25}/></div><label className={preview ? "dropzone has-image" : "dropzone"}><input type="file" accept="image/*" onChange={chooseFile}/>{preview ? <><img src={preview} alt="업로드 미리보기"/><span className="change-image">사진 바꾸기</span></> : <><Upload size={30}/><b>사진을 선택하세요</b><small>JPG, PNG, WEBP · 최대 8MB</small></>}</label><div className="form-grid"><label>사진 제목<input value={title} onChange={e => setTitle(e.target.value)} placeholder="예: 우리 가족 여름휴가"/></label><label>날짜<input value={date} onChange={e => setDate(e.target.value)} placeholder="2026.08.17"/></label></div><label className="form-full">사진 설명<textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="사진 속 이야기를 짧게 적어주세요." rows={4}/></label>{message && <p className="admin-message"><Check size={16}/>{message}</p>}<button className="admin-save" onClick={savePhoto}><Upload size={18}/> 사진 저장하기</button><p className="admin-tip">💡 실제 온라인 저장과 가족만 볼 수 있는 로그인 기능은 Supabase를 연결하면 추가할 수 있습니다.</p></section><section className="saved-panel"><div className="panel-title"><div><h2>저장한 사진</h2><p>{saved.length}장의 사진이 이 브라우저에 있습니다.</p></div></div>{saved.length === 0 ? <div className="empty-saved"><ImagePlus size={30}/><p>아직 저장한 사진이 없어요.<br/>왼쪽에서 첫 사진을 추가해 보세요.</p></div> : <div className="saved-list">{saved.map(item => <article key={item.id}><img src={item.image} alt={item.title}/><div><b>{item.title}</b><small>{item.date}</small><p>{item.description || "설명이 없습니다."}</p></div><button onClick={() => removePhoto(item.id)} aria-label={`${item.title} 삭제`}><Trash2 size={16}/></button></article>)}</div>}</section></div></section><footer className="admin-footer">Made with <span>♥</span> for Eunsu</footer></main>;
}
