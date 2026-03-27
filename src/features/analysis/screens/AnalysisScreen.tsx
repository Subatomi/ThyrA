// import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, Image, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native';
// import { ScrollView } from 'react-native-gesture-handler';
// import BackButton from '../../../components/BackButton';
// import ImageUploadArea from '../../../components/ImageUploadArea';
// import { useLocalSearchParams, useRouter } from 'expo-router'
// import { useState, useEffect, useRef } from 'react';
// import { runInference } from 'api/image';
// import DetectionOverlay from '@/components/DetectionOverlay';
// import { ScanSearch } from 'lucide-react-native';
// import { captureRef } from 'react-native-view-shot';
// import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
// import { Button } from 'react-native';
// import { Dimensions } from 'react-native';
// import { getFolders } from '../../../../api/folder'
// import { uploadImage } from '../../../../api/image';
// import { DeviceEventEmitter } from 'react-native';
// import { useToast } from '../../../contexts/ToastContext'


// export default function AnalysisScreen() {
//   const emit = DeviceEventEmitter.emit.bind(DeviceEventEmitter) 
//   const { show } = useToast()
//   type FolderType = {
//     id: string;
//     folder_name: string;
//   };
//   const { image } = useLocalSearchParams() as { image?: string }
//   const router = useRouter()

//   // decode route-encoded URIs (file:// and other special chars can break route params)
//   const initialImageUri = typeof image === 'string' ? decodeURIComponent(image) : null;
//   const [imageUri, setImageUri] = useState<string | null>(initialImageUri)

//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState<any>(null);

//   const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
//   const [analyzedImageUri, setAnalyzedImageUri] = useState<string | null>(null);

//   const detectionRef = useRef<View>(null);
//   const [isLayoutReady, setIsLayoutReady] = useState(false);

//   const screenWidth = Dimensions.get('window').width;

//   const [showFolderPopup, setShowFolderPopup] = useState(false)
//   const [showFileNamePopup, setShowFileNamePopup] = useState(false)
//   const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null)
//   const [fileName, setFileName] = useState('')


//   const [folders, setFolders] = useState<FolderType[]>([])
//   const [foldersLoading, setFoldersLoading] = useState(false)



//   const handleSaveImage = async () => {
//     try {
//       setLoading(true)
//       const response = await getFolders()
//       console.log(response)
//       setFolders(response)
//       setShowFolderPopup(true)
//     } catch (err) {
//       show('danger', 'Error', 'Failed to load folders')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleFolderSelect = (folder: FolderType) => {
//     // First, select the folder and show file name input popup
//     setSelectedFolder(folder)
//     setFileName('') // Reset file name
//     setShowFolderPopup(false)
//     setShowFileNamePopup(true)
//   }

//   const handleConfirmFileName = async () => {
//   if (!imageUri || !result || !selectedFolder) {
//     show('warning', 'Error', 'No analyzed image to save.')
//     return
//   }

//   if (!fileName.trim()) {
//     show('warning', 'Invalid', 'Please enter a file name.')
//     return
//   }

//   try {
//     setLoading(true)
//     setShowFileNamePopup(false)

//     const imagePayload = getImageMetaFromUri(imageUri)
//     const finalFileName = fileName.includes('.') ? fileName : `${fileName}`

//     const created = await uploadImage({
//       image: imagePayload,
//       imageName: finalFileName,
//       folderId: selectedFolder.id,
//       detectionResult: result?.detections,
//     })

//     if (created && created.id) {
//       const createdItem = {
//         id: String(created.id),
//         image_name: created.image_name ?? finalFileName,
//         date: created.created_at ?? new Date().toISOString(),
//         image_url: created.image_url ?? imageUri,
//         detection_result: created.detection_result ?? result?.detections ?? null,
//         folder_id: selectedFolder.id,
//       }

//       emit(`folder:${selectedFolder.id}`, { action: 'add', item: createdItem })
//       emit('recentAnalyses', { action: 'add', item: createdItem })
//     } else {
//       emit(`folder:${selectedFolder.id}`)
//       emit('recentAnalyses')
//     }

