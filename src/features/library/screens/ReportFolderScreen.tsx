import React, { useState, useEffect } from 'react'
import { View, Text, Alert, Pressable, FlatList } from 'react-native'
import CustomLoader from '@/components/CustomLoader'
import BackButton from '../../../components/BackButton'
import AssessmentReportCardWithSetting from '../components/AssessmentReportCardWithSetting'
import FloatingActionBar from '../components/FloatingActionBar'
import CreateFolderProvider, { useCreateFolder } from '../hooks/CreateFolderModalContext'
import EditReportTitleModal from '../components/EditReportTitleModal'
import DeleteReportModal from '../components/DeleteReportModal'
import { getImagesByFolder } from '../../../../api/folder'
import { useRefreshListener } from '../../../contexts/RefreshContext'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { DeviceEventEmitter } from 'react-native'
import { useReportActions } from '../../analysis/hooks/userReportActions'
import { FileSearchCorner } from 'lucide-react-native'
import { useToast } from '../../../contexts/ToastContext';

// Bounding box = [x1, y1, x2, y2]
export type BBox = [number, number, number, number]

export interface ThyrocyteDetection {
  bbox: BBox
  status?: 'Adequate' | 'Inadequate' | 'Isolated'
  confidence: number
  
}

export interface ClusterDetection {
  bbox: BBox
  status: "Adequate" | "Inadequate" | string
  num_thyrocytes: number
}

export interface DetectionResult {
  clusters: ClusterDetection[]
  thyrocytes: ThyrocyteDetection[]
}

export interface ReportItem {
  id: string
  image_name: string
  date: string
  image: { uri: string }
  detection_result: DetectionResult | null
  original_width?: number
  original_height?: number
}

