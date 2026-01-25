import { View , ScrollView} from 'react-native';
import AssessmentReportCard from './AssessmentReportCard';

const RecentAnalysis = () => {
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between gap-5"> 
            <AssessmentReportCard title='Sample Title 1' date='2026-01-23' imageSource={require('../../../../assets/img/sampleImages/sample1.jpg')}></AssessmentReportCard>
            <AssessmentReportCard title='Sample Title 2' date='2026-01-23' imageSource={require('../../../../assets/img/sampleImages/sample2.jpg')}></AssessmentReportCard>
            <AssessmentReportCard title='Sample Title 3' date='2026-01-23' imageSource={require('../../../../assets/img/sampleImages/sample3.jpg')}></AssessmentReportCard>
        </View>
    </ScrollView>
  );
}

export default RecentAnalysis;
