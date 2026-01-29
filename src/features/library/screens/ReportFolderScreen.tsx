import React, { useState } from 'react'
import { View, Text, Alert, Pressable, FlatList } from 'react-native'
import BackButton from '../../../components/BackButton'
import AssessmentReportCardWithSetting from '../components/AssessmentReportCardWithSetting'
import FloatingActionBar from '../components/FloatingActionBar'
import CreateFolderProvider, { useCreateFolder } from '../hooks/CreateFolderModalContext'
import EditReportTitleModal from '../components/EditReportTitleModal'
import DeleteReportModal from '../components/DeleteReportModal'
import { ScanSearch } from 'lucide-react-native'

export default function ReportFolderScreen() {
  const [reports, setReports] = useState<Array<{ id: string; title: string; date: string; image: any }>>([
    { id: 'r1', title: 'Sample Title', date: 'MM/DD/YYYY', image: require('../../../../assets/img/sampleImages/sample1.jpg') },
    { id: 'r2', title: 'Sample Title', date: 'MM/DD/YYYY', image: require('../../../../assets/img/sampleImages/sample2.jpg') },
    { id: 'r3', title: 'Sample Title', date: 'MM/DD/YYYY', image: require('../../../../assets/img/sampleImages/sample3.jpg') },
    { id: 'r4', title: 'Sample Title', date: 'MM/DD/YYYY', image: require('../../../../assets/img/sampleImages/sample1.jpg') },
    { id: 'r5', title: 'Sample Title', date: 'MM/DD/YYYY', image: require('../../../../assets/img/sampleImages/sample2.jpg') },
    { id: 'r6', title: 'Sample Title', date: 'MM/DD/YYYY', image: require('../../../../assets/img/sampleImages/sample3.jpg') },
  ])

  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [selectedReportTitle, setSelectedReportTitle] = useState('')
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [showFloatingActions, setShowFloatingActions] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)

  function handleMenu(reportId: string) {
    const r = reports.find((x) => x.id === reportId)
    setSelectedReportId(reportId)
    setSelectedReportTitle(r ? r.title : '')
    setShowFloatingActions(true)
  }

  function handleCardPress(reportId: string) {
    Alert.alert('Open report', `Open report ${reportId}`)
    setSelectedReportId(null)
    setSelectedReportTitle('')
    setShowFloatingActions(false)
  }

  function handleProviderEdit(originalName: string | undefined, data: { name: string; description?: string }) {
    if (!originalName) return
    setReports((s) => s.map((r) => (r.title === originalName ? { ...r, title: data.name } : r)))
  }

  function handleProviderDelete(name?: string) {
    if (!name) return
    setReports((s) => s.filter((r) => r.title !== name))
    setShowFloatingActions(false)
  }

  return (
    <CreateFolderProvider onEdit={handleProviderEdit} onDelete={handleProviderDelete}>
      <View className="flex-1 bg-gray-100 p-5">
        <View className="w-full mb-4 flex-row items-center px-5 py-2">
          <BackButton />
          <View className="flex-1 items-center">
            <Text className="font-bold text-4xl text-left text-gray-900">Folder Title</Text>
          </View>
          <View className="w-12" />
        </View>

        <View className="flex-1 items-center ">
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
                  title={item.title}
                  date={item.date}
                  imageSource={item.image}
                  onPress={() => handleCardPress(item.id)}
                  onLongPress={() => handleMenu(item.id)}
                  onMenuPress={() => handleMenu(item.id)}
                />
              </View>
            )}
          />
          
          {/* <View className="bg-white rounded-xl p-4 items-center justify-center border-2 border-dashed border-gray-300">
            <ScanSearch size={48} color="#9CA3AF" />
            <Text className="text-gray-400 mt-2 text-center">
              No reports in these folders. Create some reports in this folder to see them here!
            </Text>
          </View> */}
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
    <>
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
    </>
  )
}