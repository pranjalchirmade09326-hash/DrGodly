'use client';

import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  SlidersHorizontal,
  X
} from 'lucide-react';
import { DoctorFilterSidebar, DoctorFilterState } from './components/DoctorFilterSidebar';
import { DoctorSearchResultCard, DoctorProfileSummary } from './components/DoctorSearchResultCard';
import { DoctorSearchPagination } from './components/DoctorSearchPagination';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { GlobalFooter } from '@/components/layout/GlobalFooter';

const MOCK_DOCTORS: DoctorProfileSummary[] = [
  {
    id: 'doc-001',
    name: 'Dr. Arjun Mehta',
    degrees: 'MD, DM (Cardiology), FACC',
    specialty: 'Cardiology',
    subSpecialty: 'Interventional Cardiology & Heart Failure',
    experienceYears: 16,
    consultationFee: 800,
    rating: 4.9,
    reviewCount: 342,
    hospitalAffiliation: 'Apollo Super Specialty Hospital',
    location: 'Sarita Vihar, New Delhi',
    nmcRegistrationNumber: 'NMC-78291-DL',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    nextAvailableSlot: 'Today, 04:30 PM',
    isAvailableToday: true,
    acceptsABDM: true,
    availableSlots: [
      { id: 's1', time: '10:00 AM', period: 'morning', available: true },
      { id: 's2', time: '11:30 AM', period: 'morning', available: true },
      { id: 's3', time: '02:00 PM', period: 'afternoon', available: true },
      { id: 's4', time: '04:30 PM', period: 'afternoon', available: true },
      { id: 's5', time: '06:00 PM', period: 'evening', available: true },
      { id: 's6', time: '07:30 PM', period: 'evening', available: false },
    ],
  },
  {
    id: 'doc-002',
    name: 'Dr. Priya Sharma',
    degrees: 'MD (Internal Medicine), DNB',
    specialty: 'Internal Medicine',
    subSpecialty: 'Diabetology & Metabolic Health',
    experienceYears: 12,
    consultationFee: 600,
    rating: 4.8,
    reviewCount: 219,
    hospitalAffiliation: 'Max Super Specialty Hospital',
    location: 'Saket, New Delhi',
    nmcRegistrationNumber: 'NMC-61942-DL',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    nextAvailableSlot: 'Today, 05:00 PM',
    isAvailableToday: true,
    acceptsABDM: true,
    availableSlots: [
      { id: 's7', time: '09:30 AM', period: 'morning', available: true },
      { id: 's8', time: '11:00 AM', period: 'morning', available: false },
      { id: 's9', time: '03:15 PM', period: 'afternoon', available: true },
      { id: 's10', time: '05:00 PM', period: 'afternoon', available: true },
      { id: 's11', time: '06:45 PM', period: 'evening', available: true },
    ],
  },
  {
    id: 'doc-003',
    name: 'Dr. Rajesh Deshmukh',
    degrees: 'MCh (Neurology), AIIMS Gold Medalist',
    specialty: 'Neurology',
    subSpecialty: 'Stroke & Headache Medicine',
    experienceYears: 20,
    consultationFee: 1200,
    rating: 4.95,
    reviewCount: 488,
    hospitalAffiliation: 'Fortis Memorial Research Institute',
    location: 'Gurugram, Haryana',
    nmcRegistrationNumber: 'NMC-43098-HR',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    nextAvailableSlot: 'Tomorrow, 10:30 AM',
    isAvailableToday: false,
    acceptsABDM: true,
    availableSlots: [
      { id: 's12', time: '10:30 AM', period: 'morning', available: true },
      { id: 's13', time: '12:00 PM', period: 'afternoon', available: true },
      { id: 's14', time: '04:00 PM', period: 'afternoon', available: true },
      { id: 's15', time: '07:00 PM', period: 'evening', available: true },
    ],
  },
  {
    id: 'doc-004',
    name: 'Dr. Ananya Roy',
    degrees: 'MD (Pediatrics), DCH',
    specialty: 'Pediatrics',
    subSpecialty: 'Child Nutrition & Developmental Pediatrics',
    experienceYears: 9,
    consultationFee: 500,
    rating: 4.85,
    reviewCount: 167,
    hospitalAffiliation: 'Rainbow Children’s Hospital',
    location: 'Malviya Nagar, New Delhi',
    nmcRegistrationNumber: 'NMC-89021-DL',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813583-79282302e1c9?auto=format&fit=crop&w=400&q=80',
    nextAvailableSlot: 'Today, 06:15 PM',
    isAvailableToday: true,
    acceptsABDM: true,
    availableSlots: [
      { id: 's16', time: '10:00 AM', period: 'morning', available: false },
      { id: 's17', time: '02:30 PM', period: 'afternoon', available: true },
      { id: 's18', time: '06:15 PM', period: 'evening', available: true },
    ],
  },
  {
    id: 'doc-005',
    name: 'Dr. Vikramaditya Rathore',
    degrees: 'MS (Orthopedics), Fellowship Joint Replacement',
    specialty: 'Orthopedics',
    subSpecialty: 'Knee & Hip Arthroplasty',
    experienceYears: 18,
    consultationFee: 900,
    rating: 4.9,
    reviewCount: 312,
    hospitalAffiliation: 'Medanta - The Medicity',
    location: 'Gurugram, Haryana',
    nmcRegistrationNumber: 'NMC-55109-HR',
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80',
    nmcRegistrationNumber: 'NMC-51204-HR',
    nextAvailableSlot: 'Today, 03:00 PM',
    isAvailableToday: true,
    acceptsABDM: true,
    availableSlots: [
      { id: 's19', time: '11:00 AM', period: 'morning', available: true },
      { id: 's20', time: '03:00 PM', period: 'afternoon', available: true },
      { id: 's21', time: '05:30 PM', period: 'evening', available: true },
    ],
  },
];