//     show('success', 'Saved', 'Image saved successfully!')
//     setSelectedFolder(null)
//     setFileName('')
//   } catch (err) {
//     // console.error(err)
//     const message = err instanceof Error ? err.message : 'Failed to save image.'
//     if (message.toLowerCase().includes('already exists')) {
//       setShowFileNamePopup(true)
//       show('warning', 'Name Taken', `"${fileName}" already exists in this folder. Please choose a different name.`)
//     } else {
//       show('danger', 'Error', message)
//     }
//   } finally {
//     setLoading(false)
//   }
// }
//   useEffect(() => {
//     if (!imageUri) return;

//     Image.getSize(
//       imageUri,
//       (width, height) => {
//         setImageSize({ width, height });
//       },
//       (error) => {
//         // console.error('Failed to get image size:', error);
//       }
//     );
//   }, [imageUri]);

//   // update when route param changes
//   useEffect(() => {
//     if (typeof image === 'string') {
//       //setImageUri(decodeURIComponent(image));
//       const decoded = decodeURIComponent(image)

//       setImageUri(decoded)
//       setAnalyzedImageUri(null)
//       setResult(null)
//       setImageSize(null)


//     }
//   }, [image]);


//   const handleDownload = async () => {
//     if (!detectionRef.current || !isLayoutReady) return
//     try {
//       //Ask for permission
//       const { status } = await MediaLibrary.requestPermissionsAsync(true);
//       if (status !== 'granted') { 
//         show('warning', 'Permission Denied', 'Cannot save image without permission.')
//         return;
//       }

//       //Capture the DetectionOverlay as an image
//       const uri = await captureRef(detectionRef, {
//         format: 'png',
//         quality: 1,
//       });

//       //Save to media library
//       const asset = await MediaLibrary.createAssetAsync(uri);
//       await MediaLibrary.createAlbumAsync('DetectionResults', asset, false);
//       show('success', 'Saved', 'Image saved to your gallery!')
//     } catch (err: any) {
//       // console.error(err);
//       show('danger', 'Error', err.message || 'Failed to save image.')
//     }
//   };



//   const getImageMetaFromUri = (uri: string) => {
//     const filename = uri.split('/').pop() || 'image.jpg';
//     const match = /\.(\w+)$/.exec(filename);

//     const ext = match ? match[1].toLowerCase() : 'jpg';

//     const mimeTypes: Record<string, string> = {
//       jpg: 'image/jpeg',
//       jpeg: 'image/jpeg',
//       png: 'image/png',
//       webp: 'image/webp',
//       heic: 'image/heic',
//     };

//     return {
//       uri,
//       fileName: filename,
//       type: mimeTypes[ext] || 'image/jpeg',
//     };
//   };


//   const handleAnalyze = async () => {
//     if (!imageUri) {
//       show('warning', 'No Image', 'Please upload an image first.')
//       return;
//     }

//     try {
//       setLoading(true);
//       setResult(null);

//       // Build image object expected by runInference
//       const imagePayload = getImageMetaFromUri(imageUri);

//       const response = await runInference(imagePayload);
//       setResult(response);

//       setAnalyzedImageUri(imageUri);
//     } catch (error: any) {
//       show('danger', 'Inference Failed', error.message || 'Something went wrong')
//     } finally {
//       setLoading(false);
//     }
//   };


//   const FolderItem = ({ folder }: { folder: FolderType }) => (
//     <TouchableOpacity
//       className="p-4 border-b border-gray-200 active:bg-gray-50"
//       onPress={() => handleFolderSelect(folder)}
//     >
//       <View className="flex-row justify-between items-center">
//         <View className="flex-1">
//           <Text className="text-base font-medium text-gray-800">
//             {folder.folder_name}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   )

//   return (
//     <ScrollView className="flex-1 bg-gray-100"
//       contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
//       <View className='w-full flex-row items-center mb-4 gap-4'>
//         <View>
//           <BackButton />
//         </View>

//         <View className='items-center'>
//           <Text className="font-bold text-4xl text-center text-gray-900">Analysis</Text>
//         </View>

//       </View>

//       <View className="w-full my-4">
//         <ImageUploadArea
//           externalImageUri={imageUri}
//           disabled={false}
//           onPick={(uri) => {
//             setImageUri(uri)
//             setAnalyzedImageUri(null);
//             setResult(null);
//             setImageSize(null);
//           }}
//           onRemove={() => {
//             setImageUri(null)
//           }}
//         />
//       </View>

