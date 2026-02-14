// import React, { useState } from 'react'
// import { View, Text, Alert, Pressable, FlatList } from 'react-native'
// import BackButton from '../../../components/BackButton'
// import AssessmentReportCardWithSetting from '../components/AssessmentReportCardWithSetting'
// import FloatingActionBar from '../components/FloatingActionBar'
// import CreateFolderProvider, { useCreateFolder } from '../hooks/CreateFolderModalContext'
// import EditReportTitleModal from '../components/EditReportTitleModal'
// import DeleteReportModal from '../components/DeleteReportModal'
// import { ScanSearch } from 'lucide-react-native'

// export default function ReportFolderScreen() {
//   const [reports, setReports] = useState<Array<{ id: string; title: string; date: string; image: any }>>([
//     { id: 'r1', title: 'Sample Title', date: 'MM/DD/YYYY', image: require('../../../../assets/img/sampleImages/sample1.jpg') },
//     { id: 'r2', title: 'Sample Title', date: 'MM/DD/YYYY', image: require('../../../../assets/img/sampleImages/sample2.jpg') },
//     { id: 'r3', title: 'Sample Title', date: 'MM/DD/YYYY', image: require('../../../../assets/img/sampleImages/sample3.jpg') },
//     { id: 'r4', title: 'Sample Title', date: 'MM/DD/YYYY', image: require('../../../../assets/img/sampleImages/sample1.jpg') },
//     { id: 'r5', title: 'Sample Title', date: 'MM/DD/YYYY', image: require('../../../../assets/img/sampleImages/sample2.jpg') },
//     { id: 'r6', title: 'Sample Title', date: 'MM/DD/YYYY', image: require('../../../../assets/img/sampleImages/sample3.jpg') },
//   ])

//   const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
//   const [selectedReportTitle, setSelectedReportTitle] = useState('')
//   const [editModalVisible, setEditModalVisible] = useState(false)
//   const [showFloatingActions, setShowFloatingActions] = useState(false)
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false)

//   function handleMenu(reportId: string) {
//     const r = reports.find((x) => x.id === reportId)
//     setSelectedReportId(reportId)
//     setSelectedReportTitle(r ? r.title : '')
//     setShowFloatingActions(true)
//   }

//   function handleCardPress(reportId: string) {
//     Alert.alert('Open report', `Open report ${reportId}`)
//     setSelectedReportId(null)
//     setSelectedReportTitle('')
//     setShowFloatingActions(false)
//   }

//   function handleProviderEdit(originalName: string | undefined, data: { name: string; description?: string }) {
//     if (!originalName) return
//     setReports((s) => s.map((r) => (r.title === originalName ? { ...r, title: data.name } : r)))
//   }

//   function handleProviderDelete(name?: string) {
//     if (!name) return
//     setReports((s) => s.filter((r) => r.title !== name))
//     setShowFloatingActions(false)
//   }

//   return (
//     <CreateFolderProvider onEdit={handleProviderEdit} onDelete={handleProviderDelete}>
//       <View className="flex-1 bg-gray-100 p-5">
//         <View className="w-full mb-4 flex-row items-center px-5 py-2">
//           <BackButton />
//           <View className="flex-1 items-center">
//             <Text className="font-bold text-4xl text-left text-gray-900">Folder Title</Text>
//           </View>
//           <View className="w-12" />
//         </View>

//         <View className="flex-1 items-center ">
//           <FlatList
//             data={reports}
//             keyExtractor={(item) => item.id}
//             numColumns={2}
//             contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
//             columnWrapperStyle={{ justifyContent: 'flex-start', marginHorizontal: -8 }}
//             showsVerticalScrollIndicator={false}
//             renderItem={({ item }) => (
//               <View className="px-2 mb-4" style={{ width: 160 }}>
//                 <AssessmentReportCardWithSetting
//                   title={item.title}
//                   date={item.date}
//                   imageSource={item.image}
//                   onPress={() => handleCardPress(item.id)}
//                   onLongPress={() => handleMenu(item.id)}
//                   onMenuPress={() => handleMenu(item.id)}
//                 />
//               </View>
//             )}
//           />
          
//           {/* <View className="bg-white rounded-xl p-4 items-center justify-center border-2 border-dashed border-gray-300">
//             <ScanSearch size={48} color="#9CA3AF" />
//             <Text className="text-gray-400 mt-2 text-center">
//               No reports in these folders. Create some reports in this folder to see them here!
//             </Text>
//           </View> */}
//         </View>
        
//         {showFloatingActions && (
//           <>
//             <Pressable onPress={() => setShowFloatingActions(false)} className="absolute inset-0" />
//             <FloatingActions
//               selectedTitle={selectedReportTitle}
//               onRequestLocalEdit={() => setEditModalVisible(true)}
//               onRequestLocalDelete={() => setDeleteModalVisible(true)}
//             />
//           </>
//         )}

//         <EditReportTitleModal
//           visible={editModalVisible}
//           initialName={selectedReportTitle}
//           onClose={() => setEditModalVisible(false)}
//           onSave={(newName) => {
//             handleProviderEdit(selectedReportTitle ?? undefined, { name: newName })
//             setSelectedReportTitle(newName)
//             setEditModalVisible(false)
//           }}
//         />

