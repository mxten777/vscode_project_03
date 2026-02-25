import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useAddBook } from '../hooks/useBooks';
import BookForm from '../components/books/BookForm';
import type { BookFormValues } from '../lib/validators';
import { ImagePlus, ArrowLeft, Camera } from 'lucide-react';
import Button from '../components/ui/Button';

export default function BookNewPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const addBook = useAddBook();
  const fileRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (values: BookFormValues) => {
    let coverUrl: string | undefined;

    if (coverFile && user && storage) {
      const storageRef = ref(
        storage,
        `covers/${user.uid}/${Date.now()}_${coverFile.name}`,
      );
      const snap = await uploadBytes(storageRef, coverFile);
      coverUrl = await getDownloadURL(snap.ref);
    }

    await addBook.mutateAsync({ ...values, coverUrl });
    navigate('/books');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 border border-white/60 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">도서 등록</h1>
      </div>

      {/* Cover upload */}
      <div className="flex flex-col items-center gap-4">
        <div
          onClick={() => fileRef.current?.click()}
          className="group relative flex h-48 w-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 
            hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-300 overflow-hidden"
        >
          {coverPreview ? (
            <>
              <img src={coverPreview} alt="cover" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 group-hover:bg-primary-100 transition-colors">
                <ImagePlus className="h-6 w-6 text-primary-400" />
              </div>
              <p className="text-xs text-gray-400 font-medium">표지 추가</p>
            </div>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button variant="ghost" size="sm" onClick={() => fileRef.current?.click()}>
          {coverPreview ? '이미지 변경' : '표지 이미지 선택'}
        </Button>
      </div>

      <BookForm onSubmit={handleSubmit} loading={addBook.isPending} submitLabel="도서 등록" />
    </div>
  );
}
