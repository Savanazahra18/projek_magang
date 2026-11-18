'use client'

import { useState, useEffect } from 'react'
import AssessmentOverview, { AssessmentCategory, assessmentCategories } from '@/components/AssessmentOverview'
import AssessmentCategoryList from '@/components/assessment/AssessmentCategoryList'
import AssessmentJembatanForm from '@/components/assessment/AssessmentJembatanForm'
import AssessmentMasjidForm from '@/components/assessment/AssessmentMasjidForm'
import AssessmentSekolahForm from '@/components/assessment/AssessmentSekolahForm'
import AssessmentPohonForm from '@/components/assessment/AssessmentPohonForm'
import AssessmentUmkmForm from '@/components/assessment/AssessmentUmkmForm'
import AssessmentPetaniForm from '@/components/assessment/AssessmentPetaniForm'
import RequestProgramForm2 from '@/components/RequestProgramForm2'
import { useDashboard } from '@/context/DashboardContext'
import { Icon } from '@/components/common/Icons'

export default function AssessmentPage() {
  const { notify, setSubCrumbs } = useDashboard()
  const [selectedCategory, setSelectedCategory] = useState<AssessmentCategory | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list')

  // Membaca query param ?category=pohon atau ?type=pohon jika ada di URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const catId = params.get('type') || params.get('category')
      const modeParam = params.get('mode')
      if (catId) {
        const found = assessmentCategories.find((c) => c.id === catId)
        if (found) {
          setSelectedCategory(found)
          setViewMode(modeParam === 'form' ? 'form' : 'list')
        }
      }
    }
  }, [])

  useEffect(() => {
    if (!selectedCategory) {
      setSubCrumbs([])
    } else if (viewMode === 'list') {
      setSubCrumbs([`Daftar ${selectedCategory.title}`])
    } else {
      setSubCrumbs([`Daftar ${selectedCategory.title}`, `Form ${selectedCategory.title}`])
    }
  }, [selectedCategory, viewMode, setSubCrumbs])

  const handleSelectCategory = (cat: AssessmentCategory) => {
    setSelectedCategory(cat)
    setViewMode('list')
    notify(`Menampilkan daftar ${cat.title} (${cat.tag}).`)
  }

  const handleBackToOverview = () => {
    setSelectedCategory(null)
    setViewMode('list')
  }

  const handleBackToCategoryList = () => {
    setViewMode('list')
  }

  // Tahap 1: Jika belum memilih kategori, tampilkan 6 kartu kategori assessment
  if (!selectedCategory) {
    return <AssessmentOverview onSelectCategory={handleSelectCategory} />
  }

  // Tahap 2: Ketika kategori dipilih dan belum masuk ke form, tampilkan daftar assessment kategori tersebut terlebih dahulu
  if (viewMode === 'list') {
    return (
      <AssessmentCategoryList
        category={selectedCategory}
        onBackToOverview={handleBackToOverview}
        onCreateNew={() => setViewMode('form')}
        notify={notify}
      />
    )
  }

  // Tahap 3: Halaman Formulir Pengisian masing-masing kategori assessment
  if (selectedCategory.id === 'pohon') {
    return (
      <AssessmentPohonForm
        onBack={handleBackToCategoryList}
        onSubmitSuccess={(data) => {
          setViewMode('list')
          notify(`Assessment "${data.title}" berhasil disimpan ke database!`)
        }}
        notify={notify}
      />
    )
  }

  if (selectedCategory.id === 'umkm') {
    return (
      <AssessmentUmkmForm
        onBack={handleBackToCategoryList}
        onSubmitSuccess={(data) => {
          setViewMode('list')
          notify(`Assessment "${data.title}" berhasil disimpan ke database!`)
        }}
        notify={notify}
      />
    )
  }

  if (selectedCategory.id === 'petani') {
    return (
      <AssessmentPetaniForm
        onBack={handleBackToCategoryList}
        onSubmitSuccess={(data) => {
          setViewMode('list')
          notify(`Assessment "${data.title}" berhasil disimpan ke database!`)
        }}
        notify={notify}
      />
    )
  }

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <div className="asm-form-nav">
        <button
          type="button"
          className="asm-back-btn"
          onClick={handleBackToCategoryList}
        >
          <Icon name="back" size={16} />
          <span>Kembali ke daftar {selectedCategory.title}</span>
        </button>
      </div>

      {selectedCategory.id === 'jembatan' ? (
        <AssessmentJembatanForm
          onBack={handleBackToCategoryList}
          onSubmitSuccess={(data) => {
            setViewMode('list')
            notify(`Assessment "${data.title}" berhasil disimpan ke database!`)
          }}
          notify={notify}
        />
      ) : selectedCategory.id === 'masjid' ? (
        <AssessmentMasjidForm
          onBack={handleBackToCategoryList}
          onSubmitSuccess={(data) => {
            setViewMode('list')
            notify(`Assessment "${data.title}" berhasil disimpan ke database!`)
          }}
          notify={notify}
        />
      ) : selectedCategory.id === 'sekolah' ? (
        <AssessmentSekolahForm
          onBack={handleBackToCategoryList}
          onSubmitSuccess={(data) => {
            setViewMode('list')
            notify(`Assessment "${data.title}" berhasil disimpan ke database!`)
          }}
          notify={notify}
        />
      ) : (
        <RequestProgramForm2
          onBack={handleBackToCategoryList}
          onSubmitSuccess={() => {
            setViewMode('list')
            notify(`Assessment "${selectedCategory.title}" berhasil disimpan ke database!`)
          }}
          notify={notify}
        />
      )}
    </div>
  )
}