const INITIAL_FILTERS: DoctorFilterState = {
  specialties: [],
  consultationMode: 'all',
  maxFee: 3000,
  minExperience: 0,
  availableTodayOnly: false,
};

export const DoctorSearchMarketplace: React.FC = () => {
  const [filters, setFilters] = useState<DoctorFilterState>(INITIAL_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [bookingToast, setBookingToast] = useState<{ doctorName: string; slotTime: string } | null>(null);

  // Filter Logic
  const filteredDoctors = useMemo(() => {
    return MOCK_DOCTORS.filter((doc) => {
      // Query search
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(q);
        const matchesSpec = doc.specialty.toLowerCase().includes(q);
        const matchesSub = doc.subSpecialty?.toLowerCase().includes(q);
        if (!matchesName && !matchesSpec && !matchesSub) return false;
      }

      // Specialty filter
      if (filters.specialties.length > 0 && !filters.specialties.includes(doc.specialty)) {
        return false;
      }

      // Max fee filter
      if (doc.consultationFee > filters.maxFee) {
        return false;
      }

      // Min experience filter
      if (doc.experienceYears < filters.minExperience) {
        return false;
      }

      // Available Today Only filter
      if (filters.availableTodayOnly && !doc.isAvailableToday) {
        return false;
      }

      return true;
    });
  }, [filters, searchQuery]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / pageSize));
  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDoctors.slice(start, start + pageSize);
  }, [filteredDoctors, currentPage, pageSize]);

  const handleBookSlot = (doctorId: string, selectedSlotId?: string) => {
    const doc = MOCK_DOCTORS.find((d) => d.id === doctorId);
    if (!doc) return;
    const slot = doc.availableSlots.find((s) => s.id === selectedSlotId);
    const time = slot ? `${slot.time} (${slot.period})` : 'Next Available Slot';
    setBookingToast({ doctorName: doc.name, slotTime: time });
    setTimeout(() => setBookingToast(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Universal Global Header */}
      <GlobalHeader
        currentRole="patient"
        userName="Aarav Sharma"
        userRoleTitle="Patient • ABHA #91-2839-4019"
        onSearch={(q) => setSearchQuery(q)}
      />

      {/* Booking Toast Alert */}
      {bookingToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-5 py-3.5 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Consultation Slot Reserved!</p>
            <p className="text-emerald-200">
              Reserved with <strong>{bookingToast.doctorName}</strong> for <strong>{bookingToast.slotTime}</strong>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setBookingToast(null)}
            className="p-1 hover:bg-emerald-800 rounded-lg text-emerald-300 ml-2"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Hero Title & Breadcrumb Banner */}
      <div className="bg-white border-b border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>Home</span>
              <span>/</span>
              <span>Specialist Discovery</span>
              <span>/</span>
              <span className="text-blue-600 font-bold">Verified Clinicians</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Find & Book Top Doctors</span>
              <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                Component Architecture Demo
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Board-certified specialists verified via National Medical Commission (NMC). Instant 1080p WebRTC consultations & Jan Aushadhi generic prescribing.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-400 block">Total Specialists</span>
              <span className="text-base font-extrabold text-slate-900">{MOCK_DOCTORS.length}</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-xs font-bold text-emerald-600 block">Available Today</span>
              <span className="text-base font-extrabold text-emerald-800">
                {MOCK_DOCTORS.filter((d) => d.isAvailableToday).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Workspace (Left Sidebar + Right Result Cards) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left Sticky Filter Sidebar */}
          <DoctorFilterSidebar
            filters={filters}
            totalResults={filteredDoctors.length}
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setCurrentPage(1);
            }}
            onReset={() => {
              setFilters(INITIAL_FILTERS);
              setSearchQuery('');
              setCurrentPage(1);
            }}
          />

          {/* Right Results Column */}
          <div className="flex-1 w-full flex flex-col gap-5">
            {/* Search Bar & Results Summary Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="relative w-full sm:w-80">
                <Search size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by name or specialty..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="text-xs font-bold text-slate-600">
                Showing <strong className="text-blue-700">{filteredDoctors.length}</strong> matching doctors
              </div>
            </div>

            {/* Doctor Cards Loop */}
            {filteredDoctors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-base font-bold text-slate-900">No Specialists Match Your Filters</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Try widening your price range slider, removing specialty filters, or enabling all consultation modes.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilters(INITIAL_FILTERS);
                    setSearchQuery('');
                  }}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {paginatedDoctors.map((doctor) => (
                  <DoctorSearchResultCard
                    key={doctor.id}
                    doctor={doctor}
                    onBookConsultation={handleBookSlot}
                    onViewProfile={(id) => alert(`Opening medical dossier for doctor ${id}`)}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {filteredDoctors.length > 0 && (
              <DoctorSearchPagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredDoctors.length}
                onPageChange={(page) => setCurrentPage(page)}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            )}
          </div>
        </div>
      </main>

      {/* Universal Global Footer */}
      <GlobalFooter />
    </div>
  );
};
