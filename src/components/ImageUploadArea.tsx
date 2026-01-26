import React from 'react'
import { View, Text, Pressable, Image } from 'react-native'
import { ImageUp, Trash2 } from 'lucide-react-native'
import { useImagePicker } from '../hooks/useImagePicker'
import Animated from 'react-native-reanimated'
import usePressableAnimation from '../hooks/usePressableAnimation'

type Props = {
  onPick?: (uri: string) => void
  onRemove?: () => void
  externalImageUri?: string | null
  preventLocalPreview?: boolean
}

const ImageUploadArea: React.FC<Props> = ({ onPick, onRemove, externalImageUri = null, preventLocalPreview = false }) => {
  const { imageUri, setImageUri, pickImage } = useImagePicker()
  const { animatedStyle, onPressIn, onPressOut } = usePressableAnimation()

  async function handlePick() {
    const uri = await pickImage()
    if (uri) {
      if (onPick) onPick(uri)
      // otherwise local hook state is already set and will show preview
    }
  }

  const displayUri = externalImageUri ?? imageUri
  const showImage = !!displayUri && (!preventLocalPreview || !!externalImageUri)

  function getFileName(uri: string | null) {
    if (!uri) return ''
    try {
      const parts = uri.split('/')
      return decodeURIComponent(parts[parts.length - 1])
    } catch {
      return uri
    }
  }

  return (
    <View>
      <Pressable onPress={handlePick} onPressIn={onPressIn} onPressOut={onPressOut}>
        <Animated.View style={[{ elevation: 1 }, animatedStyle]} className="bg-white rounded-xl p-4 w-full h-80">
          <View className="flex-1 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center">
            {showImage ? (
              <Image source={{ uri: displayUri! }} className="w-[90%] h-[90%] rounded-lg" resizeMode="cover" />
            ) : (
              <>
                <View className="rounded-full mb-6">
                  <ImageUp size={100} color="#E31837" />
                </View>

                <Text className="text-lg font-bold text-gray-800">Upload your image here</Text>

                <Text className="text-gray-400 mt-1 text-sm">Supports PNG, JPG, JPEG</Text>
              </>
            )}
          </View>
        </Animated.View>
      </Pressable>

      {/* Footer below the dashed box (outside Pressable) */}
      {showImage && (
        <View className="w-full items-center mt-4">
          <Text className="self-start font-bold mb-2">Uploaded image</Text>
          <View className="w-full p-2 border border-emerald-500 rounded-md flex-row items-center justify-between bg-white">
            <Text className="text-gray-600 flex-1 mr-2" numberOfLines={1} ellipsizeMode="tail">{getFileName(displayUri!)}</Text>
            <Pressable onPress={() => {
              // If an external image is provided, prefer the external onRemove handler.
              // For locally-picked images (managed by the hook), clear the local state instead.
              if (externalImageUri) {
                if (onRemove) onRemove()
                else setImageUri(null)
              } else {
                // local image — clear local preview
                setImageUri(null)
                // also call onRemove if explicitly provided and caller expects to be notified
                if (onRemove) onRemove()
              }
            }} className="p-1.5 rounded-full bg-red-100">
              <Trash2 size={15} color="#E11D48" />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  )
}

export default ImageUploadArea
