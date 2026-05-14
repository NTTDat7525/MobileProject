import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getTableStatus,
  addTable,
  updateTable,
  deleteTable,
} from '@/src/services/table.service';
import Badge from '@/src/components/common/Badge';
import Input from '@/src/components/common/Input';
import Button from '@/src/components/common/Button';
import LoadingState from '@/src/components/common/LoadingState';
import EmptyState from '@/src/components/common/EmptyState';
import { Colors } from '@/src/constants/colors';
import { Spacing, BorderRadius } from '@/src/constants/spacing';
import { FontSize, FontWeight } from '@/src/constants/typography';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

const LOCATIONS = ['Trong nhà', 'Ngoài trời', 'Sân thượng'];
const STATUSES = ['Có sẵn', 'Đang sử dụng', 'Đã đặt', 'Bảo trì'];

const EMPTY_FORM = {
  tableName: '',
  capacity: '',
  location: 'Trong nhà',
  price: '',
  status: 'Có sẵn',
  image: null,
};

export default function TablesScreen() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadTables(); }, []);

  const loadTables = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTableStatus();
      setTables(res.data?.tables ?? []);
    } catch {
      setError('Không thể tải danh sách bàn.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Bạn cần cấp quyền truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setForm((prev) => ({
        ...prev,
        image: result.assets[0],
      }));
    }
  };

  const openAdd = () => {
    setEditingTable(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalVisible(true);
  };

  const openEdit = (table) => {
    setEditingTable(table);
    setForm({
      tableName: table.tableName,
      capacity: String(table.capacity),
      location: table.location,
      price: String(table.price),
      status: table.status,
      image: table.image ? { uri: `http://192.168.1.8:5001${table.image}` } : null,
    });
    setFormErrors({});
    setModalVisible(true);
  };

  const handleDelete = (table) => {
    Alert.alert(
      'Xoá bàn',
      `Bạn có chắc muốn xoá bàn "${table.tableName}"?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTable(table.id);
              loadTables();
            } catch {
              Alert.alert('Lỗi', 'Không thể xoá bàn. Vui lòng thử lại.');
            }
          },
        },
      ]
    );
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.tableName.trim()) newErrors.tableName = 'Vui lòng nhập tên bàn';
    const cap = parseInt(form.capacity, 10);
    if (!form.capacity || isNaN(cap) || cap < 1 || cap > 20) {
      newErrors.capacity = 'Sức chứa từ 1 đến 20 khách';
    }
    const price = parseFloat(form.price);
    if (!form.price || isNaN(price) || price < 0) {
      newErrors.price = 'Vui lòng nhập giá hợp lệ';
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
      try {
        const formData = new FormData();

      formData.append('tableName', form.tableName.trim());
      formData.append('capacity', parseInt(form.capacity, 10));
      formData.append('location', form.location);
      formData.append('price', parseFloat(form.price));
      formData.append('status', form.status);

      if (form.image) {
        formData.append('image', {
          uri: form.image.uri,
          name: 'table.png',
          type: 'image/png',
        });
      };
      if (editingTable) {
        await updateTable(editingTable.id, formData);
      } else {
        await addTable(formData);
      }
      setModalVisible(false);
      loadTables();
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể lưu. Vui lòng thử lại.';
      Alert.alert('Lỗi', message);
    } finally {
      setSaving(false);
    }
  };

  const setField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const renderTable = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableInfo}>
        <Text style={styles.tableName}>{item.tableName}</Text>
        <Text style={styles.tableDetail}>
          Số lượng khách: {item.capacity} khách • Vị trí: {item.location}
        </Text>
        <Text style={styles.tablePrice}>
          {Number(item.price).toLocaleString('vi-VN')} ₫
        </Text>
      </View>
      <View style={styles.tableRight}>
        <Badge label={item.status} style={styles.tableBadge} />
        <View style={styles.tableActions}>
          <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
            <Text style={styles.editBtnText}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.delBtn} onPress={() => handleDelete(item)}>
            <Text style={styles.delBtnText}>Xoá</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Quản lý bàn</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openAdd}>
          <Ionicons name="add" size={18} color={Colors.white} />
          <Text style={styles.addBtnText}>Thêm bàn</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <LoadingState message="Đang tải danh sách bàn..." />
      ) : error ? (
        <EmptyState tone="error" title="Không tải được bàn" message={error} actionLabel="Thử lại" onAction={loadTables} />
      ) : (
        <FlatList
          data={tables}
          keyExtractor={(item) => item.id}
          renderItem={renderTable}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <EmptyState title="Chưa có bàn nào" message="Thêm bàn đầu tiên để bắt đầu nhận đặt chỗ." actionLabel="Thêm bàn" onAction={openAdd} />
          }
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>
                {editingTable ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}
              </Text>

              <Input
                label="Tên bàn"
                value={form.tableName}
                onChangeText={setField('tableName')}
                placeholder="VD: Bàn 01, Bàn VIP"
                error={formErrors.tableName}
              />
              <Input
                label="Sức chứa (khách)"
                value={form.capacity}
                onChangeText={setField('capacity')}
                placeholder="VD: 4"
                keyboardType="number-pad"
                error={formErrors.capacity}
              />
              <Input
                label="Giá (VNĐ)"
                value={form.price}
                onChangeText={setField('price')}
                placeholder="VD: 500000"
                keyboardType="decimal-pad"
                error={formErrors.price}
              />

              <Text style={styles.pickerLabel}>Vị trí</Text>
              <View style={styles.optionRow}>
                {LOCATIONS.map((loc) => (
                  <TouchableOpacity
                    key={loc}
                    style={[styles.option, form.location === loc && styles.optionActive]}
                    onPress={() => setField('location')(loc)}
                  >
                    <Text style={[styles.optionText, form.location === loc && styles.optionTextActive]}>
                      {loc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.pickerLabel}>Trạng thái</Text>
              <View style={styles.optionRow}>
                {STATUSES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.option, form.status === s && styles.optionActive]}
                    onPress={() => setField('status')(s)}
                  >
                    <Text style={[styles.optionText, form.status === s && styles.optionTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.pickerLabel}>Ảnh bàn</Text>

              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {form.image ? (
                  <Image
                    source={{ uri: form.image.uri }}
                    style={styles.previewImage}
                  />
                ) : (
                  <Text style={{ color: '#888' }}>Chọn ảnh</Text>
                )}
              </TouchableOpacity>

              <View style={styles.modalActions}>
                <Button
                  title="Lưu"
                  onPress={handleSave}
                  loading={saving}
                  style={styles.modalSaveBtn}
                />
                <Button
                  title="Huỷ"
                  variant="outline"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalCancelBtn}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pageTitle: { fontSize: FontSize.xxl, fontWeight: FontWeight.heavy, color: Colors.text },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.full,
  },
  addBtnText: { fontSize: FontSize.sm, color: Colors.white, fontWeight: FontWeight.semibold },
  list: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tableInfo: { flex: 1 },
  tableName: { fontSize: FontSize.base, fontWeight: FontWeight.semibold, color: Colors.text },
  tableDetail: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 3 },
  tablePrice: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.primary,
    marginTop: 3,
  },
  tableRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  tableBadge: {},
  tableActions: { flexDirection: 'row', gap: Spacing.xs, marginTop: Spacing.sm },
  editBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.infoLight,
    borderWidth: 1,
    borderColor: Colors.info,
  },
  editBtnText: { fontSize: FontSize.xs, color: Colors.info, fontWeight: FontWeight.medium },
  delBtn: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.errorLight,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  delBtnText: { fontSize: FontSize.xs, color: Colors.error, fontWeight: FontWeight.medium },
  separator: { height: Spacing.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  errorText: { fontSize: FontSize.base, color: Colors.error, textAlign: 'center' },
  retryText: { fontSize: FontSize.base, color: Colors.primary, marginTop: Spacing.md },
  emptyText: { fontSize: FontSize.base, color: Colors.textSecondary },

  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  pickerLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginBottom: Spacing.md },
  option: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  optionActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  optionText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  optionTextActive: { color: Colors.primaryDark, fontWeight: FontWeight.semibold },
  modalActions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  modalSaveBtn: { flex: 1 },
  modalCancelBtn: { flex: 1 },

  imagePicker: {
    height: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginTop: 5,
  },
});
