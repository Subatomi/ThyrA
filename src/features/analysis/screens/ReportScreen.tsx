// import { View, Text, Pressable, ActivityIndicator, Image } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
// import BackButton from '../../../components/BackButton';
// import { useLocalSearchParams } from 'expo-router'
// import { useState, useEffect, useRef } from 'react';
// import DetectionOverlay from '@/components/DetectionOverlay';
// import { ScanSearch, Download, Trash2, Pencil } from 'lucide-react-native';
// import { captureRef } from 'react-native-view-shot';
// import * as MediaLibrary from 'expo-media-library';
// import { Dimensions, DeviceEventEmitter } from 'react-native';
// import EditReportTitleModal from '../../library/components/EditReportTitleModal'
// import DeleteReportModal from '../../library/components/DeleteReportModal'
// import { useReportActions } from '../../analysis/hooks/userReportActions'
// import { useToast } from '../../../contexts/ToastContext'

// export default function ReportScreen() {
//   const { image, reportId, reportName, reportDecode } = useLocalSearchParams<{
//     image?: string
//     reportId?: string
//     reportName?: string
//     reportDecode?: string
//   }>()

//   const { deleteReport, renameReport } = useReportActions()
//   const { show } = useToast()

//   const currentReportId = reportId ? String(reportId) : null
//   const imageUri = typeof image === 'string' ? decodeURIComponent(image) : null

//   const [result, setResult] = useState<any>(null)
//   const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)
//   const [displayName, setDisplayName] = useState(reportName ?? '')
//   const [editModalVisible, setEditModalVisible] = useState(false)
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false)
//   const [isLayoutReady, setIsLayoutReady] = useState(false)

//   const detectionRef = useRef<View>(null)

//   useEffect(() => {
//     if (reportDecode) setResult(JSON.parse(reportDecode))
//   }, [reportDecode])

//   useEffect(() => {
//     if (!imageUri) return
//     Image.getSize(imageUri, (width, height) => setImageSize({ width, height }))
//   }, [imageUri])

//   useEffect(() => {
//     const sub = DeviceEventEmitter.addListener('report:rename', (payload: any) => {
//       if (payload?.id === currentReportId) setDisplayName(payload.name)
//     })
//     return () => sub.remove()
//   }, [currentReportId])

//   const handleDownload = async () => {
//     if (!detectionRef.current || !isLayoutReady) return
//     try {
//       const { status } = await MediaLibrary.requestPermissionsAsync(true)
//       if (status !== 'granted') {
//         show('warning', 'Permission Denied', 'Cannot save image without permission.')
//         return
//       }
//       const uri = await captureRef(detectionRef, { format: 'png', quality: 1 })
//       const asset = await MediaLibrary.createAssetAsync(uri)
//       await MediaLibrary.createAlbumAsync('DetectionResults', asset, false)
//       show('success', 'Saved', 'Image saved to your gallery!')
//     } catch (err: any) {
//       show('danger', 'Error', err.message || 'Failed to save image.')
//     }
//   }

//   const hasResult = result?.detection_result?.thyrocytes && imageSize && imageUri

//   return (
//     <ScrollView className="flex-1 bg-gray-100" contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
//       <View className='w-full flex-row items-center mb-4 gap-4'>
//         <BackButton />
//         <View className='items-center'>
//           <Text className="font-bold text-4xl text-center text-gray-900">{displayName}</Text>
//         </View>
//       </View>

//       <View className="w-full mt-6 gap-4">
//         <Text className="font-semibold text-xl text-gray-800">Detection Result</Text>

//         {hasResult ? (
//           <>
//             <View className='bg-white rounded-md p-4 overflow-hidden' style={{ elevation: 1 }}>
//               <View
//                 ref={detectionRef}
//                 collapsable={false}
//                 style={{ width: '100%', aspectRatio: imageSize!.width / imageSize!.height, marginVertical: 10 }}
//                 onLayout={() => setIsLayoutReady(true)}
//               >
//                 <DetectionOverlay
//                   imageUri={imageUri!}
//                   thyrocytes={result.detection_result.thyrocytes}
//                   clusters={result.detection_result.clusters}
//                   originalWidth={imageSize!.width}
//                   originalHeight={imageSize!.height}
//                 />
//               </View>
//             </View>