//       {/* ANALYZE BUTTON */}
//       <Pressable
//         className="w-full mb-6 mt-2"
//         onPress={handleAnalyze}
//         disabled={loading}
//       >
//         <View
//           style={{ elevation: 3 }}
//           className={`py-4 rounded-lg items-center justify-center ${loading ? "bg-gray-400" : "bg-red-500"
//             }`}
//         >
//           {loading ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text className="text-white font-bold text-xl">
//               Analyze
//             </Text>
//           )}
//         </View>
//       </Pressable>

//       <View className="w-full mt-6 gap-4">
//         <Text className="font-semibold text-xl text-gray-800">
//           Detection Result
//         </Text>

//         {result && result.detections?.thyrocytes && imageSize && analyzedImageUri ? (
//           <>
//             <View
//               ref={detectionRef}
//               collapsable={false}
//               style={{
//                 width: screenWidth - 40, // account for ScrollView padding
//                 aspectRatio: imageSize.width / imageSize.height,
//                 marginVertical: 10,
//               }}
//               onLayout={() => setIsLayoutReady(true)}
//             >
//               <DetectionOverlay
//                 imageUri={analyzedImageUri}
//                 thyrocytes={result.detections?.thyrocytes}
//                 clusters={result.detections?.clusters}
//                 originalWidth={imageSize.width}
//                 originalHeight={imageSize.height}
//               />
//             </View>

//             {/* LEGEND */}
//             <View className="flex-row justify-start items-center gap-4">
//               <View className="flex-row items-center gap-2">
//                 <View className="w-4 h-4 bg-green-500 rounded-sm" />
//                 <Text className="text-gray-800 text-sm">Adequate</Text>
//               </View>

//               <View className="flex-row items-center gap-2">
//                 <View className="w-4 h-4 bg-blue-500 rounded-sm" />
//                 <Text className="text-gray-800 text-sm">Inadequate</Text>
//               </View>
//             </View>
//             <Button title={loading?"...":"Download Result"} onPress={handleDownload} disabled={loading}/>
//             <Button title={loading?"...":"Save Image"} onPress={handleSaveImage} disabled={loading}/>
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


//       {/* Folder Selection Popup */}
//       <Modal
//         visible={showFolderPopup}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowFolderPopup(false)}
//       >
//         <View className="flex-1 justify-end bg-black/50">
//           <View className="bg-white rounded-t-3xl max-h-3/4">
//             <View className="p-4 border-b border-gray-200">
//               <View className="flex-row justify-between items-center mb-2">
//                 <Text className="text-xl font-bold text-gray-900">Select Folder</Text>
//                 <TouchableOpacity onPress={() => setShowFolderPopup(false)}>
//                   <Text className="text-lg text-gray-500">✕</Text>
//                 </TouchableOpacity>
//               </View>
//               <Text className="text-gray-600">Choose where to save the image</Text>
//             </View>

//             {foldersLoading ? (
//               <View className="p-6 items-center">
//                 <ActivityIndicator />
//                 <Text className="text-gray-500 mt-2">Loading folders...</Text>
//               </View>
//             ) : (
//               <FlatList
//                 data={folders}
//                 keyExtractor={(item) => item.id.toString()}
//                 renderItem={({ item }) => <FolderItem folder={item} />}
//                 ListEmptyComponent={
//                   <View className="p-6 items-center">
//                     <Text className="text-gray-500">No folders found</Text>
//                   </View>
//                 }
//               />
//             )}


//           </View>
//         </View>
//       </Modal>



//       {/* File Name Input Popup */}
//       <Modal
//         visible={showFileNamePopup}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={() => {
//           setShowFileNamePopup(false)
//           setSelectedFolder(null)
//           setFileName('')
//         }}
//       >
//         <View className="flex-1 justify-center items-center bg-black/50 p-4">
//           <View className="bg-white rounded-2xl w-full max-w-md p-6">
//             <Text className="text-xl font-bold text-gray-900 mb-2">
//               Save to {selectedFolder?.folder_name}
//             </Text>
//             <Text className="text-gray-600 mb-6">
//               Enter a name for your image file
//             </Text>

//             <TextInput
//               className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-800"
//               placeholder="Enter file name (e.g., my_analysis_result)"
//               value={fileName}
//               onChangeText={setFileName}
//               autoFocus={true}
//               onSubmitEditing={handleConfirmFileName}
//             />

