import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import BottomNavigation from '../../components/ui/BottomNavigation';
import { enqueueOfflineMutation } from '../../sync/syncEngine';

export default function FollowupsListScreen() {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [completedSuccess, setCompletedSuccess] = useState(false);

  const tasks = [
    {
      id: 'flw_1',
      patientName: 'Ramesh Patil',
      type: 'Post-Consultation & Referral Return',
      priority: 'HIGH',
      dueDate: 'Today (04 Sep)',
      village: 'Shivapur Sector 2',
      status: 'DUE_TODAY',
      instruction: 'Verify BP & medication compliance following Mulshi RH referral consultation.',
    },
    {
      id: 'flw_2',
      patientName: 'Sunita Patil',
      type: 'Maternal Care (ANC 2nd Trimester)',
      priority: 'PRIORITY',
      dueDate: 'Today (04 Sep)',
      village: 'Shivapur Sector 2',
      status: 'DUE_TODAY',
      instruction: 'Check hemoglobin, iron-folic acid tablet supply & blood pressure.',
    },
    {
      id: 'flw_3',
      patientName: 'Parvati Patil',
      type: 'Hypertension Community Check',
      priority: 'OVERDUE',
      dueDate: '02 Sep 2026',
      village: 'Shivapur Sector 2',
      status: 'OVERDUE',
      instruction: 'Record blood pressure reading & check refill stock for Amlodipine 5mg.',
    },
  ];

  const handleCompleteOutreach = async () => {
    if (!selectedTask) return;

    await enqueueOfflineMutation({
      clientUuid: `flw_comp_${Date.now()}`,
      entityType: 'FOLLOWUP',
      operation: 'UPDATE',
      payload: {
        followUpId: selectedTask.id,
        status: 'COMPLETED',
        outcomeNotes: outcomeNotes || 'Outreach completed at patient residence. Vitals normal, medication compliance verified.',
        completedAt: new Date().toISOString(),
      },
    });

    setCompletedSuccess(true);
    setTimeout(() => {
      setSelectedTask(null);
      setCompletedSuccess(false);
      setOutcomeNotes('');
    }, 1500);
  };

  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />

        <View style={s.body}>
          <Text style={s.title}>COMMUNITY FOLLOW-UP TASKS</Text>
          <Text style={s.sub}>
            Assigned outreach tasks for ASHA Sunita More (Shivapur Sector 2)
          </Text>

          {tasks.map((task) => (
            <Card key={task.id}>
              <View style={s.taskHeader}>
                <View style={s.taskHeaderLeft}>
                  <Text style={s.patientName}>{task.patientName}</Text>
                  <Text style={s.dueDate}>({task.dueDate})</Text>
                </View>
                <Badge label={task.status} type={task.priority} size="sm" />
              </View>

              <Text style={s.taskType}>{task.type}</Text>
              <Text style={s.instruction}>{task.instruction}</Text>

              <Button
                title="Record Home Visit Outreach"
                variant={task.status === 'OVERDUE' ? 'danger' : 'primary'}
                size="sm"
                onPress={() => setSelectedTask(task)}
                style={{ marginTop: 8 }}
              />
            </Card>
          ))}

          {/* Complete Outreach Modal */}
          <Modal visible={selectedTask !== null} transparent animationType="slide">
            <View style={s.modalOverlay}>
              <View style={s.modalBox}>
                <Text style={s.modalTitle}>Record Outreach Outcome</Text>
                <Text style={s.modalSub}>
                  Patient: <Text style={s.modalPatient}>{selectedTask?.patientName}</Text>
                </Text>

                {!completedSuccess ? (
                  <View>
                    <Text style={s.inputLabel}>OUTREACH NOTES & VITALS</Text>
                    <TextInput
                      multiline
                      numberOfLines={3}
                      placeholder="Record patient condition, vitals observed, and medication status..."
                      value={outcomeNotes}
                      onChangeText={setOutcomeNotes}
                      style={s.textArea}
                      placeholderTextColor="#94A3B8"
                    />

                    <Button
                      title="Save Outreach Outcome (Offline Queue)"
                      variant="success"
                      onPress={handleCompleteOutreach}
                      style={{ marginBottom: 8 }}
                    />
                    <TouchableOpacity
                      onPress={() => setSelectedTask(null)}
                      style={s.cancelBtn}
                    >
                      <Text style={s.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={s.successBox}>
                    <CheckCircle2 size={48} color="#107C41" />
                    <Text style={s.successTitle}>Follow-up Recorded!</Text>
                    <Text style={s.successSub}>
                      Saved to local database. 1 update queued for backend sync.
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </View>
      </ScreenContainer>
      <BottomNavigation />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  body: { padding: 16 },
  title: { color: '#1E293B', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  sub: { color: '#64748B', fontSize: 12, marginBottom: 16 },
  taskHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  taskHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  patientName: { fontWeight: '700', color: '#1E293B', fontSize: 15 },
  dueDate: { color: '#64748B', fontSize: 12, marginLeft: 6 },
  taskType: { color: '#06469B', fontWeight: '600', fontSize: 12, marginBottom: 4 },
  instruction: { color: '#64748B', fontSize: 12, marginBottom: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalTitle: { color: '#1E293B', fontWeight: '700', fontSize: 17, marginBottom: 4 },
  modalSub: { color: '#64748B', fontSize: 12, marginBottom: 16 },
  modalPatient: { fontWeight: '700', color: '#06469B' },
  inputLabel: { color: '#64748B', fontSize: 11, fontWeight: '700', marginBottom: 6 },
  textArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 12, fontSize: 13, color: '#1E293B', minHeight: 80, textAlignVertical: 'top', marginBottom: 16 },
  cancelBtn: { paddingVertical: 10, alignItems: 'center' },
  cancelText: { color: '#64748B', fontWeight: '600', fontSize: 14 },
  successBox: { alignItems: 'center', paddingVertical: 24 },
  successTitle: { fontWeight: '700', color: '#064E3B', fontSize: 18, marginTop: 12 },
  successSub: { color: '#065F46', fontSize: 12, textAlign: 'center', marginTop: 6 },
});