//             <View className='bg-white rounded-md p-4 gap-4' style={{ elevation: 1 }}>
//               <View>
//                 <Text className="text-gray-800 font-bold">Legend</Text>
//                 <View className='flex-row gap-4 mt-2'>
//                   <View className="flex-row items-center gap-2">
//                     <View className="w-4 h-4 bg-green-500 rounded-sm" />
//                     <Text className="text-gray-800 text-sm">Adequate</Text>
//                   </View>
//                   <View className="flex-row items-center gap-2">
//                     <View className="w-4 h-4 bg-blue-500 rounded-sm" />
//                     <Text className="text-gray-800 text-sm">Inadequate</Text>
//                   </View>
//                 </View>
//               </View>

//               <Pressable onPress={handleDownload}>
//                 {({ pressed }) => (
//                   <View
//                     className="py-3 rounded-md items-center flex-row justify-center gap-2"
//                     style={{ backgroundColor: pressed ? '#15803d' : '#16a34a' }}
//                   >
//                     <Download size={16} color="white" />
//                     <Text className="text-white font-bold">Download Result</Text>
//                   </View>
//                 )}
//               </Pressable>
//             </View>

//             <View className="bg-white rounded-md p-4 gap-3" style={{ elevation: 1 }}>
//               <Text className="text-black font-bold">Edit</Text>
//               <View className='flex-row justify-end gap-3'>
//                 <Pressable onPress={() => setEditModalVisible(true)}>
//                   {({ pressed }) => (
//                     <View
//                       className="p-2 rounded-md flex-row gap-2 border border-black/20"
//                       style={{ backgroundColor: pressed ? '#e5e7eb' : '#f3f4f6' }}
//                     >
//                       <Pencil size={16} color="#6b7280" />
//                       <Text className="text-black/60">Edit Name</Text>
//                     </View>
//                   )}
//                 </Pressable>
//                 <Pressable onPress={() => setDeleteModalVisible(true)}>
//                   {({ pressed }) => (
//                     <View
//                       className="p-2 rounded-md flex-row gap-2 border border-black/20"
//                       style={{ backgroundColor: pressed ? '#e5e7eb' : '#f3f4f6' }}
//                     >
//                       <Trash2 size={16} color="#6b7280" />
//                       <Text className="text-black/60">Delete Report</Text>
//                     </View>
//                   )}
//                 </Pressable>
//               </View>
//             </View>
//           </>
//         ) : (
//           <View className="bg-white rounded-xl p-4 items-center justify-center border-2 border-dashed border-gray-300">
//             <ScanSearch size={48} color="#9CA3AF" />
//             <Text className="text-gray-400 mt-2 text-center">
//               No results are shown. Upload a valid image for analysis to see them here!
//             </Text>
//           </View>
//         )}
//       </View>

//       <EditReportTitleModal
//         visible={editModalVisible}
//         initialName={displayName}
//         onClose={() => setEditModalVisible(false)}
//         onSave={(newName) => {
//           if (!currentReportId) return
//           renameReport(currentReportId, newName, (updated) => setDisplayName(updated))
//           setEditModalVisible(false)
//         }}
//       />

//       <DeleteReportModal
//         visible={deleteModalVisible}
//         reportName={displayName}
//         onClose={() => setDeleteModalVisible(false)}
//         onConfirm={() => {
//           if (!currentReportId) return
//           deleteReport(currentReportId, { navigateBack: true })
//           setDeleteModalVisible(false)
//         }}
//       />
//     </ScrollView>
//   )
// }

