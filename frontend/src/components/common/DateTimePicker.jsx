import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/src/constants/colors';

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function DateTimeInlinePicker({ value, onChange, error }) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState('date');

    const now = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    const selectedDate = value ? new Date(value) : new Date();

    const toggle = () => {
        LayoutAnimation.easeInEaseOut();
        setOpen(!open);
        setStep('date');
    };

    const handleChange = (event, date) => {
        if (!date) return;

        const current = new Date(value || new Date());

        if (step === 'date') {
            current.setFullYear(date.getFullYear());
            current.setMonth(date.getMonth());
            current.setDate(date.getDate());
            setStep('time');
        } else {
            current.setHours(date.getHours());
            current.setMinutes(date.getMinutes());
            onChange(current.toISOString());
            setOpen(false);
            setStep('date');
            return;
        }

        if (current < now || current > maxDate) return;

        onChange(current.toISOString());
    };

    const timeSlots = useMemo(() => {
        const list = [];

        for (let h = 10; h <= 22; h++) {
            for (let m of [0, 30]) {
                const d = new Date(selectedDate);
                d.setHours(h);
                d.setMinutes(m);

                if (d > now) list.push(d);
            }
        }

        return list;
    }, [selectedDate]);

    return (
        <View>

            <TouchableOpacity style={styles.input} onPress={toggle}>
                <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
                <Text style={[ styles.text, { color: value ? '#000' : '#999' }]}>
                    {value ? new Date(value).toLocaleString('vi-VN') : 'Chọn thời gian'}
                </Text>
                <Ionicons
                    name={open ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color="#666"
                    style={{ marginLeft: 'auto' }}
                />
            </TouchableOpacity>

            {!!error && <Text style={styles.error}>{error}</Text>}

            {open && (
                <View style={styles.panel}>

                    <Text style={styles.title}>
                        {step === 'date' ? 'Chọn ngày' : 'Chọn giờ'}
                    </Text>

                    {step === 'date' && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display="spinner"
                            minimumDate={now}
                            maximumDate={maxDate}
                            onChange={handleChange}
                        />
                    )}

                    {step === 'time' && (
                        <ScrollView
                            style={{ maxHeight: 250 }}
                            showsVerticalScrollIndicator={false}
                            nestedScrollEnabled
                            >
                            {timeSlots.map((item) => {
                                const isSelected =
                                value && new Date(value).getTime() === item.getTime();

                                return (
                                <TouchableOpacity
                                    key={item.toISOString()}
                                    style={[
                                    styles.timeItem,
                                    isSelected && { backgroundColor: Colors.primaryLight }
                                    ]}
                                    onPress={() => handleChange(null, item)}
                                >
                                    <Ionicons name="time-outline" size={18} color={Colors.primary} />
                                    <Text style={styles.timeText}>
                                    {item.toLocaleTimeString('vi-VN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                    </Text>
                                </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}

                </View>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        backgroundColor: '#fff',
    },

    text: {
        marginLeft: 10,
        color: '#000',
    },

    panel: {
        marginTop: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 12,
        backgroundColor: '#fff',
    },

    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#000',
    },

    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },

    timeText: {
        marginLeft: 10,
        color: '#000',
    },

    error: {
        color: 'red',
        marginTop: 6,
    },
});