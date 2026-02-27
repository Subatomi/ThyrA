import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator, Image, Modal, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from '../../../components/BackButton';
import ImageUploadArea from '../../../components/ImageUploadArea';
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState, useEffect, useRef } from 'react';
import { runInference } from 'api/image';
import DetectionOverlay from '@/components/DetectionOverlay';
import { ScanSearch, Download, Trash2, Pencil, X } from 'lucide-react-native';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Button } from 'react-native';
import { Dimensions } from 'react-native';
import { getFolders } from '../../../../api/folder'
import { uploadImage, deleteImage, updateImageName } from '../../../../api/image';
import EditReportTitleModal from '../../library/components/EditReportTitleModal'
import DeleteReportModal from '../../library/components/DeleteReportModal'


export default function ReportScreen() {
  type FolderType = {
    id: string;
    folder_name: string;
  };
const { image, reportId, reportName, reportDecode} = useLocalSearchParams<{
  image?: string
  reportId?: string
  reportName?: string
  reportDecode?: string
}>()
  const router = useRouter()

  // decode route-encoded URIs (file:// and other special chars can break route params)
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
  const [showActions, setShowActions] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  const [selectedReportId, setSelectedReportId] = useState<string | null>(reportId ? String(reportId) : null)
  const [selectedReportTitle, setSelectedReportTitle] = useState<string>(reportName ?? '')


  const [folders, setFolders] = useState<FolderType[]>([])
  const [foldersLoading, setFoldersLoading] = useState(false)



  const handleSaveImage = async () => {
    try {
      setLoading(true)
      const response = await getFolders()
      console.log(response)
      setFolders(response)
      setShowFolderPopup(true)
    } catch (err) {
      Alert.alert("Error", "Failed to load folders")
    } finally {
      setLoading(false)
    }
  }

  const handleFolderSelect = (folder: FolderType) => {
    // First, select the folder and show file name input popup
    setSelectedFolder(folder)
    setFileName('') // Reset file name
    setShowFolderPopup(false)
    setShowFileNamePopup(true)
  }

  const handleConfirmFileName = async () => {
    if (!imageUri || !result || !selectedFolder) {
      Alert.alert("Error", "No analyzed image to save.")
      return
    }

    if (!fileName.trim()) {
      Alert.alert("Error", "Please enter a file name.")
      return
    }

    try {
      setLoading(true)
      setShowFileNamePopup(false)

      const imagePayload = getImageMetaFromUri(imageUri)
      
      // Use user-entered file name, but ensure it has an extension
      const finalFileName = fileName.includes('.') ? fileName : `${fileName}`

      await uploadImage({
        image: imagePayload,
        imageName: finalFileName, // Use the custom file name
        folderId: selectedFolder.id,
        detectionResult: result?.detections,
      })

      Alert.alert("Success", "Image saved successfully!")
      setSelectedFolder(null)
      setFileName('')
    } catch (err) {
      console.error(err)
      Alert.alert("Upload failed", "Could not save image.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!imageUri) return;

    Image.getSize(
      imageUri,
      (width, height) => {
        setImageSize({ width, height });
      },
      (error) => {
        console.error('Failed to get image size:', error);
      }
    );
  }, [imageUri]);

  // update when route param changes
  useEffect(() => {
    if (typeof image === 'string') {
      //setImageUri(decodeURIComponent(image));
      const decoded = decodeURIComponent(image)

      setImageUri(decoded)
      setAnalyzedImageUri(decoded)
      if (reportDecode) {
        setResult(JSON.parse(reportDecode))
      }
      setImageSize(null)

      /*console.log(imageSize)
      console.log(imageUri)
      console.log(result)
      console.log(result.detections?.thyrocytes)
      console.log(analyzedImageUri)*/


    }
  }, [image]);


  const handleDownload = async () => {
    if (!detectionRef.current || !isLayoutReady) return
    try {
      //Ask for permission
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== 'granted') {
        Alert.alert("Permission denied", "Cannot save image without permission.");
        return;
      }

      //Capture the DetectionOverlay as an image
      const uri = await captureRef(detectionRef, {
        format: 'png',
        quality: 1,
      });

      //Save to media library
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('DetectionResults', asset, false);

      Alert.alert("Success", "Image saved to your gallery!");
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to save image.");
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

    return {
      uri,
      fileName: filename,
      type: mimeTypes[ext] || 'image/jpeg',
    };
  };


  const handleAnalyze = async () => {
    if (!imageUri) {
      Alert.alert("No image", "Please upload an image first.");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      // Build image object expected by runInference
      const imagePayload = getImageMetaFromUri(imageUri);

      const response = await runInference(imagePayload);
      setResult(response);

      setAnalyzedImageUri(imageUri);
    } catch (error: any) {
      Alert.alert("Inference failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const FolderItem = ({ folder }: { folder: FolderType }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-200 active:bg-gray-50"
      onPress={() => handleFolderSelect(folder)}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-base font-medium text-gray-800">
            {folder.folder_name}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  function handleProviderEdit(originalName: string | undefined, data: { name: string; description?: string }) {
    if (!originalName) return
    if (!selectedReportId) return
    (async () => {
      try {
        setLoading(true)
        await updateImageName(selectedReportId, data.name)
        setSelectedReportTitle(data.name)
        Alert.alert('Success', 'Report title updated')
      } catch (err: any) {
        console.error('Failed to update report', err)
        Alert.alert('Error', err?.message || 'Failed to update report')
      } finally {
        setLoading(false)
      }
    })()
  }

  function handleProviderDelete(name?: string) {
    if (!name) return
    if (!selectedReportId) return
    (async () => {
      try {
        setLoading(true)
        await deleteImage(selectedReportId)
        Alert.alert('Deleted', 'Report deleted')
        router.back()
      } catch (err: any) {
        console.error('Failed to delete report', err)
        Alert.alert('Error', err?.message || 'Failed to delete report')
      } finally {
        setLoading(false)
      }
    })()
  }

  return (
    <ScrollView className="flex-1 bg-gray-100"
      contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
      <View className='w-full flex-row items-center mb-4 gap-4'>
        <View>
          <BackButton />
        </View>

        <View className='items-center'>
          <Text className="font-bold text-4xl text-center text-gray-900">{reportName}</Text>
        </View>

      </View>

      <View className="w-full mt-6 gap-4">
        <Text className="font-semibold text-xl text-gray-800">
          Detection Result
        </Text>
        {result && result.detection_result?.thyrocytes && imageSize && analyzedImageUri ? (
          <>
            <View className='bg-white rounded-md p-4  overflow-hidden' style={{ elevation: 1 }}>
              <View
                ref={detectionRef}
                collapsable={false}
                style={{
                  width: '100%', // account for ScrollView padding
                  aspectRatio: imageSize.width / imageSize.height,
                  marginVertical: 10,
                }}
                onLayout={() => setIsLayoutReady(true)}
              >
                <DetectionOverlay
                  imageUri={analyzedImageUri}
                  thyrocytes={result.detection_result?.thyrocytes}
                  clusters={result.detection_result?.clusters}
                  originalWidth={imageSize.width}
                  originalHeight={imageSize.height}
                />
              </View>

            </View>

            {/* LEGEND */}
            <View className='flex flex-col bg-white rounded-md p-4  overflow-hidden justify-between gap-5' style={{ elevation: 1 }}>
              <View>
                
                <Text className="text-gray-800 text-md font-bold">Details</Text>
                <Text className="text-sm text-gray-600">Filename: {getImageMetaFromUri(analyzedImageUri).fileName}</Text>
              </View>
              <View className="flex-col justify-start gap-2">
                <Text className="text-gray-800 text-md font-bold">Legend</Text>
                <View className='flex-row gap-4'>
                  <View className="flex-row items-center gap-2">
                    <View className="w-4 h-4 bg-green-500 rounded-sm" />
                    <Text className="text-gray-800 text-sm">Adequate</Text>
                  </View>

                  <View className="flex-row items-center gap-2">
                    <View className="w-4 h-4 bg-blue-500 rounded-sm" />
                    <Text className="text-gray-800 text-sm">Inadequate</Text>
                  </View>
                </View>
              </View>

              {/* <Button title={loading?"...":"Download Result"} onPress={handleDownload} disabled={loading}/> */}
              <View className="gap-3">
                <Pressable onPress={handleDownload} disabled={loading}>
                  {({ pressed }) => (
                    <View
                      className="py-3 rounded-md items-center flex-row justify-center gap-2"
                      style={{ backgroundColor: pressed ? '#15803d' : loading ? '#9ca3af' : '#16a34a' }}
                    >
                      {loading ? (
                        <ActivityIndicator color="white" />
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
            </View>

            <View className="flex-col gap-3 bg-white rounded-md p-4" style={{ elevation: 1 }}>
              <Text className="text-black font-bold text-md">Edit</Text>
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

      {/* Edit / Delete modals for report */}
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
          setShowActions(false)
          setSelectedReportId(null)
          setSelectedReportTitle('')
        }}
      />

    </ScrollView>
  );
}

        