export default function ReportFolderScreen() {
  const router = useRouter()
  const { show } = useToast();

  const { folderId, folderName } = useLocalSearchParams<{
    folderId: string
    folderName: string
  }>()

  const numericFolderId = Number(folderId)

  // ✅ Hook called inside the component
  const { deleteReport, renameReport } = useReportActions()

  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [selectedReportTitle, setSelectedReportTitle] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [showFloatingActions, setShowFloatingActions] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  useEffect(() => {
    setLoading(true)
    setReports([])
    async function fetchImages() {
      try {
        const data = await getImagesByFolder(Number(folderId))
        // console.log('API response first item:', data[0])
        const mappedReports: ReportItem[] = data.map((img: any) => ({
          id: String(img.id),
          image_name: img.image_name,
          date: img.date ?? '',
          image: { uri: img.image_url },
          detection_result: img.detection_result as DetectionResult | null,
          original_width: img.original_width,   
          original_height: img.original_height  
        }))
        // console.log('Mapped reports first item:', mappedReports[mappedReports.length - 1])
        setReports(mappedReports)
      } catch (error) {
        console.error("Failed to fetch images", error)
      } finally {
        // Minimum 500ms loading time to ensure user sees the loader
        setTimeout(() => setLoading(false), 500)
      }
    }
    fetchImages()
  }, [folderId])

  // Listen for add events from AnalysisScreen
  useRefreshListener(`folder:${numericFolderId}`, (payload) => {
    if (payload?.action === 'add' && payload.item) {
      const item = payload.item
      setReports((prev) => [{
        id: item.id,
        image_name: item.image_name,
        date: item.date,
        image: { uri: item.image_url },  
        detection_result: item.detection_result,
        original_width: item.original_width,
        original_height: item.original_height,
      }, ...prev])
      return
    } else {
        // refetch on unknown action
      ;(async () => {
        setLoading(true)
        try {
          const data = await getImagesByFolder(Number(folderId))
          setReports(data.map((img: any) => ({
            id: String(img.id),
            image_name: img.image_name,
            date: img.date ?? '',
            image: { uri: img.image_url },
            detection_result: img.detection_result as DetectionResult | null,
            original_width: img.original_width,
            original_height: img.original_height,
          })))
        } catch (e) {
          console.error('Failed to refetch images', e)
        } finally {
          setLoading(false)
        }
      })()
    }
  })

  // Listen for delete/rename events from ReportScreen
  useEffect(() => {
    const removeSub = DeviceEventEmitter.addListener('report:remove', (payload: any) => {
      if (!payload?.id) return
      setReports((prev) => prev.filter((r) => r.id !== payload.id))
    })

    const renameSub = DeviceEventEmitter.addListener('report:rename', (payload: any) => {
      if (!payload?.id) return
      setReports((prev) => prev.map((r) =>
        r.id === payload.id ? { ...r, image_name: payload.name } : r
      ))
    })

    return () => {
      removeSub.remove()
      renameSub.remove()
    }
  }, [])

  function handleMenu(reportId: string) {
    const r = reports.find((x) => x.id === reportId)
    setSelectedReportId(reportId)
    setSelectedReportTitle(r ? r.image_name : '')
    setShowFloatingActions(true)
  }

  function handleCardPress(reportId: string) {
    const report = reports.find(r => r.id === reportId)
    if (!report) return
    
    console.log('Navigating to report with dimensions:', { 
      original_width: report.original_width, 
      original_height: report.original_height 
    })

    router.push({
      pathname: '/report-analysis',
      params: {
        image: encodeURIComponent(report.image.uri),
        reportId: report.id,
        reportName: report.image_name,
        folderId: numericFolderId,
        reportDecode: report.detection_result ? JSON.stringify(report.detection_result) : '',
        originalWidth: report.original_width?.toString() || '',
        originalHeight: report.original_height?.toString() || '',
      },
    })

    setSelectedReportId(null)
    setSelectedReportTitle('')
    setShowFloatingActions(false)
  }

  async function handleProviderEdit(originalName: string | undefined, data: { name: string }) {
    const report = reports.find(r => r.image_name === originalName)
    if (!report) return
    try {
    setReports(s => s.map(r => r.id === report.id ? { ...r, image_name: data.name } : r))
      await renameReport(report.id, data.name)
      show('success', 'Renamed', 'Report renamed successfully')
    } catch (err: any) {
      show('danger', 'Error',  'Failed to rename report')
    }
  }

  async function handleProviderDelete(name?: string) {
    const report = reports.find(r => r.image_name === name)
    if (!report) return
    try {
      setReports(s => s.filter(r => r.id !== report.id))
      setShowFloatingActions(false)
      await deleteReport(report.id)
      show('success', 'Deleted', 'Report deleted successfully')
    } catch (err: any) {
      show('danger', 'Error', err.message || 'Failed to delete report')
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <CustomLoader size="large" message="Initializing..." />
      </View>
    )
  }

  return (
    <CreateFolderProvider onEdit={handleProviderEdit} onDelete={handleProviderDelete}>
      <View className="flex-1 bg-gray-100 p-5">
        <View className="w-full mb-4 flex-row items-center px-5 py-2">
          <BackButton />
          <View className="flex-1 items-center">
            <Text className="font-bold text-4xl text-left text-gray-900">
              {folderName}
            </Text>
          </View>
          <View className="w-12" />
        </View>

        <View className="flex-1">
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <CustomLoader size="large" message="Loading reports..." />
            </View>
          ) : reports.length === 0 ? (  
            <View className="bg-white rounded-xl p-4 items-center justify-center border-2 border-dashed border-gray-300">
              <FileSearchCorner size={48} color="#9CA3AF" />
              <Text className="text-gray-400 mt-2 text-center">
                No reports found. Analyze an image and save it to this folder!
              </Text>
            </View>
          ) : (
            <FlatList
              data={reports}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
              columnWrapperStyle={{ justifyContent: 'space-between', marginHorizontal: -8 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View className="px-2 mb-4" style={{ width: 160 }}>
                  <AssessmentReportCardWithSetting
                    title={item.image_name}
                    date={item.date}
                    imageSource={item.image}
                    onPress={() => handleCardPress(item.id)}
                    onLongPress={() => handleMenu(item.id)}
                    onMenuPress={() => handleMenu(item.id)}
                  />
                </View>
              )}
            />
          )}
        </View>

        {showFloatingActions && (
          <>
            <Pressable onPress={() => setShowFloatingActions(false)} className="absolute inset-0" />
            <FloatingActions
              selectedTitle={selectedReportTitle}
              onRequestLocalEdit={() => setEditModalVisible(true)}
              onRequestLocalDelete={() => setDeleteModalVisible(true)}
            />
          </>
        )}

        <EditReportTitleModal
          visible={editModalVisible}
          initialName={selectedReportTitle}
          onClose={() => setEditModalVisible(false)}
          onSave={(newName) => {
            handleProviderEdit(selectedReportTitle ?? undefined, { name: newName })
            setSelectedReportTitle(newName)
            setEditModalVisible(false)
          }}
        />

        <DeleteReportModal
          visible={deleteModalVisible}
          reportName={selectedReportTitle}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={() => {
            handleProviderDelete(selectedReportTitle ?? undefined)
            setDeleteModalVisible(false)
            setShowFloatingActions(false)
            setSelectedReportId(null)
            setSelectedReportTitle('')
          }}
        />
      </View>
    </CreateFolderProvider>
  )
}

function FloatingActions({
  selectedTitle,
  onRequestLocalEdit,
  onRequestLocalDelete,
}: {
  selectedTitle: string | null
  onRequestLocalEdit?: () => void
  onRequestLocalDelete?: () => void
}) {
  const { openEditModal, openDeleteModal, openActionBar } = useCreateFolder()

  return (
    <FloatingActionBar
      onEdit={() => {
        if (selectedTitle) {
          if (onRequestLocalEdit) onRequestLocalEdit()
          else openEditModal({ name: selectedTitle })
        } else openActionBar()
      }}
      onDelete={() => {
        if (selectedTitle) {
          if (onRequestLocalDelete) onRequestLocalDelete()
          else openDeleteModal(selectedTitle ?? undefined)
        } else openActionBar()
      }}
    />
  )
}