import { View, Text, Pressable, ActivityIndicator, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from '../../../components/BackButton';
import { useLocalSearchParams } from 'expo-router'
import { useState, useEffect, useRef } from 'react';
import DetectionOverlay from '@/components/DetectionOverlay';
import { ScanSearch, Download, Trash2, Pencil } from 'lucide-react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { Dimensions, DeviceEventEmitter } from 'react-native';
import EditReportTitleModal from '../../library/components/EditReportTitleModal'
import DeleteReportModal from '../../library/components/DeleteReportModal'
import { useReportActions } from '../../analysis/hooks/userReportActions'
import { useToast } from '../../../contexts/ToastContext'
import { ResumableZoom } from 'react-native-zoom-toolkit'

const screenWidth = Dimensions.get('window').width;
const CAPTURE_PADDING = 10;
// screen - scroll padding (20×2) - card padding (16×2) = screenWidth - 72
const detectionWidth = screenWidth - 72;
// shrink further to fit inside the capture wrapper's padding
const captureImageWidth = detectionWidth - CAPTURE_PADDING * 2;

export default function ReportScreen() {
  const { image, reportId, reportName, reportDecode, originalWidth, originalHeight } = useLocalSearchParams<{
    image?: string
    reportId?: string
    reportName?: string
    reportDecode?: string
    originalWidth?: string
    originalHeight?: string
  }>()

  const { deleteReport, renameReport } = useReportActions()
  const { show } = useToast()

  const currentReportId = reportId ? String(reportId) : null
  const imageUri = typeof image === 'string' ? decodeURIComponent(image) : null

  const [result, setResult] = useState<any>(null)
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)
  const [displayName, setDisplayName] = useState(reportName ?? '')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [isLayoutReady, setIsLayoutReady] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const captureRef2 = useRef<View>(null);   // ← capture target
  const detectionRef = useRef<View>(null)   // ← layout-ready signal only

  useEffect(() => {
  if (reportDecode) {
    const parsed = JSON.parse(reportDecode)
    console.log('total thyrocytes:', parsed.detection_result?.thyrocytes?.length)
    console.log('first thyrocyte:', parsed.detection_result?.thyrocytes?.[0])
    console.log('last thyrocyte:', parsed.detection_result?.thyrocytes?.slice(-1)[0])
  }
}, [reportDecode])

  useEffect(() => {
    if (reportDecode) {
      const parsed = JSON.parse(reportDecode)
      
      console.log('total thyrocytes:', parsed.thyrocytes?.length)
      console.log('first thyrocyte:', parsed.thyrocytes?.[0])
      console.log('last thyrocyte:', parsed.thyrocytes?.slice(-1)[0])
      setResult({ detection_result: parsed })
      //setResult(parsed)
    }
  }, [reportDecode])

  useEffect(() => {
    if (!imageUri) return
    Image.getSize(imageUri, (width, height) => setImageSize({ width, height }))
  }, [imageUri])

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('report:rename', (payload: any) => {
      if (payload?.id === currentReportId) setDisplayName(payload.name)
    })
    return () => sub.remove()
  }, [currentReportId])

  const handleDownload = async () => {
    if (!captureRef2.current || !isLayoutReady) {
      show('warning', 'Not Ready', 'Please wait for the detection to render.')
      return
    }
    try {
      setDownloading(true)
      const { status } = await MediaLibrary.requestPermissionsAsync(true)
      if (status !== 'granted') {
        show('warning', 'Permission Denied', 'Cannot save image without permission.')
        return
      }
      const uri = await captureRef(captureRef2, { format: 'png', quality: 1 })
      const asset = await MediaLibrary.createAssetAsync(uri)
      await MediaLibrary.createAlbumAsync('DetectionResults', asset, false)
      show('success', 'Saved', 'Image saved to your gallery!')
    } catch (err: any) {
      show('danger', 'Error', err.message || 'Failed to save image.')
    } finally {
      setDownloading(false)
    }
  }

  const hasResult = result?.detection_result?.thyrocytes && imageSize && imageUri

  return (
    <ScrollView className="flex-1 bg-gray-100" contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
      <View className='w-full flex-row items-center mb-4 gap-4'>
        <BackButton />
        <View className='items-center'>
          <Text className="font-bold text-4xl text-center text-gray-900">{displayName}</Text>
        </View>
      </View>

      <View className="w-full mt-6 gap-4">
        <Text className="font-semibold text-xl text-gray-800">Detection Result</Text>

        {hasResult ? (
          <>
            <View className='bg-white rounded-md p-4 overflow-hidden' style={{ elevation: 1 }}>
              <View style={{ overflow: 'hidden' }}>
                <ResumableZoom maxScale={8} minScale={1}>
                  {/* Outer view — just for zoom gesture bounds */}
                  <View
                    ref={detectionRef}
                    collapsable={false}
                    style={{
                      width: detectionWidth,
                      aspectRatio: imageSize!.width / imageSize!.height,
                      marginVertical: 10,
                    }}
                    onLayout={() => setIsLayoutReady(true)}
                  >
                    {/* Capture wrapper — adds padding without clipping content */}
                    <View
                      ref={captureRef2}
                      collapsable={false}
                      style={{
                        flex: 1,
                        padding: CAPTURE_PADDING,
                        backgroundColor: 'white',
                      }}
                    >
                      <DetectionOverlay
                        imageUri={imageUri!}
                        thyrocytes={result.detection_result.thyrocytes}
                        clusters={result.detection_result.clusters}
                        originalWidth={originalWidth ? parseInt(originalWidth) : (result?.original_width || imageSize!.width)}
                        originalHeight={originalHeight ? parseInt(originalHeight) : (result?.original_height || imageSize!.height)}
                        displayWidth={captureImageWidth}   // ← reduced width
                      />
                    </View>
                  </View>
                </ResumableZoom>
              </View>
            </View>

            {/* Legend + Download */}
            <View className='bg-white rounded-md p-4 gap-4' style={{ elevation: 1 }}>
              <View className="flex-row justify-start items-center gap-4 flex-wrap">
                <View className="flex-row items-center gap-2">
                  <View className="w-4 h-4 bg-green-500 rounded-sm" />
                  <Text className="text-gray-800 text-sm">Adequate</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="w-4 h-4 bg-blue-500 rounded-sm" />
                  <Text className="text-gray-800 text-sm">Inadequate</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="w-4 h-4 bg-red-500 rounded-sm" />
                  <Text className="text-gray-800 text-sm">Isolated</Text>
                </View>
              </View>

              <Pressable onPress={handleDownload} disabled={downloading}>
                {({ pressed }) => (
                  <View
                    className="py-3 rounded-md items-center flex-row justify-center gap-2"
                    style={{ backgroundColor: downloading ? '#9ca3af' : pressed ? '#15803d' : '#16a34a' }}
                  >
                    {downloading ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <>
                        <Download size={16} color="white" />
                        <Text className="text-white font-bold">Download Result</Text>
                      </>
                    )}
                  </View>
                )}
              </Pressable>
            </View>

            {/* Edit controls */}
            <View className="bg-white rounded-md p-4 gap-3" style={{ elevation: 1 }}>
              <Text className="text-black font-bold">Edit</Text>
              <View className='flex-row justify-end gap-3'>
                <Pressable onPress={() => setEditModalVisible(true)}>
                  {({ pressed }) => (
                    <View
                      className="p-2 rounded-md flex-row gap-2 border border-black/20"
                      style={{ backgroundColor: pressed ? '#e5e7eb' : '#f3f4f6' }}
                    >
                      <Pencil size={16} color="#6b7280" />
                      <Text className="text-black/60">Edit Name</Text>
                    </View>
                  )}
                </Pressable>
                <Pressable onPress={() => setDeleteModalVisible(true)}>
                  {({ pressed }) => (
                    <View
                      className="p-2 rounded-md flex-row gap-2 border border-black/20"
                      style={{ backgroundColor: pressed ? '#e5e7eb' : '#f3f4f6' }}
                    >
                      <Trash2 size={16} color="#6b7280" />
                      <Text className="text-black/60">Delete Report</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>
          </>
        ) : (
          <View className="bg-white rounded-xl p-4 items-center justify-center border-2 border-dashed border-gray-300">
            <ScanSearch size={48} color="#9CA3AF" />
            <Text className="text-gray-400 mt-2 text-center">
              No results are shown. Upload a valid image for analysis to see them here!
            </Text>
          </View>
        )}
      </View>

      <EditReportTitleModal
        visible={editModalVisible}
        initialName={displayName}
        onClose={() => setEditModalVisible(false)}
        onSave={(newName) => {
          if (!currentReportId) return
          renameReport(currentReportId, newName, (updated) => setDisplayName(updated))
          setEditModalVisible(false)
        }}
      />

      <DeleteReportModal
        visible={deleteModalVisible}
        reportName={displayName}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={() => {
          if (!currentReportId) return
          deleteReport(currentReportId, { navigateBack: true })
          setDeleteModalVisible(false)
        }}
      />
    </ScrollView>
  )
}