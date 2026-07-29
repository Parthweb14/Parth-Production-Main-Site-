'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  STAGE_IMAGES,
  defaultShowcaseVideos,
  defaultStageGallery,
} from '@/utils/media';

import { 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  AlertCircle, 
  Loader2, 
  CheckCircle, 
  FileImage, 
  FileVideo, 
  Menu, 
  X,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Mail,
  Send,
  Eye,
  EyeOff
} from 'lucide-react';

interface DBImage {
  id: string;
  category: string;
  image_url: string;
  order_index: number;
  isLocal?: boolean;
  localFile?: File;
}

interface DBVideo {
  id: string;
  title: string;
  video_url: string;
  order_index: number;
  isLocal?: boolean;
  localFile?: File;
}

interface DBServiceImage {
  id: number;
  service_title: string;
  image_url: string;
  isLocal?: boolean;
  localFile?: File;
}

interface DBVibrant {
  id: string;
  title: string;
  image_url: string;
  order_index: number;
  isLocal?: boolean;
  localFile?: File;
}

interface SiteSettings {
  email: string;
  phone_1: string;
  phone_2: string;
  address: string;
  smtp_host?: string;
  smtp_port?: string;
  smtp_user?: string;
  smtp_pass?: string;
  from_email?: string;
}

const CATEGORIES = ['All Events', 'Weddings', 'Festivals', 'Concerts', 'Road Shows', 'Corporate'];