//             <View className="flex-row justify-end space-x-3">
//               <TouchableOpacity
//                 className="px-5 py-2 rounded-lg"
//                 onPress={() => {
//                   setShowFileNamePopup(false)
//                   setSelectedFolder(null)
//                   setFileName('')
//                 }}
//               >
//                 <Text className="text-gray-600 font-medium">Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 className="bg-blue-500 px-5 py-2 rounded-lg"
//                 onPress={handleConfirmFileName}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="white" size="small" />
//                 ) : (
//                   <Text className="text-white font-medium">Save</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//   );
// }

import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, Image, Modal, TouchableOpacity, FlatList, TextInput, Dimensions, PixelRatio } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from '../../../components/BackButton';
import ImageUploadArea from '../../../components/ImageUploadArea';
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState, useEffect, useRef } from 'react';
import { runInference } from 'api/image';
import DetectionOverlay from '@/components/DetectionOverlay';
import { ScanSearch } from 'lucide-react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { Button } from 'react-native';
import { getFolders } from '../../../../api/folder'
import { uploadImage } from '../../../../api/image';
import { DeviceEventEmitter } from 'react-native';
import { useToast } from '../../../contexts/ToastContext'
import { ResumableZoom } from 'react-native-zoom-toolkit'  
import * as ImageManipulator from 'expo-image-manipulator';