//         <DeleteReportModal
//           visible={deleteModalVisible}
//           reportName={selectedReportTitle}
//           onClose={() => setDeleteModalVisible(false)}
//           onConfirm={() => {
//             handleProviderDelete(selectedReportTitle ?? undefined)
//             setDeleteModalVisible(false)
//             setShowFloatingActions(false)
//             setSelectedReportId(null)
//             setSelectedReportTitle('')
//           }}
//         />
//       </View>
//     </CreateFolderProvider>
//   )
// }

// function FloatingActions({ selectedTitle, onRequestLocalEdit, onRequestLocalDelete }: { selectedTitle: string | null; onRequestLocalEdit?: () => void; onRequestLocalDelete?: () => void }) {
//   const { openEditModal, openDeleteModal, openActionBar } = useCreateFolder()

//   return (
//     <>
//       <FloatingActionBar
//         onEdit={() => {
//           if (selectedTitle) {
//             if (onRequestLocalEdit) onRequestLocalEdit()
//             else openEditModal({ name: selectedTitle })
//           } else openActionBar()
//         }}
//         onDelete={() => {
//           if (selectedTitle) {
//             if (onRequestLocalDelete) onRequestLocalDelete()
//             else openDeleteModal(selectedTitle ?? undefined)
//           } else openActionBar()
//         }}
//       />
//     </>
//   )
// }









import React, { useState, useEffect } from 'react'
import { View, Text, Alert, Pressable, FlatList, ActivityIndicator } from 'react-native'
import BackButton from '../../../components/BackButton'
import AssessmentReportCardWithSetting from '../components/AssessmentReportCardWithSetting'
import FloatingActionBar from '../components/FloatingActionBar'
import CreateFolderProvider, { useCreateFolder } from '../hooks/CreateFolderModalContext'
import EditReportTitleModal from '../components/EditReportTitleModal'
import DeleteReportModal from '../components/DeleteReportModal'
import { getFolders,getImagesByFolder } from '../../../../api/folder' // import your getFolders function
import { useLocalSearchParams } from 'expo-router'
import { useRouter } from 'expo-router'
type ReportFolderScreenRoute = {
  params: {
    folderId: number;
    folderName: string;
  };
};

// Bounding box = [x1, y1, x2, y2]
export type BBox = [number, number, number, number]

export interface ThyrocyteDetection {
  bbox: BBox
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
}

export default function ReportFolderScreen() {
  const router = useRouter()
  const { folderId, folderName } = useLocalSearchParams<{
    folderId: string
    folderName: string
  }>()

  const numericFolderId = Number(folderId)


  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [selectedReportTitle, setSelectedReportTitle] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [showFloatingActions, setShowFloatingActions] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

useEffect(() => {
  setReports([])
  async function fetchImages() {
    try {
      const data = await getImagesByFolder(Number(folderId))

const mappedReports: ReportItem[] = data.map((img: any) => ({
  id: String(img.id),
  image_name: img.image_name,
  date: "",
  image: { uri: img.image_url },
  detection_result: img.detection_result as DetectionResult | null,
}))


      setReports(mappedReports)
    } catch (error) {
      console.error("Failed to fetch images", error)
    } finally {
      setLoading(false)
    }
  }

  fetchImages()
}, [folderId])


  function handleMenu(reportId: string) {
    const r = reports.find((x) => x.id === reportId)
    setSelectedReportId(reportId)
    setSelectedReportTitle(r ? r.image_name : '')
    setShowFloatingActions(true)
  }

function handleCardPress(reportId: string) {

  const report = reports.find(r => r.id === reportId)

  console.log(JSON.stringify(report.detection_result))
  if (!report) return

  router.push({
    pathname: '/report-analysis',
    params: {
      image: encodeURIComponent(report.image.uri),
      reportId: report.id,
      reportName: report.image_name,

      // MUST be string
      reportDecode: report.detection_result
        ? JSON.stringify(report)
        : "",
    },
  })

  setSelectedReportId(null)
  setSelectedReportTitle('')
  setShowFloatingActions(false)
}



  function handleProviderEdit(originalName: string | undefined, data: { name: string; description?: string }) {
    if (!originalName) return
   setReports((s) =>
  s.map((r) =>
    r.image_name === originalName ? { ...r, image_name: data.name } : r
  )
)

  }

  function handleProviderDelete(name?: string) {
    if (!name) return
    setReports((s) => s.filter((r) => r.image_name !== name))
    setShowFloatingActions(false)
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#000" />
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

        <View className="flex-1 items-center ">
          {reports.length === 0 ? (
            <Text className="text-gray-400 mt-2 text-center">
              No folders found. Create some folders to see them here!
            </Text>
          ) : (
            <FlatList
              data={reports}
              keyExtractor={(item) => item.id}
              numColumns={2}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
              columnWrapperStyle={{ justifyContent: 'flex-start', marginHorizontal: -8 }}
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

function FloatingActions({ selectedTitle, onRequestLocalEdit, onRequestLocalDelete }: { selectedTitle: string | null; onRequestLocalEdit?: () => void; onRequestLocalDelete?: () => void }) {
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