const DEFAULT_SERVICES: DBServiceImage[] = [
  { id: 2, service_title: 'CONCERTS', image_url: STAGE_IMAGES[1].src },
  { id: 1, service_title: 'WEDDINGS', image_url: STAGE_IMAGES[0].src },
  { id: 3, service_title: 'FESTIVALS', image_url: STAGE_IMAGES[2].src },
  { id: 4, service_title: 'CORPORATE', image_url: STAGE_IMAGES[3].src },
  { id: 5, service_title: 'ROAD SHOWS', image_url: STAGE_IMAGES[4].src },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, token, loading: authLoading, logout, login } = useAuth();

  // Navigation tabs state
  const [activeTab, setActiveTab] = useState<'gallery' | 'videos' | 'services' | 'vibrants' | 'settings'>('gallery');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data States
  const [images, setImages] = useState<DBImage[]>([]);
  const [videos, setVideos] = useState<DBVideo[]>([]);
  const [serviceImages, setServiceImages] = useState<DBServiceImage[]>([]);
  const [vibrants, setVibrants] = useState<DBVibrant[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({ email: '', phone_1: '', phone_2: '', address: '' });
  
  // Admin credentials states
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminRecoveryKey, setAdminRecoveryKey] = useState('');
  const [initialAdminUsername, setInitialAdminUsername] = useState('admin');
  const [initialAdminPassword, setInitialAdminPassword] = useState('');
  const [initialAdminRecoveryKey, setInitialAdminRecoveryKey] = useState('');
  const [resetCount, setResetCount] = useState(0);
  const [resetPeriodStart, setResetPeriodStart] = useState<number | null>(null);
  const [showPass, setShowPass] = useState(false);

  // Credentials change modal states
  const [showCredsModal, setShowCredsModal] = useState(false);
  const [credsOtp, setCredsOtp] = useState('');
  const [credsOtpSending, setCredsOtpSending] = useState(false);
  const [credsOtpSuccessMsg, setCredsOtpSuccessMsg] = useState<string | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPass, setShowNewPass] = useState(false);
  const [credsChangeLoading, setCredsChangeLoading] = useState(false);
  const [credsChangeError, setCredsChangeError] = useState<string | null>(null);
  
  // Unsaved changes tracking states
  const [initialImages, setInitialImages] = useState<string>('');
  const [initialVideos, setInitialVideos] = useState<string>('');
  const [initialServiceImages, setInitialServiceImages] = useState<string>('');
  const [initialVibrants, setInitialVibrants] = useState<string>('');
  const [settingsSnapshot, setSettingsSnapshot] = useState<string>('');

  // SMTP Test Email States
  const [testEmailAddress, setTestEmailAddress] = useState('');
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailFeedback, setTestEmailFeedback] = useState<{ isSuccess: boolean; msg: string } | null>(null);
  
  // Items marked for deletion (to be removed from R2 on save)
  const [deletedUrls, setDeletedUrls] = useState<string[]>([]);

  // UI state overlays
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [resetEmailSending, setResetEmailSending] = useState(false);

  // Category selection for gallery view
  const [selectedGalleryCat, setSelectedGalleryCat] = useState<string>('All Events');
  const [editingImageId, setEditingImageId] = useState<string | null>(null);

  // File upload input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const serviceInputRef = useRef<HTMLInputElement>(null);
  const vibrantInputRef = useRef<HTMLInputElement>(null);
  
  const [activeServiceIdToChange, setActiveServiceIdToChange] = useState<number | null>(null);
  const [activeVibrantIdToChange, setActiveVibrantIdToChange] = useState<string | null>(null);

  // Verify auth on mount
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  // Load database items on mount
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/admin/data?t=${Date.now()}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load database.');
      const data = await res.json();

      const loadedImages = data.images || [];
      setImages(loadedImages);
      setInitialImages(JSON.stringify(loadedImages));

      const loadedVideos = data.videos || [];
      const videosAreUsable =
        loadedVideos.length > 0 &&
        loadedVideos.some(
          (v: DBVideo) =>
            typeof v.video_url === 'string' &&
            (v.video_url.startsWith('http') || v.video_url.startsWith('/videos/'))
        );
      const usableVideos = videosAreUsable
        ? [...loadedVideos].sort(
            (a: DBVideo, b: DBVideo) => (a.order_index ?? 0) - (b.order_index ?? 0)
          )
        : defaultShowcaseVideos();
      setVideos(usableVideos);
      // If we seeded defaults, leave initial empty so Save prompts a first sync to the live site
      setInitialVideos(videosAreUsable ? JSON.stringify(usableVideos) : '[]');

      if (data.settings) {
        const incoming = { ...data.settings } as typeof settings & { smtp_pass_set?: boolean };
        // API never returns smtp_pass — keep local blank unless user types a new one.
        incoming.smtp_pass = '';
        setSettings(incoming);
        setSettingsSnapshot(JSON.stringify({ ...incoming, smtp_pass: '' }));
      }

      // Securely fetch admin credentials
      const credRes = await fetch('/api/admin/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({})
      });
      if (credRes.ok) {
        const credData = await credRes.json();
        setAdminUsername(credData.username);
        setAdminPassword('');
        setAdminRecoveryKey('');
        setInitialAdminUsername(credData.username);
        setInitialAdminPassword('');
        setInitialAdminRecoveryKey('');
        setResetCount(credData.resetCount || 0);
        setResetPeriodStart(credData.resetPeriodStart || null);
      }

      const loadedServices = data.services || [];
      const mergedServices =
        loadedServices.length > 0
          ? DEFAULT_SERVICES.map((def) => {
              const match = loadedServices.find((s: DBServiceImage) => s.id === def.id);
              if (!match) return def;
              const url = match.image_url || '';
              const broken = !url || url.startsWith('/images/');
              return {
                ...def,
                service_title: match.service_title || def.service_title,
                image_url: broken ? def.image_url : url,
              };
            })
          : DEFAULT_SERVICES;
      setServiceImages(mergedServices);
      setInitialServiceImages(JSON.stringify(mergedServices));

      const loadedVibrants = data.stage_gallery?.length
        ? data.stage_gallery
        : data.vibrants || [];
      const stageSeeded = !(loadedVibrants.length > 0);
      const stageItems = !stageSeeded
        ? [...loadedVibrants]
            .sort((a: DBVibrant, b: DBVibrant) => (a.order_index ?? 0) - (b.order_index ?? 0))
            .map((v: DBVibrant, i: number) => {
              const fallback = defaultStageGallery()[i % 9];
              const broken = !v.image_url || v.image_url.startsWith('/images/');
              return {
                ...v,
                title: v.title || fallback.title,
                image_url: broken ? fallback.image_url : v.image_url,
                order_index: i,
              };
            })
        : defaultStageGallery();
      setVibrants(stageItems);
      setInitialVibrants(stageSeeded ? '[]' : JSON.stringify(stageItems));

      // Reset deletions tracking queue
      setDeletedUrls([]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to fetch settings data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress) {
      setTestEmailFeedback({ isSuccess: false, msg: 'Please enter a test email address.' });
      return;
    }
    setTestEmailSending(true);
    setTestEmailFeedback(null);

    try {
      const res = await fetch('/api/admin/test-smtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          testEmail: testEmailAddress,
          smtp_host: settings.smtp_host,
          smtp_port: settings.smtp_port,
          smtp_user: settings.smtp_user,
          smtp_pass: settings.smtp_pass,
          from_email: settings.from_email
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send test email.');
      }

      setTestEmailFeedback({ isSuccess: true, msg: data.message || 'Test email sent successfully!' });
    } catch (err: any) {
      setTestEmailFeedback({ isSuccess: false, msg: err.message || 'SMTP Connection Error' });
    } finally {
      setTestEmailSending(false);
    }
  };

  // Helper to determine if unsaved changes exist
  const hasChanges = () => {
    if (JSON.stringify(settings) !== settingsSnapshot) return true;
    if (adminUsername !== initialAdminUsername) return true;
    
    const currentImagesSerialized = JSON.stringify(images.map(img => ({
      id: img.id,
      category: img.category,
      image_url: img.image_url,
      order_index: img.order_index
    })));
    const cleanInitialImages = JSON.stringify(JSON.parse(initialImages || '[]').map((img: any) => ({
      id: img.id,
      category: img.category,
      image_url: img.image_url,
      order_index: img.order_index
    })));
    if (currentImagesSerialized !== cleanInitialImages) return true;

    const currentVideosSerialized = JSON.stringify(videos.map(vid => ({
      id: vid.id,
      video_url: vid.video_url,
      order_index: vid.order_index
    })));
    const cleanInitialVideos = JSON.stringify(JSON.parse(initialVideos || '[]').map((vid: any) => ({
      id: vid.id,
      video_url: vid.video_url,
      order_index: vid.order_index
    })));
    if (currentVideosSerialized !== cleanInitialVideos) return true;

    const currentServiceImagesSerialized = JSON.stringify(serviceImages.map(s => ({
      id: s.id,
      image_url: s.image_url
    })));
    const cleanInitialServiceImages = JSON.stringify(JSON.parse(initialServiceImages || '[]').map((s: any) => ({
      id: s.id,
      image_url: s.image_url
    })));
    if (currentServiceImagesSerialized !== cleanInitialServiceImages) return true;

    const currentVibrantsSerialized = JSON.stringify(vibrants.map(v => ({
      id: v.id,
      title: v.title,
      image_url: v.image_url,
      order_index: v.order_index
    })));
    const cleanInitialVibrants = JSON.stringify(JSON.parse(initialVibrants || '[]').map((v: any) => ({
      id: v.id,
      title: v.title,
      image_url: v.image_url,
      order_index: v.order_index
    })));
    if (currentVibrantsSerialized !== cleanInitialVibrants) return true;

    return false;
  };

  // Drag and Drop reordering logic helpers
  const reorderImages = (startIndex: number, endIndex: number) => {
    if (endIndex < 0) return;
    if (selectedGalleryCat === 'All Events') {
      if (endIndex >= images.length) return;
      const reordered = Array.from(images);
      const [removed] = reordered.splice(startIndex, 1);
      reordered.splice(endIndex, 0, removed);
      const updated = reordered.map((img, idx) => ({ ...img, order_index: idx }));
      setImages(updated);
      return;
    }

    // Reorder within one category without scrambling other categories' global indices
    const catSorted = images
      .filter((img) => img.category === selectedGalleryCat)
      .sort((a, b) => a.order_index - b.order_index);
    if (endIndex >= catSorted.length) return;

    const slotIndices = catSorted.map((img) => img.order_index);
    const reorderedCat = Array.from(catSorted);
    const [removed] = reorderedCat.splice(startIndex, 1);
    reorderedCat.splice(endIndex, 0, removed);
    const updatedCat = reorderedCat.map((img, idx) => ({
      ...img,
      order_index: slotIndices[idx],
    }));

    setImages(
      images.map((img) => {
        const next = updatedCat.find((u) => u.id === img.id);
        return next || img;
      })
    );
  };

  const reorderVideos = (startIndex: number, endIndex: number) => {
    if (endIndex < 0 || endIndex >= videos.length) return;
    const reordered = Array.from(videos);
    const [removed] = reordered.splice(startIndex, 1);
    reordered.splice(endIndex, 0, removed);
    const updated = reordered.map((vid, idx) => ({ ...vid, order_index: idx }));
    setVideos(updated);
  };

  const reorderVibrants = (startIndex: number, endIndex: number) => {
    if (endIndex < 0 || endIndex >= vibrants.length) return;
    const reordered = Array.from(vibrants);
    const [removed] = reordered.splice(startIndex, 1);
    reordered.splice(endIndex, 0, removed);
    const updated = reordered.map((v, idx) => ({ ...v, order_index: idx }));
    setVibrants(updated);
  };

  // Image category upload helpers
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    
    if (selectedGalleryCat === 'All Events') {
      alert('Please select a specific category (e.g. Weddings) to upload images.');
      return;
    }

    const catImages = images.filter(img => img.category === selectedGalleryCat);
    if (catImages.length >= 5) {
      alert(`Limit reached! Max 5 images in "${selectedGalleryCat}" category.`);
      return;
    }

    const localUrl = URL.createObjectURL(file);
    const newImage: DBImage = {
      id: Math.random().toString(36).substring(7),
      category: selectedGalleryCat,
      image_url: localUrl,
      order_index: catImages.length,
      isLocal: true,
      localFile: file
    };

    setImages([...images, newImage]);
  };

  const deleteImageItem = (imgToDelete: DBImage) => {
    if (window.confirm('Are you sure you want to remove this image?')) {
      if (!imgToDelete.isLocal) {
        setDeletedUrls(prev => [...prev, imgToDelete.image_url]);
      }
      const remaining = images.filter(img => img.id !== imgToDelete.id);
      const nonCat = remaining.filter(img => img.category !== imgToDelete.category);
      const cat = remaining.filter(img => img.category === imgToDelete.category)
                           .map((img, idx) => ({ ...img, order_index: idx }));
      setImages([...nonCat, ...cat]);
    }
  };

  // Stage Video upload helpers
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (videos.length >= 6) {
      alert('Upload limit reached! You can only have a maximum of 6 stage videos.');
      return;
    }

    const localUrl = URL.createObjectURL(file);
    const newVideo: DBVideo = {
      id: Math.random().toString(36).substring(7),
      title: file.name,
      video_url: localUrl,
      order_index: videos.length,
      isLocal: true,
      localFile: file
    };

    setVideos([...videos, newVideo]);
  };

  const deleteVideoItem = (vidToDelete: DBVideo) => {
    if (window.confirm('Are you sure you want to remove this video?')) {
      if (!vidToDelete.isLocal) {
        setDeletedUrls(prev => [...prev, vidToDelete.video_url]);
      }
      const remaining = videos.filter(vid => vid.id !== vidToDelete.id)
                            .map((vid, idx) => ({ ...vid, order_index: idx }));
      setVideos(remaining);
    }
  };

  const handleCategoryChange = (imageToEdit: DBImage, newCategory: string) => {
    const targetCount = images.filter(img => img.category === newCategory).length;
    if (targetCount >= 5) {
      alert(`Cannot change category: "${newCategory}" already has 5 images.`);
      return;
    }

    setImages(prev => prev.map(img => {
      if (img.id === imageToEdit.id) {
        const targetCatImages = prev.filter(i => i.category === newCategory);
        return {
          ...img,
          category: newCategory,
          order_index: targetCatImages.length
        };
      }
      return img;
    }));
    setEditingImageId(null);
  };

  // Service Image Replacer
  const triggerServiceImageChange = (serviceId: number) => {
    setActiveServiceIdToChange(serviceId);
    serviceInputRef.current?.click();
  };

  const handleServiceImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || activeServiceIdToChange === null) return;
    const file = files[0];
    
    const localUrl = URL.createObjectURL(file);
    setServiceImages(prev => prev.map(s => {
      if (s.id === activeServiceIdToChange) {
        return { ...s, image_url: localUrl, isLocal: true, localFile: file };
      }
      return s;
    }));
  };

  // Vibrants Slide Replacer
  const triggerVibrantImageChange = (vibrantId: string) => {
    setActiveVibrantIdToChange(vibrantId);
    vibrantInputRef.current?.click();
  };

  const handleVibrantImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || activeVibrantIdToChange === null) return;
    const file = files[0];

    const localUrl = URL.createObjectURL(file);
    setVibrants(prev => prev.map(v => {
      if (v.id === activeVibrantIdToChange) {
        return { ...v, image_url: localUrl, isLocal: true, localFile: file };
      }
      return v;
    }));
  };

  const handleVibrantTitleChange = (id: string, newTitle: string) => {
    setVibrants(prev => prev.map(v => {
      if (v.id === id) {
        return { ...v, title: newTitle };
      }
      return v;
    }));
  };

  const handleAddVibrantItem = () => {
    if (vibrants.length >= 9) {
      alert('Maximum 9 Stage Gallery images.');
      return;
    }
    const tempId = Math.random().toString(36).substring(7);
    const fallback = defaultStageGallery()[vibrants.length % 9];
    const newVibrant: DBVibrant = {
      id: tempId,
      title: 'New Stage',
      image_url: fallback.image_url,
      order_index: vibrants.length
    };
    setVibrants([...vibrants, newVibrant]);
  };

  const deleteVibrantItem = (vToDelete: DBVibrant) => {
    if (window.confirm('Are you sure you want to remove this vibrant slide?')) {
      if (!vToDelete.isLocal && !vToDelete.image_url.startsWith('/images/')) {
        setDeletedUrls(prev => [...prev, vToDelete.image_url]);
      }
      const remaining = vibrants.filter(v => v.id !== vToDelete.id)
                            .map((v, idx) => ({ ...v, order_index: idx }));
      setVibrants(remaining);
    }
  };

  // R2 file uploader via local route
  const uploadToBlob = async (file: File): Promise<string> => {
    const cleanFilename = encodeURIComponent(file.name.replace(/\s+/g, '_'));
    const response = await fetch(`/api/upload?filename=${cleanFilename}`, {
      method: 'POST',
      body: file,
      credentials: 'include',
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Cloudflare R2 upload failed.');
    }
    const data = await response.json();
    return data.url;
  };

  // Database Save
  const handleSaveAllChanges = async () => {
    if (!token) return;
    setShowConfirmModal(false);
    setSaveLoading(true);
    setErrorMsg(null);

    try {
      // Collect R2 deletes in a local array (avoid stale React state)
      const urlsToDelete = [...deletedUrls];

      // 1. Staged gallery uploads
      const processedImages = [];
      for (const img of images) {
        if (img.isLocal && img.localFile) {
          const publicUrl = await uploadToBlob(img.localFile);
          processedImages.push({
            id: img.id,
            category: img.category,
            image_url: publicUrl,
            order_index: img.order_index
          });
        } else {
          processedImages.push({
            id: img.id,
            category: img.category,
            image_url: img.image_url,
            order_index: img.order_index
          });
        }
      }

      // 2. Staged videos uploads
      const processedVideos = [];
      for (const vid of videos) {
        if (vid.isLocal && vid.localFile) {
          const publicUrl = await uploadToBlob(vid.localFile);
          processedVideos.push({
            id: vid.id,
            title: vid.title,
            video_url: publicUrl,
            order_index: vid.order_index
          });
        } else {
          processedVideos.push({
            id: vid.id,
            title: vid.title,
            video_url: vid.video_url,
            order_index: vid.order_index
          });
        }
      }

      // 3. Staged services uploads
      const processedServices = [];
      for (const s of serviceImages) {
        if (s.isLocal && s.localFile) {
          const publicUrl = await uploadToBlob(s.localFile);
          processedServices.push({
            id: s.id,
            service_title: s.service_title,
            image_url: publicUrl
          });
          const oldItem = JSON.parse(initialServiceImages || '[]').find(
            (item: { id: number; image_url?: string }) => item.id === s.id
          );
          if (oldItem?.image_url && !oldItem.image_url.startsWith('/images/') && oldItem.image_url.startsWith('http')) {
            urlsToDelete.push(oldItem.image_url);
          }
        } else {
          processedServices.push({
            id: s.id,
            service_title: s.service_title,
            image_url: s.image_url
          });
        }
      }

      // 4. Staged stage gallery uploads
      const processedVibrants = [];
      for (const v of vibrants) {
        if (v.isLocal && v.localFile) {
          const publicUrl = await uploadToBlob(v.localFile);
          processedVibrants.push({
            id: v.id,
            title: v.title,
            image_url: publicUrl,
            order_index: v.order_index
          });
          const oldItem = JSON.parse(initialVibrants || '[]').find(
            (item: { id: string; image_url?: string }) => item.id === v.id
          );
          if (oldItem?.image_url && !oldItem.image_url.startsWith('/images/') && oldItem.image_url.startsWith('http')) {
            urlsToDelete.push(oldItem.image_url);
          }
        } else {
          processedVibrants.push({
            id: v.id,
            title: v.title,
            image_url: v.image_url,
            order_index: v.order_index
          });
        }
      }

      // Save database and trigger cleanups — preserve array order as order_index
      const saveResponse = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          settings,
          images: processedImages
            .slice()
            .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
            .map((img, idx) => ({ ...img, order_index: idx })),
          videos: processedVideos
            .slice()
            .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
            .map((vid, idx) => ({ ...vid, order_index: idx })),
          serviceImages: processedServices,
          vibrants: processedVibrants
            .slice()
            .sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
            .map((v, idx) => ({ ...v, order_index: idx })),
          deletedUrls: urlsToDelete
        })
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.error || 'Failed to save admin configurations.');
      }

      await fetchData();
      setInitialAdminUsername(adminUsername);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving your changes.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSendCredsOtp = async () => {
    setCredsOtpSending(true);
    setCredsChangeError(null);
    setCredsOtpSuccessMsg(null);
    try {
      const res = await fetch('/api/admin/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send OTP email.');
      }
      setCredsOtpSuccessMsg(data.message || 'Verification code sent to your registered email.');
    } catch (err: any) {
      setCredsChangeError(err.message || 'SMTP Connection Error');
    } finally {
      setCredsOtpSending(false);
    }
  };

  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setCredsChangeError('New passwords do not match.');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      setCredsChangeError('Password must be at least 8 characters.');
      return;
    }
    setCredsChangeLoading(true);
    setCredsChangeError(null);
    try {
      const res = await fetch('/api/admin/change-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          otp: credsOtp,
          newUsername,
          newPassword
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update credentials.');
      }
      alert('Success! Credentials updated successfully.');
      if (data.user) login(null, data.user);
      setShowCredsModal(false);
      setCredsOtp('');
      setNewUsername('');
      setNewPassword('');
      setConfirmNewPassword('');
      setAdminUsername(data.user?.username || newUsername);
      setInitialAdminUsername(data.user?.username || newUsername);
      await fetchData();
    } catch (err: any) {
      setCredsChangeError(err.message);
    } finally {
      setCredsChangeLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-[#3A8FB8] animate-spin" />
        <p className="text-zinc-500 text-sm font-space-grotesk tracking-widest uppercase">Loading Panel Settings...</p>
      </div>
    );
  }

  const categoryImages = selectedGalleryCat === 'All Events' 
    ? [...images].sort((a, b) => a.order_index - b.order_index)
    : images.filter(img => img.category === selectedGalleryCat).sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="min-h-screen bg-black text-white font-space-grotesk flex flex-col md:flex-row select-none">
      
      {/* SUCCESS OVERLAY TOAST */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5 shadow-2xl backdrop-blur-md animate-fade-in max-w-[400px]">
          <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-emerald-400">Save Successful!</h4>
            <p className="text-xs text-zinc-300 mt-1 leading-normal">
              Changes successfully saved to Cloudflare R2! Changes are live immediately.
            </p>
          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-[450px] rounded-3xl border border-white/10 bg-zinc-950 p-8 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-5">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Save These Changes?</h3>
            <p className="text-sm text-zinc-450 leading-relaxed mb-6">
              Are you sure you want to save these changes? This will immediately update the database and display on the live website.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 h-12 rounded-xl bg-zinc-900 border border-white/10 text-white font-bold text-sm hover:bg-zinc-850 transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAllChanges}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#0a1524] to-[#3A8FB8] text-white font-bold text-sm hover:shadow-[0_0_15px_rgba(58,143,184,0.28)] transition duration-200 cursor-pointer"
              >
                Confirm Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVING STATE OVERLAY SCREEN */}
      {saveLoading && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-[#3A8FB8] animate-spin" />
          <h3 className="font-bold text-lg text-white">Saving Changes to Cloud...</h3>
          <p className="text-zinc-550 text-xs tracking-widest uppercase">Syncing media files & database tables</p>
        </div>
      )}

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden w-full h-16 border-b border-white/10 bg-zinc-950 flex items-center justify-between px-6 z-30">
        <span className="font-bold text-md tracking-wider">PARTH ADMIN</span>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-10 h-10 rounded-xl border border-white/10 bg-black/40 flex items-center justify-center hover:bg-zinc-900 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* SIDEBAR SIDE PANEL (Collapsible on mobile) */}
      <aside className={`
        fixed inset-y-0 left-0 w-[280px] border-r border-white/10 bg-zinc-950 flex flex-col justify-between p-6 z-40 transition-transform duration-300 md:translate-x-0 md:static md:h-screen
        ${sidebarOpen ? 'translate-x-0 pt-20 md:pt-6' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          <div className="hidden md:flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Parth Production Logo" 
              className="w-16 h-16 rounded-full border border-white/10 object-cover flex-shrink-0"
            />
            <div>
              <h2 className="font-bold text-sm tracking-wide text-white leading-none">ADMIN PANEL</h2>
              <span className="text-[10px] text-[#3A8FB8] font-bold tracking-widest uppercase mt-1 block">Parth Production</span>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('gallery');
                setSidebarOpen(false);
              }}
              className={`w-full h-12 px-4 rounded-xl flex items-center gap-3 text-sm font-bold tracking-wide transition duration-200 cursor-pointer
                ${activeTab === 'gallery' 
                  ? 'bg-[#3A8FB8]/10 border border-[#3A8FB8]/30 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <ImageIcon className="w-4 h-4" />
              Gallery
            </button>

            <button
              onClick={() => {
                setActiveTab('videos');
                setSidebarOpen(false);
              }}
              className={`w-full h-12 px-4 rounded-xl flex items-center gap-3 text-sm font-bold tracking-wide transition duration-200 cursor-pointer
                ${activeTab === 'videos' 
                  ? 'bg-[#3A8FB8]/10 border border-[#3A8FB8]/30 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <VideoIcon className="w-4 h-4" />
              Videos
            </button>

            <button
              onClick={() => {
                setActiveTab('services');
                setSidebarOpen(false);
              }}
              className={`w-full h-12 px-4 rounded-xl flex items-center gap-3 text-sm font-bold tracking-wide transition duration-200 cursor-pointer
                ${activeTab === 'services' 
                  ? 'bg-[#3A8FB8]/10 border border-[#3A8FB8]/30 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <FileImage className="w-4 h-4" />
              Services
            </button>

            <button
              onClick={() => {
                setActiveTab('vibrants');
                setSidebarOpen(false);
              }}
              className={`w-full h-12 px-4 rounded-xl flex items-center gap-3 text-sm font-bold tracking-wide transition duration-200 cursor-pointer
                ${activeTab === 'vibrants' 
                  ? 'bg-[#3A8FB8]/10 border border-[#3A8FB8]/30 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <Sparkles className="w-4 h-4" />
              Stage Gallery
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setSidebarOpen(false);
              }}
              className={`w-full h-12 px-4 rounded-xl flex items-center gap-3 text-sm font-bold tracking-wide transition duration-200 cursor-pointer
                ${activeTab === 'settings' 
                  ? 'bg-[#3A8FB8]/10 border border-[#3A8FB8]/30 text-white' 
                  : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <SettingsIcon className="w-4 h-4" />
              Site Settings
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-10 px-4 rounded-xl border border-white/10 hover:bg-white/5 flex items-center justify-between text-xs text-zinc-400 hover:text-white transition duration-200"
          >
            Visit Live Site
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to log out?')) {
                logout();
              }
            }}
            className="w-full h-12 px-4 rounded-xl border border-white/5 hover:border-red-500/20 hover:bg-red-500/10 text-zinc-450 hover:text-red-400 text-sm font-bold flex items-center gap-3 transition duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT DASHBOARD AREA */}
      <main className="flex-1 p-6 md:p-10 max-w-none w-full overflow-y-auto md:h-screen">
        
        {/* HEADER TOOLBAR BLOCK */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/10 pb-6 text-center md:text-left">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-wide text-white uppercase">
              {activeTab === 'gallery' && 'Gallery'}
              {activeTab === 'videos' && 'Videos'}
              {activeTab === 'services' && 'Services'}
              {activeTab === 'vibrants' && 'Stage Gallery'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p className="text-[10px] md:text-xs text-zinc-550 tracking-wider mt-1 uppercase">
              {activeTab === 'gallery' && 'Change all Gallery page images'}
              {activeTab === 'videos' && 'Change homepage videos (up to 6) and their order'}
              {activeTab === 'services' && 'Change Services page cover images'}
              {activeTab === 'vibrants' && 'Change Stage Gallery images on the homepage'}
              {activeTab === 'settings' && 'Update contact profiles & credentials'}
            </p>
          </div>

          <div className="flex justify-center md:justify-start">
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={!hasChanges()}
              className={`h-12 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center gap-2 shadow-lg transition duration-300 cursor-pointer
                ${hasChanges() 
                  ? 'bg-gradient-to-r from-[#0a1524] to-[#3A8FB8] text-white hover:shadow-[0_0_20px_rgba(58,143,184,0.28)] active:scale-98' 
                  : 'bg-zinc-900 border border-white/5 text-zinc-550 cursor-not-allowed'
                }
              `}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-8 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* -------------------- GALLERY TAB CONTENT -------------------- */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 p-1 rounded-2xl bg-zinc-950 border border-white/5 w-fit">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedGalleryCat(cat)}
                  className={`h-10 px-5 rounded-xl text-xs font-bold tracking-wide transition duration-200 cursor-pointer
                    ${selectedGalleryCat === cat 
                      ? 'bg-zinc-800 text-white' 
                      : 'text-zinc-400 hover:text-white'
                    }
                  `}
                >
                  {cat === 'All Events' ? `All Events (${images.length})` : `${cat} (${images.filter(img => img.category === cat).length}/5)`}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {categoryImages.map((image, idx) => (
                <div 
                  key={image.id}
                  className="relative group rounded-3xl overflow-hidden border border-white/10 bg-zinc-950/40 p-3 flex flex-col hover:border-[#3A8FB8]/30 transition duration-300"
                >
                  <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                    <img 
                      src={image.image_url} 
                      alt="Gallery Asset" 
                      className="w-full h-full object-cover brightness-[0.75]" 
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/60 border border-white/10 text-[10px] font-bold text-zinc-400 tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                      <span className="text-[#3A8FB8] font-extrabold uppercase">{image.category}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      <span>Index: {idx}</span>
                    </div>

                    {image.isLocal && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Staged
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 px-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteImageItem(image)}
                        className="w-10 h-10 rounded-xl border border-white/5 hover:border-red-500/20 hover:bg-red-500/10 flex items-center justify-center text-zinc-550 hover:text-red-400 transition cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {editingImageId === image.id ? (
                        <div className="flex items-center gap-1 relative z-10">
                          <select
                            value={image.category}
                            onChange={(e) => handleCategoryChange(image, e.target.value)}
                            className="h-10 px-2 rounded-xl border border-[#3A8FB8] bg-black text-[10px] font-bold text-white focus:outline-none cursor-pointer"
                          >
                            {CATEGORIES.filter(c => c !== 'All Events').map(c => (
                              <option key={c} value={c} className="bg-zinc-950 text-white">{c}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => setEditingImageId(null)}
                            className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditingImageId(image.id)}
                          className="px-3 h-10 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 hover:text-white transition duration-200 cursor-pointer"
                        >
                          Edit Category
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => reorderImages(idx, idx - 1)}
                        disabled={idx === 0}
                        className="w-10 h-10 rounded-xl border border-white/5 hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => reorderImages(idx, idx + 1)}
                        disabled={idx === categoryImages.length - 1}
                        className="w-10 h-10 rounded-xl border border-white/5 hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {selectedGalleryCat !== 'All Events' && categoryImages.length < 5 && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-3xl border border-dashed border-white/10 bg-zinc-950/20 hover:bg-zinc-950/40 hover:border-[#3A8FB8]/30 flex flex-col items-center justify-center gap-3 p-8 text-center transition duration-300 min-h-[220px] cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#3A8FB8]/30 group-hover:bg-[#3A8FB8]/5 transition duration-300">
                    <Plus className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-300 block mb-1">ADD CATEGORY PHOTO</span>
                    <p className="text-[10px] text-zinc-550 leading-relaxed uppercase">Supports formats (PNG, JPG, WEBP). Max 5 files per category.</p>
                  </div>
                </div>
              )}

              {selectedGalleryCat === 'All Events' && (
                <div className="rounded-3xl border border-dashed border-white/10 bg-zinc-950/5 flex flex-col items-center justify-center p-8 text-center min-h-[220px]">
                  <p className="text-xs text-zinc-500 leading-relaxed uppercase font-bold">
                    You are viewing "All Events". <br/>
                    Please switch to a specific category tab (e.g. Weddings) to upload a new image.
                  </p>
                </div>
              )}

              {selectedGalleryCat !== 'All Events' && categoryImages.length >= 5 && (
                <div className="rounded-3xl border border-white/5 bg-zinc-950/20 flex flex-col items-center justify-center gap-3 p-8 text-center min-h-[220px] opacity-40">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-650">
                    <FileImage className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 tracking-wider uppercase mb-1">Category Limit Reached</h4>
                    <p className="text-[10px] text-zinc-650">Max limit of 5 photos is active for {selectedGalleryCat}</p>
                  </div>
                </div>
              )}

              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* -------------------- VIDEOS TAB CONTENT -------------------- */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-2xl border border-[#3A8FB8]/20 bg-[#3A8FB8]/5 p-4 text-xs text-zinc-300 leading-normal">
              <AlertCircle className="w-4 h-4 text-[#3A8FB8] mt-0.5 flex-shrink-0" />
              <span>
                <strong>How it works:</strong> Reorder with the arrows, then click <strong>Save Changes</strong>.
                The homepage video section updates immediately after save. Use vertical MP4s under 25 seconds (9:16).
              </span>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videos.map((vid, idx) => (
                <div 
                  key={vid.id}
                  className="relative group rounded-3xl overflow-hidden border border-white/10 bg-zinc-950/40 p-3 flex flex-col hover:border-[#3A8FB8]/30 transition duration-300"
                >
                  <div className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                    <video 
                      src={vid.video_url.startsWith('/videos/') ? `https://assets.parthproduction.in${vid.video_url}` : vid.video_url} 
                      muted 
                      loop
                      playsInline
                      autoPlay
                      preload="none"
                      className="w-full h-full object-cover brightness-[0.7]" 
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/60 border border-white/10 text-[10px] font-bold text-zinc-400 tracking-wider">
                      Index: {idx}
                    </div>

                    {vid.isLocal && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Staged
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-4 px-1">
                    <button
                      onClick={() => deleteVideoItem(vid)}
                      className="w-10 h-10 rounded-xl border border-white/5 hover:border-red-500/20 hover:bg-red-500/10 flex items-center justify-center text-zinc-550 hover:text-red-400 transition cursor-pointer"
                      title="Remove video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => reorderVideos(idx, idx - 1)}
                        disabled={idx === 0}
                        className="w-10 h-10 rounded-xl border border-white/5 hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => reorderVideos(idx, idx + 1)}
                        disabled={idx === videos.length - 1}
                        className="w-10 h-10 rounded-xl border border-white/5 hover:bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {videos.length < 6 ? (
                <div 
                  onClick={() => videoInputRef.current?.click()}
                  className="rounded-3xl border border-dashed border-white/10 bg-zinc-950/20 hover:bg-zinc-950/40 hover:border-[#3A8FB8]/30 flex flex-col items-center justify-center gap-3 p-8 text-center transition duration-300 min-h-[320px] cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#3A8FB8]/30 group-hover:bg-[#3A8FB8]/5 transition duration-300">
                    <Plus className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-300 tracking-wider uppercase mb-1">Add Stage Video</h4>
                    <p className="text-[10px] text-zinc-550 max-w-[200px] leading-relaxed mx-auto">
                      Supports MP4 format. Max total limit 6 videos.
                    </p>
                  </div>
                  <input 
                    type="file"
                    ref={videoInputRef}
                    onChange={handleVideoFileChange}
                    accept="video/mp4"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="rounded-3xl border border-white/5 bg-zinc-950/20 flex flex-col items-center justify-center gap-3 p-8 text-center min-h-[320px] opacity-40">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-650">
                    <FileVideo className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 tracking-wider uppercase mb-1">Total Limit Reached</h4>
                    <p className="text-[10px] text-zinc-650">Max limit of 6 stage videos is active.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------- SERVICES TAB CONTENT -------------------- */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-2xl border border-[#3A8FB8]/20 bg-[#3A8FB8]/5 p-4 text-xs text-zinc-300 leading-normal">
              <AlertCircle className="w-4 h-4 text-[#3A8FB8] mt-0.5 flex-shrink-0" />
              <span>
                Replace cover images for each service on the Services page. Click <strong>Save Changes</strong> after
                replacing so the live site updates.
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {serviceImages.map((service) => (
                <div 
                  key={service.id}
                  className="rounded-3xl border border-white/10 bg-zinc-950/40 p-4 flex flex-col hover:border-[#3A8FB8]/30 transition duration-300"
                >
                  <div className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-black mb-4">
                    <img 
                      src={service.image_url} 
                      alt={service.service_title} 
                      className="w-full h-full object-cover" 
                    />
                    {service.isLocal && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Staged
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm tracking-wide text-white uppercase mb-1">
                        {service.service_title}
                      </h4>
                      <p className="text-[10px] text-zinc-550 uppercase tracking-widest font-bold font-space-grotesk">Service Cover image</p>
                    </div>
                    <button
                      onClick={() => triggerServiceImageChange(service.id)}
                      className="mt-6 w-full h-11 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      Replace Image
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <input 
              type="file"
              ref={serviceInputRef}
              onChange={handleServiceImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* -------------------- VIBRANTS CAROUSEL TAB CONTENT -------------------- */}
        {activeTab === 'vibrants' && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 rounded-2xl border border-[#3A8FB8]/20 bg-[#3A8FB8]/5 p-4 text-xs text-zinc-300 leading-normal">
              <AlertCircle className="w-4 h-4 text-[#3A8FB8] mt-0.5 flex-shrink-0" />
              <span>
                These images power the homepage <strong>Stage Gallery</strong> curve. Change order or replace images,
                then Save Changes to update the live site.
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <span className="text-sm font-bold text-zinc-400">
                Stage images: <span className="text-white">{vibrants.length}/9</span>
              </span>
              <button
                onClick={handleAddVibrantItem}
                disabled={vibrants.length >= 9}
                className={`h-10 px-4 rounded-xl text-xs font-bold tracking-wide flex items-center gap-1.5 transition duration-200 cursor-pointer
                  ${vibrants.length < 9 
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-white' 
                    : 'bg-zinc-900 text-zinc-650 cursor-not-allowed'
                  }
                `}
              >
                <Plus className="w-4 h-4" />
                Add Stage Image
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {vibrants.map((v, idx) => (
                <div 
                  key={v.id}
                  className="rounded-3xl border border-white/10 bg-zinc-950/40 p-4 flex flex-col hover:border-[#3A8FB8]/30 transition duration-300"
                >
                  <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-black mb-4">
                    <img 
                      src={v.image_url} 
                      alt={v.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/60 border border-white/10 text-[10px] font-bold text-zinc-450 backdrop-blur-md">
                      Index: {idx}
                    </div>
                    {v.isLocal && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Staged
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold tracking-wider text-zinc-550 uppercase mb-1.5">
                          Slide Title Text
                        </label>
                        <input
                          type="text"
                          value={v.title}
                          onChange={(e) => handleVibrantTitleChange(v.id, e.target.value.toUpperCase())}
                          className="w-full h-10 px-3 rounded-lg border border-white/10 bg-black/40 text-xs font-bold text-white focus:border-[#3A8FB8] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteVibrantItem(v)}
                          className="w-10 h-10 rounded-xl border border-white/5 hover:border-red-500/20 hover:bg-red-500/10 flex items-center justify-center text-zinc-550 hover:text-red-400 transition cursor-pointer"
                          title="Remove slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => triggerVibrantImageChange(v.id)}
                          className="px-3 h-10 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-400 hover:text-white transition duration-200 cursor-pointer"
                        >
                          Replace Photo
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => reorderVibrants(idx, idx - 1)}
                          disabled={idx === 0}
                          className="w-10 h-10 rounded-xl border border-white/5 hover:bg-white/5 flex items-center justify-center text-zinc-405 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => reorderVibrants(idx, idx + 1)}
                          disabled={idx === vibrants.length - 1}
                          className="w-10 h-10 rounded-xl border border-white/5 hover:bg-white/5 flex items-center justify-center text-zinc-405 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <input 
              type="file"
              ref={vibrantInputRef}
              onChange={handleVibrantImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        )}

        {/* -------------------- SITE SETTINGS TAB CONTENT -------------------- */}
        {activeTab === 'settings' && (
          <div className="max-w-[600px] rounded-3xl border border-white/10 bg-zinc-950/40 p-6 md:p-8 shadow-xl">
            <h3 className="font-bold text-md text-white mb-6 uppercase tracking-wider">Contact & Profile Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">
                  Email
                </label>
                <input 
                  type="email"
                  placeholder="contact@parthproduction.in"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-black/40 text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#3A8FB8] focus:outline-none transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">
                  WhatsApp Number
                </label>
                <input 
                  type="text"
                  placeholder="9537330003"
                  value={settings.phone_1}
                  onChange={(e) => setSettings({ ...settings, phone_1: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-black/40 text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#3A8FB8] focus:outline-none transition-colors duration-200"
                />
                <span className="text-[10px] text-zinc-500 leading-normal block mt-2">
                  * Constructed link: <strong>https://wa.me/91[Number]</strong>. Do not write country code +91.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">
                  Secondary Number
                </label>
                <input 
                  type="text"
                  placeholder="8866655651"
                  value={settings.phone_2}
                  onChange={(e) => setSettings({ ...settings, phone_2: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-black/40 text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#3A8FB8] focus:outline-none transition-colors duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">
                  Address
                </label>
                <textarea 
                  rows={3}
                  placeholder="Gaurav Path Road, Palanpur, Surat, Gujarat"
                  value={settings.address || ''}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-black/40 text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#3A8FB8] focus:outline-none transition-colors duration-200 resize-none"
                />
              </div>

              {/* SMTP / EMAIL SETTINGS CARD */}
              <div className="pt-6 border-t border-white/10">
                <div className="rounded-3xl border border-white/10 bg-[#0d0f19] p-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-zinc-300 flex-shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white">SMTP / Email Settings</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Configure outgoing email for notifications, welcome emails, etc.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">SMTP Host</label>
                      <input 
                        type="text" 
                        placeholder="smtp-relay.brevo.com"
                        value={settings.smtp_host || ''}
                        onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#161926] text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">Port</label>
                      <input 
                        type="text" 
                        placeholder="587"
                        value={settings.smtp_port || ''}
                        onChange={(e) => setSettings({ ...settings, smtp_port: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#161926] text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">SMTP Username</label>
                      <input 
                        type="text" 
                        placeholder="a11152001@smtp-brevo.com"
                        value={settings.smtp_user || ''}
                        onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#161926] text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">SMTP Password</label>
                      <input 
                        type="password" 
                        placeholder="•••••••• (leave blank to keep)"
                        value={settings.smtp_pass || ''}
                        onChange={(e) => setSettings({ ...settings, smtp_pass: e.target.value })}
                        autoComplete="new-password"
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#161926] text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1.5">From Email</label>
                      <input 
                        type="email" 
                        placeholder="parthproductionweb@gmail.com"
                        value={settings.from_email || ''}
                        onChange={(e) => setSettings({ ...settings, from_email: e.target.value })}
                        className="w-full h-11 px-4 rounded-xl border border-white/10 bg-[#161926] text-sm text-white placeholder-zinc-600 focus:border-blue-500 focus:outline-none transition"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setShowConfirmModal(true)}
                        disabled={saveLoading}
                        className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition duration-200 cursor-pointer disabled:opacity-50 shadow-md"
                      >
                        {saveLoading ? 'Saving...' : 'Save SMTP'}
                      </button>
                    </div>

                    <div className="pt-5 border-t border-white/5 space-y-3">
                      <label className="block text-xs font-medium text-zinc-300">Send Test Email</label>
                      
                      {testEmailFeedback && (
                        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${testEmailFeedback.isSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{testEmailFeedback.msg}</span>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <input 
                          type="email" 
                          placeholder="test@example.com"
                          value={testEmailAddress}
                          onChange={(e) => setTestEmailAddress(e.target.value)}
                          className="flex-1 h-11 px-4 rounded-xl border border-white/10 bg-[#161926] text-sm text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none transition"
                        />
                        <button
                          type="button"
                          onClick={handleSendTestEmail}
                          disabled={testEmailSending}
                          className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-2 transition duration-200 cursor-pointer disabled:opacity-50 shadow-md"
                        >
                          {testEmailSending ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5" />
                              <span>Test</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ADMIN CREDENTIALS SECTION */}
              <div className="pt-6 border-t border-white/10 space-y-6">
                <h4 className="font-bold text-sm text-white uppercase tracking-wider">Console Credentials</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Username</span>
                    <span className="text-sm text-white font-medium block">{adminUsername}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Password</span>
                    <span className="text-sm text-white font-medium block">••••••••</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-black/20 p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold text-zinc-550 uppercase tracking-widest block">Credential Resets</span>
                      <span className="text-xs text-zinc-350 mt-1 block">Status: <strong className="text-emerald-400 font-bold">Unlimited ♾️</strong></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCredsModal(true);
                        setCredsChangeError(null);
                        setCredsOtpSuccessMsg(null);
                        setCredsOtp('');
                        setNewUsername('');
                        setNewPassword('');
                        setConfirmNewPassword('');
                        setShowNewPass(false);
                      }}
                      className="h-10 px-5 rounded-xl bg-[#3A8FB8]/10 border border-[#3A8FB8]/30 text-xs font-bold text-[#3A8FB8] hover:bg-[#3A8FB8]/20 transition duration-200 cursor-pointer"
                    >
                      Change Username & Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* CREDENTIALS UPDATE MODAL */}
      {showCredsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm select-none">
          <div className="relative w-full max-w-[420px] rounded-3xl border border-white/10 bg-zinc-950 p-6 md:p-8 shadow-2xl space-y-6">
            <button 
              type="button"
              onClick={() => setShowCredsModal(false)}
              className="absolute right-6 top-6 w-8 h-8 rounded-full border border-white/5 hover:border-white/20 bg-black/20 flex items-center justify-center hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-zinc-400 hover:text-white" />
            </button>

            <div className="space-y-2 pr-8">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Change Credentials</h3>
              <p className="text-xs text-zinc-450 leading-relaxed">Send a 6-digit OTP code to your configured SMTP email address to verify your identity and update your login details.</p>
            </div>

            {credsOtpSuccessMsg && (
              <div className="flex items-start gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-400">
                <CheckCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{credsOtpSuccessMsg}</p>
              </div>
            )}

            {credsChangeError && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
                <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
                <p className="leading-relaxed">{credsChangeError}</p>
              </div>
            )}

            <form onSubmit={handleChangeCredentials} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase">6-Digit OTP Code</label>
                  <button
                    type="button"
                    onClick={handleSendCredsOtp}
                    disabled={credsOtpSending}
                    className="text-[11px] font-bold text-[#3A8FB8] hover:text-[#A78BFA] transition cursor-pointer disabled:opacity-40"
                  >
                    {credsOtpSending ? 'Sending OTP...' : 'Send OTP to Email'}
                  </button>
                </div>
                <input 
                  type="text" 
                  required 
                  maxLength={12}
                  placeholder="Enter code from email" 
                  value={credsOtp} 
                  onChange={(e) => setCredsOtp(e.target.value)} 
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-black/40 text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#3A8FB8] focus:outline-none tracking-widest text-center font-bold transition duration-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">New Username</label>
                <input 
                  type="text" 
                  required 
                  placeholder="admin" 
                  value={newUsername} 
                  onChange={(e) => setNewUsername(e.target.value)} 
                  className="w-full h-12 px-4 rounded-xl border border-white/10 bg-black/40 text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#3A8FB8] focus:outline-none transition duration-200"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPass ? 'text' : 'password'} 
                    required 
                    placeholder="••••••••••••" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    className="w-full h-12 pl-4 pr-11 rounded-xl border border-white/10 bg-black/40 text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#3A8FB8] focus:outline-none transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showNewPass ? 'text' : 'password'} 
                    required 
                    placeholder="••••••••••••" 
                    value={confirmNewPassword} 
                    onChange={(e) => setConfirmNewPassword(e.target.value)} 
                    className="w-full h-12 pl-4 pr-11 rounded-xl border border-white/10 bg-black/40 text-base md:text-sm text-white placeholder-zinc-650 focus:border-[#3A8FB8] focus:outline-none transition duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={credsChangeLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0a1524] to-[#3A8FB8] text-xs font-bold text-white flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition duration-250 cursor-pointer disabled:opacity-40"
              >
                {credsChangeLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Verify OTP & Save Logins
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