export default function AnalysisScreen() {
  const emit = DeviceEventEmitter.emit.bind(DeviceEventEmitter)
  const { show } = useToast()
  type FolderType = {
    id: string;
    folder_name: string;
  };
  const { image } = useLocalSearchParams() as { image?: string }
  const router = useRouter()

  const initialImageUri = typeof image === 'string' ? decodeURIComponent(image) : null;
  const [imageUri, setImageUri] = useState<string | null>(initialImageUri)

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const [analyzedImageUri, setAnalyzedImageUri] = useState<string | null>(null);

  const detectionRef = useRef<View>(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  const [showFolderPopup, setShowFolderPopup] = useState(false)
  const [showFileNamePopup, setShowFileNamePopup] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<FolderType | null>(null)
  const [fileName, setFileName] = useState('')

  const [folders, setFolders] = useState<FolderType[]>([])
  const [foldersLoading, setFoldersLoading] = useState(false)
  const [savingImage, setSavingImage] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleSaveImage = async () => {
    try {
      setFoldersLoading(true)
      const response = await getFolders()
      setFolders(response)
      setShowFolderPopup(true)
    } catch (err) {
      show('danger', 'Error', 'Failed to load folders')
    } finally {
      setFoldersLoading(false)
    }
  }

  const handleFolderSelect = (folder: FolderType) => {
    setSelectedFolder(folder)
    setFileName('')
    setShowFolderPopup(false)
    setShowFileNamePopup(true)
  }

  const handleConfirmFileName = async () => {
    if (!imageUri || !result || !selectedFolder) {
      show('warning', 'Error', 'No analyzed image to save.')
      return
    }
    if (!fileName.trim()) {
      show('warning', 'Invalid', 'Please enter a file name.')
      return
    }
    try {
      setSavingImage(true)
      setShowFileNamePopup(false)
      
      // Ensure we have the image size before uploading
      let finalImageSize = imageSize
      if (!finalImageSize) {
        finalImageSize = await getOriginalImageSize(imageUri)
        setImageSize(finalImageSize)
      }
      
      const imagePayload = getImageMetaFromUri(imageUri)
      const finalFileName = fileName.includes('.') ? fileName : `${fileName}`
      const created = await uploadImage({
        image: imagePayload,
        imageName: finalFileName,
        folderId: selectedFolder.id,
        detectionResult: result?.detections,
        originalWidth: finalImageSize?.width,
        originalHeight: finalImageSize?.height, 
      })
      if (created && created.id) {
        const createdItem = {
          id: String(created.id),
          image_name: created.image_name ?? finalFileName,
          date: created.created_at ?? new Date().toISOString(),
          image_url: created.image_url ?? imageUri,
          detection_result: created.detection_result ?? result?.detections ?? null,
          folder_id: selectedFolder.id,
          original_width: finalImageSize?.width,
          original_height: finalImageSize?.height,
        }
        emit(`folder:${selectedFolder.id}`, { action: 'add', item: createdItem })
        emit('recentAnalyses', { action: 'add', item: createdItem })
      } else {
        emit(`folder:${selectedFolder.id}`)
        emit('recentAnalyses')
      }
      show('success', 'Saved', 'Image saved successfully!')
      setSelectedFolder(null)
      setFileName('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save image.'
      if (message.toLowerCase().includes('already exists')) {
        setShowFileNamePopup(true)
        show('warning', 'Name Taken', `"${fileName}" already exists in this folder. Please choose a different name.`)
      } else {
        show('danger', 'Error', message)
      }
    } finally {
      setSavingImage(false)
    }
  }

  useEffect(() => {
    if (imageUri) {
      getOriginalImageSize(imageUri).then(setImageSize);
    }
  }, [imageUri]);



  useEffect(() => {
    if (typeof image === 'string') {
      const decoded = decodeURIComponent(image)
      setImageUri(decoded)
      setAnalyzedImageUri(null)
      setResult(null)
      setImageSize(null)
    }
  }, [image]);

  const handleDownload = async () => {
    if (!detectionRef.current || !isLayoutReady) {
      show('warning', 'Not Ready', 'Please wait for detection to complete.')
      return;
    }
    try {
      setDownloading(true);
      
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== 'granted') {
        show('warning', 'Permission Denied', 'Cannot save image without permission.')
        return;
      }

      
      // Permission is granted, save directly
      const imageUri = await captureRef(detectionRef, { format: 'png', quality: 1 });
      const asset = await MediaLibrary.createAssetAsync(imageUri);
      await MediaLibrary.createAlbumAsync('DetectionResults', asset, false);
      show('success', 'Saved', 'Image saved to your gallery!')
    } catch (err: any) {
      console.error('Download error:', err);
      show('danger', 'Error', err.message || 'Failed to save image.')
    } finally {
      setDownloading(false);
    }
  };

  const getImageMetaFromUri = (uri: string) => {
    const filename = uri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const ext = match ? match[1].toLowerCase() : 'jpg';
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      heic: 'image/heic',
    };
    return { uri, fileName: filename, type: mimeTypes[ext] || 'image/jpeg' };
  };

  const getOriginalImageSize = async (uri: string) => {
    const result = await ImageManipulator.manipulateAsync(uri, [], { base64: false });
    return { width: result.width, height: result.height };
  };

  const handleAnalyze = async () => {
    if (!imageUri) {
      show('warning', 'No Image', 'Please upload an image first.')
      return;
    }
    try {
      setAnalyzing(true);
      setResult(null);
      setAnalyzedImageUri(null);

      const imagePayload = getImageMetaFromUri(imageUri);
      const response = await runInference(imagePayload);

      setResult(response);
      setAnalyzedImageUri(imageUri);
    } catch (error: any) {
      show('danger', 'Inference Failed', error.message || 'Something went wrong')
    } finally {
      setAnalyzing(false);
    }
  };

  const FolderItem = ({ folder }: { folder: FolderType }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-200 active:bg-gray-50"
      onPress={() => handleFolderSelect(folder)}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-800">{folder.folder_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const detectionWidth = screenWidth - 40

  return (
    <ScrollView className="flex-1 bg-gray-100"
      contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
      <View className='w-full flex-row items-center mb-4 gap-4'>
        <View><BackButton /></View>
        <View className='items-center'>
          <Text className="font-bold text-4xl text-center text-gray-900">Analysis</Text>
        </View>
      </View>

      <View className="w-full my-4">
        <ImageUploadArea
          externalImageUri={imageUri}
          disabled={false}
          onPick={(uri) => {
            setImageUri(uri)
            setAnalyzedImageUri(null);
            setResult(null);
            setImageSize(null);
          }}
          onRemove={() => setImageUri(null)}
        />
      </View>

      {/* ANALYZE BUTTON */}
      <Pressable className="w-full mb-6 mt-2" onPress={handleAnalyze} disabled={analyzing}>
        <View
          style={{ elevation: 3 }}
          className={`py-4 rounded-lg items-center justify-center ${analyzing ? "bg-gray-400" : "bg-red-500"}`}
        >
          {analyzing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-xl">Analyze</Text>
          )}
        </View>
      </Pressable>

      <View className="w-full mt-6 gap-4">
        <Text className="font-semibold text-xl text-gray-800">Detection Result</Text>

        {result && result.detections?.thyrocytes && imageSize && analyzedImageUri ? (
          <>
            {/* 
              ResumableZoom lives HERE in AnalysisScreen, not inside DetectionOverlay.
              The inner View with ref is what gets captured for download.
            */}
            <View style={{ overflow: 'hidden' }}>
              <ResumableZoom maxScale={8} minScale={1} >
                <View
                  ref={detectionRef}
                  collapsable={false}
                  style={{
                    width: detectionWidth,
                    aspectRatio: imageSize.width / imageSize.height,
                    marginVertical: 10,
                  }}
                  onLayout={() => setIsLayoutReady(true)}
                >
                  <DetectionOverlay
                    imageUri={analyzedImageUri}
                    thyrocytes={result.detections?.thyrocytes}
                    clusters={result.detections?.clusters}
                    originalWidth={imageSize.width}
                    originalHeight={imageSize.height}
                    displayWidth={detectionWidth}
                  />
                </View>
              </ResumableZoom>
            </View>

            {/* NEW legend — paste this in its place */}
            <View className="flex-row justify-start items-center gap-4 flex-wrap">
              <View className="flex-row items-center gap-2">
                <View className="w-4 h-4 bg-green-500 rounded-sm" />
                <Text className="text-gray-800 text-sm">Adequate</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="w-4 h-4 bg-blue-500 rounded-sm" />
                <Text className="text-gray-800 text-sm">Inadequate</Text>
              </View>
              {/* NEW */}
              <View className="flex-row items-center gap-2">
                <View className="w-4 h-4 bg-red-500 rounded-sm" />
                <Text className="text-gray-800 text-sm">Isolated</Text>
              </View>
            </View>

            <View className="flex-col gap-2">
              <Pressable className="flex-1" onPress={handleDownload} disabled={downloading}>
                <View
                  style={{ elevation: 3 }}
                  className={`py-3 rounded-sm items-center justify-center ${downloading ? "bg-gray-400" : "bg-blue-500"}`}
                >
                  {downloading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold">Download Result</Text>
                  )}
                </View>
              </Pressable>

              <Pressable className="flex-1 mb-6" onPress={handleSaveImage} disabled={savingImage}>
                <View
                  style={{ elevation: 3 }}
                  className={`py-3 rounded-sm items-center justify-center ${savingImage ? "bg-gray-400" : "bg-blue-500"}`}
                >
                  {savingImage ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-bold">Save Image</Text>
                  )}
                </View>
              </Pressable>
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

      {/* Folder Selection Popup */}
      <Modal visible={showFolderPopup} transparent={true} animationType="slide" onRequestClose={() => setShowFolderPopup(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl max-h-3/4">
            <View className="p-4 border-b border-gray-200">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xl font-bold text-gray-900">Select Folder</Text>
                <TouchableOpacity onPress={() => setShowFolderPopup(false)}>
                  <Text className="text-lg text-gray-500">✕</Text>
                </TouchableOpacity>
              </View>
              <Text className="text-gray-600">Choose where to save the image</Text>
            </View>
            {foldersLoading ? (
              <View className="p-6 items-center">
                <ActivityIndicator />
                <Text className="text-gray-500 mt-2">Loading folders...</Text>
              </View>
            ) : (
              <FlatList
                data={folders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <FolderItem folder={item} />}
                ListEmptyComponent={
                  <View className="p-6 items-center">
                    <Text className="text-gray-500">No folders found</Text>
                  </View>
                }
              />
            )}
          </View>
        </View>
      </Modal>

      {/* File Name Input Popup */}
      <Modal
        visible={showFileNamePopup}
        transparent={true}
        animationType="fade"
        onRequestClose={() => { setShowFileNamePopup(false); setSelectedFolder(null); setFileName('') }}
      >
        <View className="flex-1 justify-center items-center bg-black/50 p-4">
          <View className="bg-white rounded-2xl w-full max-w-md p-6">
            <Text className="text-xl font-bold text-gray-900 mb-2">Save to {selectedFolder?.folder_name}</Text>
            <Text className="text-gray-600 mb-6">Enter a name for your image file</Text>
            <TextInput
              className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 text-gray-800"
              placeholder="Enter file name (e.g., my_analysis_result)"
              value={fileName}
              onChangeText={setFileName}
              autoFocus={true}
              onSubmitEditing={handleConfirmFileName}
            />
            <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                className="px-5 py-2 rounded-lg"
                onPress={() => { setShowFileNamePopup(false); setSelectedFolder(null); setFileName('') }}
              >
                <Text className="text-gray-600 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 px-5 py-2 rounded-lg"
                onPress={handleConfirmFileName}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-medium">Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}