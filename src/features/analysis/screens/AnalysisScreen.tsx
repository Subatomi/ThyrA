import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, Image, Modal, TouchableOpacity, FlatList, TextInput, Dimensions, Platform, Linking } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from '../../../components/BackButton';
import ImageUploadArea from '../../../components/ImageUploadArea';
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState, useEffect, useRef } from 'react';
import { runInference } from 'api/image';
import DetectionOverlay from '@/components/DetectionOverlay';
import { ScanSearch, AlertTriangle } from 'lucide-react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { getFolders } from '../../../../api/folder'
import { uploadImage } from '../../../../api/image';
import { DeviceEventEmitter } from 'react-native';
import { useToast } from '../../../contexts/ToastContext'
import { ResumableZoom } from 'react-native-zoom-toolkit'
import * as ImageManipulator from 'expo-image-manipulator';
import PermissionAlertModal from '../components/PermissionAlertModal';
import FolderSelectionModal from '../components/FolderSelectionModal';

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
  const [analyzing, setAnalyzing] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [showPermissionAlert, setShowPermissionAlert] = useState(false)

  const captureRef2 = useRef<View>(null);

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
      // setSavingImage(true)
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
        emit('recentAnalyses', { action: 'refresh' })
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
      // setSavingImage(false)
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
    try {
      setDownloading(true);

      const permissionResult = await MediaLibrary.requestPermissionsAsync(true);

      if (permissionResult.status !== 'granted') {
        if (permissionResult.canAskAgain) {
          const retryResult = await MediaLibrary.requestPermissionsAsync(true);
          if (retryResult.status !== 'granted') {
            showPermissionDeniedAlert();
            return;
          }
        } else {
          showPermissionDeniedAlert();
          return;
        }
      }

      const imageUri = await captureRef(captureRef2, { format: 'png', quality: 1 });
      const asset = await MediaLibrary.createAssetAsync(imageUri);
      await MediaLibrary.createAlbumAsync('DetectionResults', asset, false);
      show('success', 'Saved', 'Image saved to your gallery!')
    } catch (err: any) {
      // console.error('Download error:', err);
      if (err.message?.includes('User didn\'t grant write permission') || 
        err.message?.includes('rejected')) {
        return;
      }
      show('danger', 'Error', err.message || 'Failed to save image.')
    } finally {
      setDownloading(false);
    }
  };

    const showPermissionDeniedAlert = () => {
    setShowPermissionAlert(true);
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

  const CAPTURE_PADDING = 5;
  const detectionWidth = screenWidth - 40;
  const captureImageWidth = detectionWidth - CAPTURE_PADDING * 2;

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
                    ref={captureRef2}
                    collapsable={false}
                    style={{
                      backgroundColor: 'white', // or any background color you want
                      padding: CAPTURE_PADDING,
                    }}
                  >
                    <View
                      ref={detectionRef}
                      collapsable={false}
                      style={{
                        width: captureImageWidth,
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
                        displayWidth={captureImageWidth} 
                      />
                    </View>
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

            <View className="w-full flex-col gap-2">
              <Pressable onPress={handleDownload} disabled={downloading}>
                {({ pressed }) => (
                  <View
                    className="w-full py-3 rounded-sm items-center justify-center flex-row gap-2"
                    style={{ backgroundColor: downloading ? '#9ca3af' : pressed ? '#15803d' : '#16a34a', elevation: 3 }}
                  >
                    {downloading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-bold">Download Result</Text>
                    )}
                  </View>
                )}
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
      <FolderSelectionModal
        visible={showFolderPopup}
        onClose={() => setShowFolderPopup(false)}
        folders={folders}
        loading={foldersLoading}
        onSelectFolder={handleFolderSelect}
      />

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
            {/* <View className="flex-row justify-end space-x-3">
              <TouchableOpacity
                className="px-5 py-2 rounded-lg"
                onPress={() => { setShowFileNamePopup(false); setSelectedFolder(null); setFileName('') }}
              >
                <Text className="text-gray-600 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-blue-500 px-5 py-2 rounded-lg"
                onPress={handleConfirmFileName}
                disabled={savingImage}
              >
                {savingImage ? <ActivityIndicator color="white" size="small" /> : <Text className="text-white font-medium">Save</Text>}
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </Modal>

      {/* Permission Alert Modal */}
      <PermissionAlertModal visible={showPermissionAlert} onClose={() => setShowPermissionAlert(false)} />
    </ScrollView>
  );
}