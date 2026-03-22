import { DeviceEventEmitter } from 'react-native'
import { deleteImage, updateImageName } from '../../../../api/image'
import { useRouter } from 'expo-router'
import { useToast } from '../../../contexts/ToastContext'

export function useReportActions() {
  const router = useRouter()
  const { show } = useToast()

  async function deleteReport(reportId: string, options?: { navigateBack?: boolean }) {
    try {
      await deleteImage(reportId)
      DeviceEventEmitter.emit('recentAnalyses:remove', { id: reportId })
      DeviceEventEmitter.emit('report:remove', { id: reportId })
      show('success', 'Deleted', 'Report has been deleted successfully.') 
      if (options?.navigateBack) router.back()
    } catch (err: any) {
      show('danger', 'Error', err?.message || 'Failed to delete report')
    }
  }

  async function renameReport(reportId: string, newName: string, onSuccess?: (name: string) => void) {
    try {
      await updateImageName(reportId, newName)
      DeviceEventEmitter.emit('report:rename', { id: reportId, name: newName })
      onSuccess?.(newName)
      show('success', 'Updated', `Report renamed to "${newName}".`)
    } catch (err: any) {
      show('danger', 'Error', err?.message || 'Failed to rename report')
    }
  }

  return { deleteReport, renameReport }
}